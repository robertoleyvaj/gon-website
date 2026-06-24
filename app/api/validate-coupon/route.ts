import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
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
