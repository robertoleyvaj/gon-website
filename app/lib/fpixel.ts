// Helper seguro para el Meta Pixel de GON (2352394322228270, se carga en layout.tsx).
// content_ids = id del armazón y content_type 'product_group', igual que el feed /feed/productos,
// para que el catálogo de Meta reconozca qué armazón vio cada persona.
export type FbParams = Record<string, unknown>;

export function fbTrack(event: string, params?: FbParams) {
  if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq) {
    (window as unknown as { fbq: (...a: unknown[]) => void }).fbq('track', event, params || {});
  }
}
