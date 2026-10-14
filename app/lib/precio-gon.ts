// Precio de un armazón en GON (pesos): precio_gon con su descuento_gon aplicado.
export function precioGon(a: { precio_gon?: number | null; descuento_gon?: number | null }): number {
  const base = Number(a.precio_gon) || 0
  const d = Number(a.descuento_gon) || 0
  return d > 0 ? Math.round(base * (1 - d / 100)) : base
}
export const mxn = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`

// Datos de contacto de GON (ópticas físicas)
export const WHATSAPP_GON = '526648343018'
export const waGon = (texto = '') => `https://wa.me/${WHATSAPP_GON}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`
