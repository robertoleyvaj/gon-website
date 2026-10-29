import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { precioGon } from '../../lib/precio-gon';
import { obtenerPreciosLista, micaWeb, webFiltro, type ListaPrecios } from '../../lib/precios-lentes';
import { validarPago, fechaMas, DIAS_APARTADO, SUCURSALES_PAGO, type ModoPago } from '../../lib/pago-gon';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Precios en MXN. Micas y filtros = precio de lista de OptiOS − 15% (lib/precios-lentes)
const TC_FALLBACK = 18; // tipo de cambio fallback si no hay precio_gon en armazon

async function calcularPrecioItem(item: any, L: ListaPrecios): Promise<number> {
  let precioArmazonMXN = 0;
  if (item.armazon_id) {
    const { data } = await supabase.from('armazones').select('precio, precio_gon, descuento_gon').eq('id', item.armazon_id).eq('activo', true).single();
    if (data) {
      // Mismo precio web que ve el cliente (lista − descuento web), calculado aquí en el servidor
      precioArmazonMXN = (data.precio_gon && data.precio_gon > 0)
        ? precioGon(data)
        : Math.round(data.precio * TC_FALLBACK);
    }
  }
  if (item.es_regalo) precioArmazonMXN = 0;
  if (item.solo_armazon) return precioArmazonMXN;
  const filtros: string[] = item.lentes?.filtros || [];
  const precioFiltros = filtros.reduce((s: number, f: string) => s + webFiltro(L, f), 0);
  // Lentes de sol: sin graduación, solo filtros
  if (!item.lentes?.vision) return precioArmazonMXN + precioFiltros;
  const mica = micaWeb(L, item.lentes.vision, item.lentes.material || 'cr39');
  if (mica == null) throw new Error('Combinación de micas no disponible');
  return precioArmazonMXN + mica + precioFiltros;
}

const attempts = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const r = attempts.get(ip);
  if (!r || now > r.resetAt) { attempts.set(ip, { count: 1, resetAt: now + 60000 }); return false; }
  if (r.count >= 5) return true;
  r.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (isRateLimited(ip)) return NextResponse.json({ error: 'Demasiados intentos.' }, { status: 429 });

    const { items, modo, monto, sucursal } = await req.json() as { items: any[]; modo: ModoPago; monto: number; sucursal: string };
    if (!Array.isArray(items) || items.length === 0 || items.length > 10)
      return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });
    if (!SUCURSALES_PAGO.some(s => s.k === sucursal))
      return NextResponse.json({ error: 'Elige la sucursal donde recoges' }, { status: 400 });

    // Precios recalculados en el servidor (precio web de armazones y micas)
    const L = await obtenerPreciosLista();
    let totales: number[];
    try { totales = await Promise.all(items.map((it: any) => calcularPrecioItem(it, L))); }
    catch { return NextResponse.json({ error: 'Combinación de micas no disponible' }, { status: 400 }); }
    const total = Math.round(totales.reduce((s, t) => s + t, 0));
    if (total <= 0) return NextResponse.json({ error: 'Total inválido' }, { status: 400 });

    // El monto lo elige el cliente; aquí se revisa que esté en el rango de su opción
    const pagar = Math.round(Number(monto));
    const errPago = validarPago(modo, total, pagar);
    if (errPago) return NextResponse.json({ error: errPago }, { status: 400 });

    const pago = {
      modo, total, pagado: pagar, saldo: total - pagar, sucursal,
      apartado_vence: modo === 'apartar' ? fechaMas(DIAS_APARTADO) : null,
    };

    // Guardar items temporalmente — el pedido se crea hasta que Stripe confirma el pago
    const { data: cs, error: csError } = await supabase
      .from('checkout_sessions')
      .insert({
        items_data: items.map((item, i) => ({ ...item, precio_verificado: totales[i], pago_gon: pago })),
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (csError || !cs) {
      console.error('Error saving checkout session:', csError);
      return NextResponse.json({ error: 'Error al procesar.' }, { status: 500 });
    }

    const suc = SUCURSALES_PAGO.find(s => s.k === sucursal)!;
    const concepto = modo === 'apartar' ? 'Apartado' : modo === 'anticipo' ? 'Anticipo' : 'Pago total';
    const descripcion = `${items.map((it: any) => it.armazon_ref || it.armazon_nombre).join(', ')} · Recoges en ${suc.nombre}`.slice(0, 480);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'es',
      phone_number_collection: { enabled: true },
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: {
            name: `${concepto} · GON Ópticas (total $${total.toLocaleString('es-MX')})`,
            description: descripcion,
          },
          unit_amount: pagar * 100, // centavos
        },
        quantity: 1,
      }],
      metadata: {
        checkout_session_id: cs.id.toString(),
        tienda: 'gon',                // Verly ignora estos pagos (misma cuenta de Stripe)
        modo, total: String(total), pagado: String(pagar), sucursal,
      },
      payment_intent_data: { metadata: { tienda: 'gon', checkout_session_id: cs.id.toString() } },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gonmx.com'}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gonmx.com'}/Tienda`,
    });

    await supabase.from('checkout_sessions')
      .update({ stripe_session_id: session.id })
      .eq('id', cs.id);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Error procesando el pedido.' }, { status: 500 });
  }
}