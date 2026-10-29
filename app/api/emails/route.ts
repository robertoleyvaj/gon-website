// app/api/emails/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  enviarEmailEnviado,
} from '../../lib/emails';
import { createClient } from '@supabase/supabase-js';
import { correoProcesoGon, correoListoGon, correoEntregadoGon } from '../../lib/emails-gon';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function autorizado(req: NextRequest): boolean {
  // 1) Cookie del admin (panel web, si aún existe)
  const token = req.cookies.get('gon_admin')?.value;
  const cookieOk = !!process.env.ADMIN_TOKEN_SECRET && token === process.env.ADMIN_TOKEN_SECRET;
  // 2) Secreto de servicio (OptiOS lo manda en un header)
  const secret = req.headers.get('x-internal-secret');
  const secretOk = !!process.env.INTERNAL_EMAIL_SECRET && secret === process.env.INTERNAL_EMAIL_SECRET;
  return cookieOk || secretOk;
}

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { tipo, order_id, tracking, paqueteria } = await req.json();

  // Obtener datos del pedido y cliente
  const { data: pedido } = await supabase
    .from('pedidos')
    .select('*, clientes(*)')
    .eq('id', order_id)
    .single();

  if (!pedido) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

  const cliente_email = pedido.clientes?.email || pedido.cliente_email;
  const cliente_nombre = pedido.clientes?.nombre || 'Cliente';

  if (!cliente_email) return NextResponse.json({ error: 'Cliente sin email' }, { status: 400 });

  try {
    switch (tipo) {
      case 'fabricacion':
        await supabase.from('pedidos').update({ estado: 'en proceso' }).eq('id', order_id);
        await correoProcesoGon(order_id, cliente_email, cliente_nombre);
        break;

      case 'enviado':
        if (!tracking) return NextResponse.json({ error: 'Tracking requerido' }, { status: 400 });
        await supabase.from('pedidos').update({ estado: 'enviado', tracking, paqueteria }).eq('id', order_id);
        await enviarEmailEnviado(order_id, cliente_email, cliente_nombre, tracking, paqueteria || 'paquetería');
        break;

      case 'entregado':
        await supabase.from('pedidos').update({ estado: 'entregado', delivered_at: new Date().toISOString() }).eq('id', order_id);
        await correoEntregadoGon(order_id, cliente_email, cliente_nombre);
        break;

      case 'listo':
        // GON: listos para recoger en la sucursal que eligió
        await supabase.from('pedidos').update({ estado: 'listo' }).eq('id', order_id);
        await correoListoGon(order_id, cliente_email, cliente_nombre, pedido.configuracion?.pago ?? null, !!pedido.configuracion?.solo_armazon);
        break;

      default:
        return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}