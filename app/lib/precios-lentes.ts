// Precios WEB de micas y filtros en gonmx.com
// Salen del precio de lista de OptiOS (gon.optios.mx/api/public/precios-web) − DESC_WEB_MICAS %.
// Es la misma regla que aplica el código WEB-XXXXX en la óptica (lib/precio-web.ts de OptiOS),
// así lo que ve el cliente aquí es lo que le cobran allá.

export const DESC_WEB_MICAS = 15;
export const URL_PRECIOS_OPTIOS = 'https://gon.optios.mx/api/public/precios-web';

export type ListaPrecios = Record<string, number>;

// Respaldo si OptiOS no responde (precios de lista de OptiOS, oct 2026)
export const PRECIOS_LISTA_DEFAULT: ListaPrecios = {
  'MON-ESS': 824,  'MON-SHD': 1261, 'MON-PPL': 1981, 'MON-USL': 4341, 'MON-USP': 5991,
  'BIF-ESS': 1264, 'BIF-SHD': 1701, 'BIF-PPL': 2361, 'BIF-USL': 4781,
  'PRO-ESS': 2089, 'PRO-SHD': 2526, 'PRO-PPL': 3186, 'PRO-USL': 5606, 'PRO-USP': 7256,
  'FIL-AR': 379, 'FIL-BL': 579, 'FIL-TIN': 604, 'FIL-FC': 1044, 'FIL-POL': 1869,
};

// ids del configurador → SKU de OptiOS
const VISION: Record<string, string> = { mono: 'MON', bi: 'BIF', prog: 'PRO' };
const MATERIAL: Record<string, string> = { cr39: 'ESS', hd: 'SHD', poly: 'PPL', hi: 'USL', shi: 'USP' };
const FILTRO: Record<string, string> = { ar: 'FIL-AR', blue: 'FIL-BL', foto: 'FIL-FC', pol: 'FIL-POL', tinte: 'FIL-TIN' };

const web = (p: number) => Math.round(p * (1 - DESC_WEB_MICAS / 100));

// Precio web de la mica completa (visión + material). null = esa combinación no existe
export function micaWeb(L: ListaPrecios, vision: string, material: string): number | null {
  const p = L[`${VISION[vision]}-${MATERIAL[material]}`];
  return p ? web(p) : null;
}
export const materialDisponible = (L: ListaPrecios, vision: string, material: string) => micaWeb(L, vision, material) != null;
// Lo que se muestra en el paso "Visión" (mica Essential de esa visión)
export const webVision = (L: ListaPrecios, vision: string) => micaWeb(L, vision, 'cr39') ?? 0;
// Lo que se muestra en el paso "Material": diferencia contra Essential de la visión elegida
export function webMaterial(L: ListaPrecios, vision: string, material: string): number {
  const total = micaWeb(L, vision, material);
  return total == null ? 0 : total - webVision(L, vision);
}
export function webFiltro(L: ListaPrecios, filtro: string): number {
  const p = L[FILTRO[filtro]];
  return p ? web(p) : 0;
}

// Servidor: precios de lista vigentes de OptiOS (con respaldo)
export async function obtenerPreciosLista(): Promise<ListaPrecios> {
  try {
    const r = await fetch(URL_PRECIOS_OPTIOS, { next: { revalidate: 300 } });
    const j = await r.json();
    if (j?.ok && j.precios && typeof j.precios === 'object') return { ...PRECIOS_LISTA_DEFAULT, ...j.precios };
  } catch { /* usa el respaldo */ }
  return PRECIOS_LISTA_DEFAULT;
}
