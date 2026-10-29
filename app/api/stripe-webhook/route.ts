import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { correoCompraGon, correoAvisoGon, type PagoGon } from '../../lib/emails-gon';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Sin firma' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const csId = session.metadata?.checkout_session_id;
    if (!csId) return NextResponse.json({ received: true });
    // Misma cuenta de Stripe que Verly: aquí solo se procesan los pagos de gonmx
    if (session.metadata?.tienda !== 'gon') return NextResponse.json({ received: true });
    // OXXO y otros pagos diferidos llegan como 'unpaid': se procesan en async_payment_succeeded
    if (session.payment_status !== 'paid') return NextResponse.json({ received: true });
    await procesarPagoGon(session, csId);
  }

  if (event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    const csId = session.metadata?.checkout_session_id;
    if (csId && session.metadata?.tienda === 'gon') await procesarPagoGon(session, csId);
  }

  return NextResponse.json({ received: true });
}

// Crea los pedidos de GON (uno por par) cuando el pago se confirma
async function procesarPagoGon(session: Stripe.Checkout.Session, csId: string) {
  const { data: cs } = await supabase.from('checkout_sessions').select('*').eq('id', parseInt(csId)).single();
  if (!cs || cs.status === 'completed') return;
  // Se marca primero para que un reintento de Stripe no duplique pedidos
  const { data: marcado } = await supabase.from('checkout_sessions')
    .update({ status: 'completed' }).eq('id', cs.id).neq('status', 'completed').select('id').maybeSingle();
  if (!marcado) return;

  const items: any[] = cs.items_data || [];
  const email    = session.customer_details?.email || '';
  const nombre   = session.customer_details?.name  || '';
  const telefono = session.customer_details?.phone || '';
  const pago: PagoGon = items[0]?.pago_gon || {
    modo: (session.metadata?.modo as PagoGon['modo']) || 'liquidar',
    total: Number(session.metadata?.total) || Number(cs.total) || 0,
    pagado: Number(session.metadata?.pagado) || (session.amount_total ?? 0) / 100,
    saldo: 0, sucursal: session.metadata?.sucursal || 'baja', apartado_vence: null,
  };
  pago.saldo = Math.max(0, Math.round(pago.total - pago.pagado));

  // Cliente
  let clienteId: number | null = null;
  if (email) {
    const { data: existente } = await supabase.from('clientes').select('id').eq('email', email).maybeSingle();
    if (existente) {
      clienteId = existente.id;
      await supabase.from('clientes').update({ nombre: nombre || undefined, telefono: telefono || undefined }).eq('id', clienteId);
    } else {
      const { data: nuevo } = await supabase.from('clientes').insert({ nombre, email, telefono, direccion: '' }).select().single();
      if (nuevo) clienteId = nuevo.id;
    }
  }

  const NOM: Record<string, string> = {
    mono: 'Monofocal', bi: 'Bifocal', prog: 'Progresivo',
    cr39: 'Essential', hd: 'Slim HD', poly: 'Poly Plus', hi: 'Ultra Slim', shi: 'Ultra Slim Pro',
    ar: 'Antirreflejo', blue: 'Blue Light', foto: 'Fotocromático', pol: 'Polarizado', tinte: 'Tinte',
  };
  const detalle: string[] = [];
  let primerPedido: number | null = null;
  // Pares con micas pero sin graduación: hay que hacer el examen antes de mandarlos a hacer
  const sinGraduacion = (it: any) => !it.solo_armazon && !!it.lentes?.vision && (!it.receta || it.receta.metodo === 'despues');
  const faltaExamen = items.some(sinGraduacion);
  const soloArmazon = items.length > 0 && items.every((it: any) => it.solo_armazon || !it.lentes);

  for (const item of items) {
    const l = item.lentes;
    const desc = item.solo_armazon || !l
      ? `${item.armazon_ref || item.armazon_nombre} — Solo armazón`
      : [
          item.armazon_ref || item.armazon_nombre,
          l.vision && `${NOM[l.vision] || l.vision}${l.material ? ` ${NOM[l.material] || l.material}` : ''}`,
          l.filtros?.length > 0 && l.filtros.map((f: string) => NOM[f] || f).join(', '),
          item.paciente && `Para: ${item.paciente}`,
        ].filter(Boolean).join(' · ');
    detalle.push(desc);

    const configuracion = {
      ...(item.solo_armazon || !l ? { solo_armazon: true } : {
        vision: l.vision, vision_nombre: NOM[l.vision] || l.vision_nombre, vision_precio: l.vision_precio,
        material: l.material, material_nombre: NOM[l.material] || l.material_nombre, material_precio: l.material_precio,
        filtros: l.filtros, filtros_nombres: (l.filtros || []).map((f: string) => NOM[f] || f), filtros_precio: l.filtros_precio,
        filtros_colores: l.filtros_colores ?? null,
        solo_armazon: false,
      }),
      tipo: item.tipo,
      armazon_ref: item.armazon_ref || null,
      pago,                       // modo, total, pagado, saldo, sucursal, apartado_vence (de toda la compra)
      falta_examen: sinGraduacion(item),
      telefono: telefono || null,
    };

    const { data: pedido } = await supabase.from('pedidos').insert({
      cliente_id:        clienteId,
      cliente_email:     email,
      armazon_id:        item.armazon_id,
      estado:            pago.modo === 'apartar' ? 'apartado' : 'pendiente',
      precio_venta:      item.precio_verificado,
      notas_cliente:     desc,
      notas_admin:       '',
      paciente:          item.paciente || null,
      configuracion,
      stripe_session_id: session.id,
      plataforma:        'gon',
    }).select().single();
    if (!pedido) continue;
    if (!primerPedido) primerPedido = pedido.id;

    if (!item.solo_armazon && item.receta) {
      const recetaData: any = { pedido_id: pedido.id, metodo: item.receta.metodo, imagen_url: item.receta.foto_url || null, notas: item.paciente || null };
      if (item.receta.metodo === 'manual' && item.receta.datos) {
        const d = item.receta.datos;
        Object.assign(recetaData, {
          sph_od: d.sph_od, cyl_od: d.cyl_od, axis_od: d.axis_od,
          sph_os: d.sph_os, cyl_os: d.cyl_os, axis_os: d.axis_os,
          add_val: d.add, dp: d.dp, prisma: d.prisma || null,
        });
      }
      await supabase.from('recetas').insert(recetaData);
    }

    await supabase.from('finanzas').insert({
      pedido_id: pedido.id, precio_venta: item.precio_verificado, costo_armazon: 0, costo_laboratorio: 0, otros_costos: 0,
    });
  }

  // Correo en español (una vez por compra). Nunca debe tumbar el webhook.
  try { if (primerPedido && email) await correoCompraGon(primerPedido, email, nombre, detalle, pago, faltaExamen, soloArmazon); }
  catch (e) { console.error('Correo compra GON:', e); }
  try { if (primerPedido) await correoAvisoGon(primerPedido, { nombre, email, telefono }, detalle, pago, faltaExamen); }
  catch (e) { console.error('Aviso compra GON:', e); }
}
