// POST /api/codigo-web  { armazon_id?, color_sku? } → { ok, codigo, vence }
// Genera el código WEB-XXXXX que el cliente manda por WhatsApp (desde cualquier botón de WhatsApp).
// En OptiOS el código aplica el precio web a toda la compra (armazones de GON −60%, micas/filtros −15%).
// El armazón es solo referencia. Se usa una vez y vence en 30 días.
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { precioGon, precioOpticaGon } from '../../lib/precio-gon';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const DIAS_VIGENCIA = 30;
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I
const nuevoCodigo = () => 'WEB-' + Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

// Límite sencillo por IP para que nadie llene la tabla
const intentos = new Map<string, { n: number; hasta: number }>();
function limitado(ip: string) {
  const ahora = Date.now();
  const r = intentos.get(ip);
  if (!r || ahora > r.hasta) { intentos.set(ip, { n: 1, hasta: ahora + 10 * 60_000 }); return false; }
  r.n++;
  return r.n > 15;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'x';
    if (limitado(ip)) return NextResponse.json({ ok: false, error: 'Demasiados intentos' }, { status: 429 });

    const b = await req.json().catch(() => ({})) as { armazon_id?: number | null; color_sku?: string | null };
    const id = Number(b.armazon_id) || null;

    // Armazón (opcional): solo como referencia de qué vio el cliente
    let ref: { sku: string | null; nombre: string; optica: number | null; web: number | null; monto: number | null } =
      { sku: null, nombre: '', optica: null, web: null, monto: null };
    let colorSku: string | null = null;
    if (id) {
      const { data: a } = await supabase.from('armazones')
        .select('id, sku, nombre, modelo, marca, precio_gon, descuento_gon')
        .eq('id', id).eq('activo', true).eq('publicar_gon', true).maybeSingle();
      if (a) {
        const optica = precioOpticaGon(a), web = precioGon(a);
        ref = { sku: a.sku ?? null, nombre: [a.marca, a.nombre || a.modelo].filter(Boolean).join(' '), optica: optica || null, web: web || null, monto: optica ? optica - web : null };
        if (b.color_sku) {
          const { data: c } = await supabase.from('armazon_colores').select('sku')
            .eq('armazon_id', id).eq('sku', String(b.color_sku).toUpperCase()).maybeSingle();
          colorSku = c?.sku ?? null;
        }
      }
    }

    const vence = new Date(Date.now() + DIAS_VIGENCIA * 86400_000).toLocaleDateString('en-CA', { timeZone: 'America/Tijuana' });
    for (let i = 0; i < 5; i++) {
      const codigo = nuevoCodigo();
      const { error } = await supabase.from('codigos_web').insert({
        codigo, armazon_id: ref.sku ? id : null, armazon_sku: ref.sku, color_sku: colorSku, nombre: ref.nombre || null,
        precio_optica: ref.optica, precio_web: ref.web, monto: ref.monto, vence,
      });
      if (!error) return NextResponse.json({ ok: true, codigo, vence });
      if (!/duplicate|unique/i.test(error.message)) return NextResponse.json({ ok: false, error: 'No se pudo generar' }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: 'No se pudo generar' }, { status: 500 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error' }, { status: 500 });
  }
}
