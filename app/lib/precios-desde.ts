// Precios "desde" para textos de la página (títulos, descripciones, preguntas frecuentes).
// Salen de los mismos datos que cobra la página: armazones publicados en GON (precio web)
// y micas de OptiOS con su descuento web. Así los textos nunca se quedan viejos.
import { supabase } from './supabase';
import { precioGon } from './precio-gon';
import { obtenerPreciosLista, micaWeb } from './precios-lentes';

export type PreciosDesde = { armazon: number; sol: number; mono: number; bi: number; prog: number };

export async function preciosDesde(): Promise<PreciosDesde> {
  const L = await obtenerPreciosLista();
  let armazon = 0, sol = 0;
  try {
    const { data } = await supabase.from('armazones').select('precio_gon, descuento_gon, tipo')
      .eq('activo', true).eq('publicar_gon', true);
    for (const a of (data ?? []) as { precio_gon: number | null; descuento_gon: number | null; tipo: string | null }[]) {
      const p = precioGon(a as any);
      if (!p) continue;
      if (a.tipo === 'solar') sol = sol ? Math.min(sol, p) : p;
      else armazon = armazon ? Math.min(armazon, p) : p;
    }
  } catch { /* sin datos: los textos no muestran cifra */ }
  return {
    armazon, sol,
    mono: micaWeb(L, 'mono', 'cr39') ?? 0,
    bi: micaWeb(L, 'bi', 'cr39') ?? 0,
    prog: micaWeb(L, 'prog', 'cr39') ?? 0,
  };
}

export const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-MX')} MXN`;
