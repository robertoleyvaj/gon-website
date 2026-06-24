import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limiting: 20 intentos por IP cada 10 minutos
const couponAttempts = new Map<string, { count: number; resetAt: number }>();
function isCouponRateLimited(ip: string): boolean {
  const now = Date.now();
  const r = couponAttempts.get(ip);
  if (!r || now > r.resetAt) { couponAttempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 }); return false; }
  if (r.count >= 20) return true;
  r.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (isCouponRateLimited(ip))
    return NextResponse.json({ valido: false, error: 'Demasiados intentos. Espera unos minutos.' }, { status: 429 });

  try {
    const { codigo, total } = await req.json();
    if (!codigo) return NextResponse.json({ valido: false, error: 'Ingresa un código' });

    const { data, error } = await supabase
      .from('codigos_descuento')
      .select('*')
      .eq('codigo', codigo.toUpperCase().trim())
      .eq('activo', true)
      .single();

    if (error || !data) return NextResponse.json({ valido: false, error: 'Código inválido o expirado' });

    if (data.expires_at && new Date(data.expires_at) < new Date())
      return NextResponse.json({ valido: false, error: 'Este código ha expirado' });

    if (data.usos_maximos !== null && data.usos_actuales >= data.usos_maximos)
      return NextResponse.json({ valido: false, error: 'Este código ya no tiene usos disponibles' });

    if (data.minimo_compra && total < data.minimo_compra)
      return NextResponse.json({ valido: false, error: `Compra mínima de $${data.minimo_compra.toLocaleString('es-MX')} MXN requerida` });

    return NextResponse.json({ valido: true, tipo: data.tipo, valor: data.valor, descripcion: data.descripcion });
  } catch {
    return NextResponse.json({ valido: false, error: 'Error al validar el código' }, { status: 500 });
  }
}
