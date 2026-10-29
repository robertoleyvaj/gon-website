// Reglas de pago en línea de GON (las usa el carrito y las vuelve a revisar el servidor)
//   Apartar:  $100 a $300, no reembolsable, 10 días para completar el anticipo en la óptica
//   Anticipo: 35% a 60% del total, se manda a procesar; el resto se paga al recoger
//   Liquidar: 100%
export type ModoPago = 'apartar' | 'anticipo' | 'liquidar';

export const APARTAR_MIN = 100;
export const APARTAR_MAX = 300;
export const ANTICIPO_MIN = 0.35;
export const ANTICIPO_MAX = 0.60;
export const DIAS_APARTADO = 10;
export const DIAS_SALDO_FAVOR = 30;

export const SUCURSALES_PAGO = [
  { k: 'baja',  nombre: 'Óptica Baja Visión',            dir: 'Blvd. Benito Juárez 79B, Centro', lat: 32.3514861, lng: -117.059602 },
  { k: 'mayo',  nombre: 'Óptica Rosarito 5 de Mayo',     dir: 'C. 5 de Mayo 200, Local 1',       lat: 32.3506259, lng: -117.057464 },
  { k: 'plaza', nombre: 'Óptica Rosarito Plaza Laureles', dir: 'C. José María Morelos 118',       lat: 32.3426328, lng: -117.0513124 },
] as const;

// Distancia en línea recta (km) entre dos puntos
export function distanciaKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, rad = (x: number) => x * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export const textoDistancia = (km: number) => km < 1 ? `a ${Math.max(100, Math.round(km * 10) * 100)} m` : `a ${km < 10 ? km.toFixed(1) : Math.round(km).toLocaleString('es-MX')} km`;

export function rangoPago(modo: ModoPago, total: number): { min: number; max: number } {
  const t = Math.round(total);
  if (modo === 'apartar') return { min: Math.min(APARTAR_MIN, t), max: Math.min(APARTAR_MAX, t) };
  if (modo === 'anticipo') return { min: Math.ceil(t * ANTICIPO_MIN), max: Math.floor(t * ANTICIPO_MAX) };
  return { min: t, max: t };
}

export function validarPago(modo: ModoPago, total: number, monto: number): string | null {
  if (!['apartar', 'anticipo', 'liquidar'].includes(modo)) return 'Elige cómo quieres pagar';
  const m = Math.round(Number(monto));
  if (!m || m <= 0) return 'Escribe cuánto quieres pagar';
  const { min, max } = rangoPago(modo, total);
  if (m < min || m > max) {
    return modo === 'apartar'
      ? `Para apartar puedes dejar de $${min.toLocaleString('es-MX')} a $${max.toLocaleString('es-MX')}`
      : modo === 'anticipo'
        ? `El anticipo va de $${min.toLocaleString('es-MX')} (35%) a $${max.toLocaleString('es-MX')} (60%)`
        : 'El monto no coincide con el total';
  }
  return null;
}

export const fechaMas = (dias: number) =>
  new Date(Date.now() + dias * 86400_000).toLocaleDateString('en-CA', { timeZone: 'America/Tijuana' });
