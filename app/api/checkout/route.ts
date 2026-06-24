import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Precios en MXN (actualizados Jun 2026)
const TC_FALLBACK = 18; // tipo de cambio fallback si no hay precio_gon en armazon
const VISION_PRICES_MXN: Record<string, number> = { mono: 749, bi: 1149, prog: 1899 };
const MATERIAL_PRICES_MXN: Record<string, number> = { cr39: 0, hd: 397, poly: 997, hi: 3197, shi: 4697 };
const FILTRO_PRICES_MXN: Record<string, number> = { ar: 279, blue: 549, foto: 949, pol: 1699, tinte: 549 };

async function calcularPrecioItem(item: any): Promise<number> {
  let precioArmazonMXN = 0;
  if (item.armazon_id) {
    const { data } = await supabase.from('armazones').select('precio, precio_gon').eq('id', item.armazon_id).eq('activo', true).single();
    if (data) {
      precioArmazonMXN = (data.precio_gon && data.precio_gon > 0)
        ? data.precio_gon
        : Math.round(data.precio * TC_FALLBACK);
    }
  }
  if (item.es_regalo) precioArmazonMXN = 0;
  if (item.solo_armazon) return precioArmazonMXN;
  const precioVision   = VISION_PRICES_MXN[item.lentes?.vision]    ?? 0;
  const precioMaterial = MATERIAL_PRICES_MXN[item.lentes?.material] ?? 0;
  const precioFiltros  = (item.lentes?.filtros || []).reduce((s: number, f: string) => s + (FILTRO_PRICES_MXN[f] ?? 0), 0);
  return precioArmazonMXN + precioVision + precioMaterial + precioFiltros;
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

    const { items, cupon } = await req.json();
    if (!Array.isArray(items) || items.length === 0 || items.length > 10)
      return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });

    const totales = await Promise.all(items.map(calcularPrecioItem));
    let total = totales.reduce((s, t) => s + t, 0);
    if (total <= 0) return NextResponse.json({ error: 'Total inválido' }, { status: 400 });

    // Aplicar cupón si existe
    let descuentoCupon = 0;
    if (cupon?.codigo) {
      const { data: cod } = await supabase.from('codigos_descuento')
        .select('*').eq('codigo', cupon.codigo).eq('activo', true).single();
      if (cod) {
        descuentoCupon = cod.tipo === 'fijo' ? cod.valor : Math.round(total * cod.valor / 100);
        total = Math.max(0, total - descuentoCupon);
        await supabase.from('codigos_descuento')
          .update({ usos_actuales: (cod.usos_actuales || 0) + 1 })
          .eq('id', cod.id);
      }
    }

    // Guardar items temporalmente — NO se crea pedido todavía
    const { data: cs, error: csError } = await supabase
      .from('checkout_sessions')
      .insert({
        items_data: items.map((item, i) => ({ ...item, precio_verificado: totales[i] })),
        total, descuento_cupon: descuentoCupon, cupon_codigo: cupon?.codigo || null,
        status: 'pending',
      })
      .select()
      .single();

    if (csError || !cs) {
      console.error('Error saving checkout session:', csError);
      return NextResponse.json({ error: 'Error al procesar.' }, { status: 500 });
    }

    const descripcion = items.map((item: any) =>
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
          fixed_amount: { amount: 0, currency: 'mxn' },
          display_name: 'Envío estándar',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      }],
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: { name: 'GON — Grupo Óptico del Noroeste', description: descripcion },
          unit_amount: Math.round(total * 100), // MXN centavos
        },
        quantity: 1,
      }],
      metadata: { checkout_session_id: cs.id.toString() },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_BASE_URL}/Tienda`,
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