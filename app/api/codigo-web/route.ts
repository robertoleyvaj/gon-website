// POST /api/codigo-web  { armazon_id, color_sku? } → { ok, codigo, precio_web, precio_optica, vence }
// Genera el código de "precio web" que el cliente manda por WhatsApp al apartar.
// El precio lo calcula el servidor (no se confía en el navegador). En OptiOS el código
// descuenta la diferencia entre el precio de la óptica y el precio web. Se usa una vez.
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

    const b = await req.json().catch(() => ({})) as { armazon_id?: number; color_sku?: string };
    const id = Number(b.armazon_id);
    if (!id) return NextResponse.json({ ok: false, error: 'Falta el armazón' }, { status: 400 });

    const { data: a } = await supabase.from('armazones')
      .select('id, sku, nombre, modelo, marca, precio_gon, descuento_gon')
      .eq('id', id).eq('activo', true).eq('publicar_gon', true).maybeSingle();
    if (!a) return NextResponse.json({ ok: false, error: 'Armazón no disponible' }, { status: 404 });

    const precioOptica = precioOpticaGon(a);
    const precioWeb = precioGon(a);
    const monto = precioOptica - precioWeb;
    if (!precioOptica || monto <= 0) return NextResponse.json({ ok: false, error: 'Sin precio web' }, { status: 400 });

    // El color solo se acepta si de verdad es de ese armazón
    let colorSku: string | null = null;
    if (b.color_sku) {
      const { data: c } = await supabase.from('armazon_colores').select('sku')
        .eq('armazon_id', id).eq('sku', String(b.color_sku).toUpperCase()).maybeSingle();
      colorSku = c?.sku ?? null;
    }

    const vence = new Date(Date.now() + DIAS_VIGENCIA * 86400_000).toLocaleDateString('en-CA', { timeZone: 'America/Tijuana' });
    const nombre = [a.marca, a.nombre || a.modelo].filter(Boolean).join(' ');
    for (let i = 0; i < 5; i++) {
      const codigo = nuevoCodigo();
      const { error } = await supabase.from('codigos_web').insert({
        codigo, armazon_id: id, armazon_sku: a.sku ?? null, color_sku: colorSku, nombre,
        precio_optica: precioOptica, precio_web: precioWeb, monto, vence,
      });
      if (!error) return NextResponse.json({ ok: true, codigo, precio_web: precioWeb, precio_optica: precioOptica, vence });
      if (!/duplicate|unique/i.test(error.message)) return NextResponse.json({ ok: false, error: 'No se pudo generar' }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: 'No se pudo generar' }, { status: 500 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error' }, { status: 500 });
  }
}
