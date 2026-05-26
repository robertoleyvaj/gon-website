import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, total, clienteInfo } = body;
    // items = array de CartItem del contexto
    // clienteInfo = { nombre, email, telefono, direccion }

    // ── 1. Upsert cliente ──────────────────────────────────────────────
    let clienteId: number | null = null;

    if (clienteInfo?.email) {
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', clienteInfo.email)
        .maybeSingle();

      if (clienteExistente) {
        clienteId = clienteExistente.id;
        // Actualizar datos si faltan
        await supabase.from('clientes').update({
          nombre: clienteInfo.nombre || undefined,
          telefono: clienteInfo.telefono || undefined,
          direccion: clienteInfo.direccion || undefined,
        }).eq('id', clienteId);
      } else {
        const { data: nuevoCliente } = await supabase
          .from('clientes')
          .insert({
            nombre: clienteInfo.nombre || '',
            email: clienteInfo.email,
            telefono: clienteInfo.telefono || '',
            direccion: clienteInfo.direccion || '',
          })
          .select()
          .single();
        if (nuevoCliente) clienteId = nuevoCliente.id;
      }
    }

    // ── 2. Crear pedidos en Supabase (uno por item del carrito) ────────
    const pedidoIds: number[] = [];

    for (const item of items) {
      // Descripción legible para notas_cliente
      const descripcion = item.solo_armazon
        ? `${item.armazon_nombre} — Solo armazón`
        : [
            item.armazon_nombre,
            item.lentes?.vision_nombre && `Visión: ${item.lentes.vision_nombre}`,
            item.lentes?.material_nombre && `Material: ${item.lentes.material_nombre}`,
            item.lentes?.filtros_nombres?.length > 0 && `Filtros: ${item.lentes.filtros_nombres.join(', ')}`,
            item.paciente && `Para: ${item.paciente}`,
          ].filter(Boolean).join(' · ');

      // Configuración completa como JSON
      const configuracion = item.solo_armazon ? null : {
        vision: item.lentes?.vision,
        vision_nombre: item.lentes?.vision_nombre,
        vision_precio: item.lentes?.vision_precio,
        material: item.lentes?.material,
        material_nombre: item.lentes?.material_nombre,
        material_precio: item.lentes?.material_precio,
        filtros: item.lentes?.filtros,
        filtros_nombres: item.lentes?.filtros_nombres,
        filtros_precio: item.lentes?.filtros_precio,
        solo_armazon: false,
        tipo: item.tipo,
      };

      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: clienteId,
          cliente_email: clienteInfo?.email || '',
          armazon_id: item.armazon_id,
          estado: 'pendiente',
          precio_venta: item.precio_total,
          notas_cliente: descripcion,
          notas_admin: '',
          paciente: item.paciente || null,
          configuracion,
        })
        .select()
        .single();

      if (pedidoError || !pedido) {
        console.error('Error creando pedido:', pedidoError);
        continue;
      }

      pedidoIds.push(pedido.id);

      // ── 3. Guardar receta ────────────────────────────────────────────
      if (!item.solo_armazon && item.receta) {
        const recetaData: any = {
          pedido_id: pedido.id,
          metodo: item.receta.metodo,
          imagen_url: item.receta.foto_url || null,
          notas: item.paciente || null,
        };

        if (item.receta.metodo === 'manual' && item.receta.datos) {
          const d = item.receta.datos;
          recetaData.sph_od = d.sph_od;
          recetaData.cyl_od = d.cyl_od;
          recetaData.axis_od = d.axis_od;
          recetaData.sph_os = d.sph_os;
          recetaData.cyl_os = d.cyl_os;
          recetaData.axis_os = d.axis_os;
          recetaData.add_val = d.add;
          recetaData.dp = d.dp;
          recetaData.prisma = d.prisma || null;
        }

        await supabase.from('recetas').insert(recetaData);
      }

      // ── 4. Crear registro de finanzas vacío (para llenar en admin) ───
      await supabase.from('finanzas').insert({
        pedido_id: pedido.id,
        precio_venta: item.precio_total,
        costo_armazon: 0,
        costo_laboratorio: 0,
        otros_costos: 0,
      });
    }

    // ── 5. Crear sesión Stripe ─────────────────────────────────────────
    const descripcionStripe = items.map((item: any) =>
      item.solo_armazon
        ? `${item.armazon_nombre} (solo armazón)`
        : `${item.armazon_nombre}${item.paciente ? ` — ${item.paciente}` : ''}`
    ).join(', ');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      shipping_address_collection: {
        allowed_countries: ['US', 'MX', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],

      customer_email: clienteInfo?.email || undefined,

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Verly Optical — Lentes personalizados',
              description: descripcionStripe,
            },
            unit_amount: Math.round(Number(total) * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        pedido_ids: pedidoIds.join(','),
        cliente_id: clienteId?.toString() || '',
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/Tienda`,
    });

    // ── 6. Guardar stripe_session_id en cada pedido ───────────────────
    if (pedidoIds.length > 0) {
      await supabase
        .from('pedidos')
        .update({ stripe_session_id: session.id })
        .in('id', pedidoIds);
    }

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}