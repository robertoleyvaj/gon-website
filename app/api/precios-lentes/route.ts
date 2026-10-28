// GET /api/precios-lentes → precios de lista de micas y filtros (de OptiOS) para el configurador
import { NextResponse } from 'next/server';
import { obtenerPreciosLista } from '../../lib/precios-lentes';

export const revalidate = 300;

export async function GET() {
  const precios = await obtenerPreciosLista();
  return NextResponse.json({ ok: true, precios });
}
