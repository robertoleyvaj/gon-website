// Precios de armazones en gonmx.com (pesos)
//   precio_gon      = precio de lista en la óptica (el mismo de OptiOS, la etiqueta y la caja)
//   precio web      = precio de lista − DESCUENTO_WEB_GON % (automático para todos)
//   descuento_gon   = solo si un armazón lleva una promo MAYOR al descuento web; si es menor se ignora
export const DESCUENTO_WEB_GON = 60

type ConPrecio = { precio_gon?: number | null; descuento_gon?: number | null }

// % de descuento que aplica en la web a ese armazón
export function descuentoWebGon(a: ConPrecio): number {
  return Math.min(95, Math.max(DESCUENTO_WEB_GON, Number(a.descuento_gon) || 0))
}

// Precio en la óptica (lista)
export const precioOpticaGon = (a: ConPrecio): number => Number(a.precio_gon) || 0

// Precio web (el que se cobra en línea y se respeta en la óptica si se aparta)
export function precioGon(a: ConPrecio): number {
  const base = precioOpticaGon(a)
  if (!base) return 0
  return Math.round(base * (1 - descuentoWebGon(a) / 100))
}
export const mxn = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`

// Datos de contacto de GON (ópticas físicas)
export const WHATSAPP_GON = '526648343018'
export const waGon = (texto = '') => `https://wa.me/${WHATSAPP_GON}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`
