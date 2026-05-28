// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Precios canónicos — fuente de verdad en el servidor ───────────────────
const PRECIO_ARMAZON_BASE = 13;
const VISION_PRICES: Record<string, number> = { mono: 15, bi: 49, prog: 89 };
const MATERIAL_PRICES: Record<string, number> = { cr39: 0, poly: 29, hd: 39, hi: 59, shi: 89 };
const FILTRO_PRICES: Record<string, number> = { ar: 11, blue: 18, foto: 49, anti: 15, arprem: 24, pol: 70, tinte: 28 };

async function calcularPrecioItem(item: any): Promise<number> {
  // Verificar precio real del armazón en Supabase
  let precioArmazon = PRECIO_ARMAZON_BASE;
  if (item.armazon_id) {
    const { data } = await supabase
      .from('armazones')
      .select('precio')
      .eq('id', item.armazon_id)
      .eq('activo', true)
      .single();
    if (data) precioArmazon = data.precio;
  }

  // Promo regalo → armazón gratis
  if (item.es_regalo) precioArmazon = 0;

  // Solo armazón sin micas
  if (item.solo_armazon) return precioArmazon;

  const precioVision   = VISION_PRICES[item.lentes?.vision]     ?? 0;
  const precioMaterial = MATERIAL_PRICES[item.lentes?.material]  ?? 0;
  const precioFiltros  = (item.lentes?.filtros as string[] || [])
    .reduce((sum, fid) => sum + (FILTRO_PRICES[fid] ?? 0), 0);

  return precioArmazon + precioVision + precioMaterial + precioFiltros;
}

// ── Rate limiting simple por IP (5 intentos / minuto) ────────────────────
const checkoutAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 5;
  const record = checkoutAttempts.get(ip);
  if (!record || now > record.resetAt) {
    checkoutAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (record.count >= maxAttempts) return true;
  record.count++;
  return false;
}

// ── Handler principal ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera un momento.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { items, clienteInfo } = body;

    // Validación básica
    if (!Array.isArray(items) || items.length === 0 || items.length > 10) {
      return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });
    }

    // ── Recalcular total en el servidor — nunca confiar en el cliente ─────
    const totalesCalculados = await Promise.all(items.map(calcularPrecioItem));
    const totalCalculado = totalesCalculados.reduce((sum, t) => sum + t, 0);

    if (totalCalculado <= 0) {
      return NextResponse.json({ error: 'Total inválido' }, { status: 400 });
    }

    // ── 1. Upsert cliente ─────────────────────────────────────────────────
    let clienteId: number | null = null;

    if (clienteInfo?.email) {
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', clienteInfo.email)
        .maybeSingle();

      if (clienteExistente) {
        clienteId = clienteExistente.id;
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

    // ── 2. Crear pedidos ──────────────────────────────────────────────────
    const pedidoIds: number[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const precioVerificado = totalesCalculados[i]; // precio del servidor

      const descripcion = item.solo_armazon
        ? `${item.armazon_nombre} — Solo armazón`
        : [
            item.armazon_nombre,
            item.lentes?.vision_nombre   && `Visión: ${item.lentes.vision_nombre}`,
            item.lentes?.material_nombre && `Material: ${item.lentes.material_nombre}`,
            item.lentes?.filtros_nombres?.length > 0 && `Filtros: ${item.lentes.filtros_nombres.join(', ')}`,
            item.paciente && `Para: ${item.paciente}`,
          ].filter(Boolean).join(' · ');

      const configuracion = item.solo_armazon ? null : {
        vision:          item.lentes?.vision,
        vision_nombre:   item.lentes?.vision_nombre,
        vision_precio:   VISION_PRICES[item.lentes?.vision]     ?? 0,
        material:        item.lentes?.material,
        material_nombre: item.lentes?.material_nombre,
        material_precio: MATERIAL_PRICES[item.lentes?.material]  ?? 0,
        filtros:         item.lentes?.filtros,
        filtros_nombres: item.lentes?.filtros_nombres,
        filtros_precio:  (item.lentes?.filtros as string[] || [])
          .reduce((s: number, f: string) => s + (FILTRO_PRICES[f] ?? 0), 0),
        solo_armazon: false,
        tipo: item.tipo,
      };

      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id:    clienteId,
          cliente_email: clienteInfo?.email || '',
          armazon_id:    item.armazon_id,
          estado:        'pendiente',
          precio_venta:  precioVerificado, // ← precio del servidor, no del cliente
          notas_cliente: descripcion,
          notas_admin:   '',
          paciente:      item.paciente || null,
          configuracion,
        })
        .select()
        .single();

      if (pedidoError || !pedido) {
        console.error('Error creando pedido:', pedidoError);
        continue;
      }

      pedidoIds.push(pedido.id);

      // Guardar receta
      if (!item.solo_armazon && item.receta) {
        const recetaData: any = {
          pedido_id: pedido.id,
          metodo:    item.receta.metodo,
          imagen_url: item.receta.foto_url || null,
          notas:     item.paciente || null,
        };
        if (item.receta.metodo === 'manual' && item.receta.datos) {
          const d = item.receta.datos;
          Object.assign(recetaData, {
            sph_od: d.sph_od, cyl_od: d.cyl_od, axis_od: d.axis_od,
            sph_os: d.sph_os, cyl_os: d.cyl_os, axis_os: d.axis_os,
            add_val: d.add,   dp: d.dp,          prisma: d.prisma || null,
          });
        }
        await supabase.from('recetas').insert(recetaData);
      }

      // Registro de finanzas
      await supabase.from('finanzas').insert({
        pedido_id:          pedido.id,
        precio_venta:       precioVerificado,
        costo_armazon:      0,
        costo_laboratorio:  0,
        otros_costos:       0,
      });
    }

    // ── 3. Sesión Stripe con el total calculado en el servidor ────────────
    const descripcionStripe = items.map((item: any) =>
      item.solo_armazon
        ? `${item.armazon_nombre} (solo armazón)`
        : `${item.armazon_nombre}${item.paciente ? ` — ${item.paciente}` : ''}`
    ).join(', ');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['US', 'MX', 'CA'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      }],
      customer_email: clienteInfo?.email || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Verly Optical — Lentes personalizados',
            description: descripcionStripe,
          },
          unit_amount: Math.round(totalCalculado * 100), // ← total del servidor
        },
        quantity: 1,
      }],
      metadata: {
        pedido_ids: pedidoIds.join(','),
        cliente_id: clienteId?.toString() || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_BASE_URL}/Tienda`,
    });

    // Guardar stripe_session_id en los pedidos
    if (pedidoIds.length > 0) {
      await supabase
        .from('pedidos')
        .update({ stripe_session_id: session.id })
        .in('id', pedidoIds);
    }

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Checkout error:', error);
    // No exponer detalles internos al cliente
    return NextResponse.json(
      { error: 'Error procesando el pedido. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}