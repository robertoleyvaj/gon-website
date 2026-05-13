// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const shipping = (session as any).shipping_details;
    const customerEmail = session.customer_details?.email || '';
    const customerName = session.customer_details?.name || '';
    const customerPhone = session.customer_details?.phone || '';
    const descripcion = (session as any).display_items?.[0]?.custom?.description
      || (session as any).line_items?.data?.[0]?.description
      || '';

    const direccion = shipping?.address
      ? `${shipping.address.line1}${shipping.address.line2 ? ', ' + shipping.address.line2 : ''}, ${shipping.address.city}, ${shipping.address.state} ${shipping.address.postal_code}, ${shipping.address.country}`
      : '';

    const total = (session.amount_total || 0) / 100;

    // 1 — Buscar o crear cliente
    let clienteId: number | null = null;

    const { data: clienteExistente } = await supabase
      .from('clientes')
      .select('id')
      .eq('email', customerEmail)
      .single();

    if (clienteExistente) {
      clienteId = clienteExistente.id;
      // Actualizar dirección si no tenía
      await supabase
        .from('clientes')
        .update({ direccion, telefono: customerPhone || undefined })
        .eq('id', clienteId);
    } else {
      const { data: nuevoCliente } = await supabase
        .from('clientes')
        .insert({
          nombre: customerName || 'Cliente Stripe',
          email: customerEmail,
          telefono: customerPhone,
          direccion,
          notas: `Creado automáticamente desde Stripe. Session: ${session.id}`,
        })
        .select()
        .single();
      clienteId = nuevoCliente?.id || null;
    }

    // 2 — Crear pedido
    const { data: pedido } = await supabase
      .from('pedidos')
      .insert({
        cliente_id: clienteId,
        estado: 'pendiente',
        precio_venta: total,
        notas_cliente: descripcion,
        notas_admin: `Stripe session: ${session.id} | Envío: ${direccion}`,
      })
      .select()
      .single();

    // 3 — Crear registro de finanzas
    if (pedido) {
      await supabase.from('finanzas').insert({
        pedido_id: pedido.id,
        precio_venta: total,
        costo_armazon: 0,
        costo_laboratorio: 0,
        otros_costos: 0,
      });
    }

    // Enviar email de confirmación de compra
    if (pedido && customerEmail) {
      const { enviarEmailCompra } = await import('../../lib/emails');
      const descripcion = (session as any).line_items?.data?.[0]?.description || 'Lentes personalizados';
      await enviarEmailCompra(pedido.id, customerEmail, customerName || 'Cliente', descripcion, total);
    }
  }

  return NextResponse.json({ received: true });
}