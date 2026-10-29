// Correos de GON en español (compra en línea con recoger en sucursal).
// Usa la misma bitácora email_logs que los correos viejos para no mandar dos veces.
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const FROM = 'GON Ópticas <orders@send.gonmx.com>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://gonmx.com';
const WA = 'https://wa.me/526648343018';

export const codigoPedido = (id: number) => `GON-${2846 + id}`;
const mxn = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;
const fechaLarga = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

export const SUCURSALES_GON: Record<string, { nombre: string; dir: string; maps: string }> = {
  baja:   { nombre: 'Óptica Baja Visión', dir: 'Blvd. Benito Juárez 79B, Centro, Rosarito', maps: 'https://maps.google.com/?q=Optica+Baja+Vision+Blvd+Benito+Juarez+Rosarito' },
  mayo:   { nombre: 'Óptica Rosarito 5 de Mayo', dir: 'C. 5 de Mayo 200, Local 1, Rosarito', maps: 'https://maps.google.com/?q=Optica+Rosarito+5+de+Mayo+Rosarito+BC' },
  plaza:  { nombre: 'Óptica Rosarito Plaza Laureles', dir: 'C. José María Morelos 118, Plaza Laureles, Rosarito', maps: 'https://maps.google.com/?q=Plaza+Laureles+Jose+Maria+Morelos+118+Rosarito' },
};

export type PagoGon = {
  modo: 'apartar' | 'anticipo' | 'liquidar';
  total: number; pagado: number; saldo: number;
  sucursal: string;            // baja | mayo | plaza
  apartado_vence?: string | null;  // YYYY-MM-DD (solo apartar)
};

async function yaEnviado(order_id: number, tipo: string) {
  const { data } = await supabase.from('email_logs').select('id').eq('order_id', order_id).eq('email_type', tipo).eq('status', 'sent').limit(1);
  return (data?.length || 0) > 0;
}
async function log(order_id: number, tipo: string, id: string | null, ok: boolean, err?: string) {
  await supabase.from('email_logs').insert({ order_id, email_type: tipo, resend_email_id: id, status: ok ? 'sent' : 'error', error_message: err || null });
}

const css = `
  body{margin:0;padding:0;background:#F5F6F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  .w{max-width:560px;margin:0 auto;padding:32px 16px}.c{background:#fff;border-radius:10px;border:1px solid #E3E6EC;overflow:hidden}
  .h{background:#fff;padding:24px;text-align:center;border-bottom:4px solid #1B2F5E}.h img{height:34px}
  .b{padding:32px 30px}.t{font-size:22px;font-weight:600;color:#14213D;margin:0 0 10px;line-height:1.3}
  .p{font-size:14px;color:#5B6475;line-height:1.7;margin:0 0 16px}.hr{border:none;border-top:1px solid #E3E6EC;margin:22px 0}
  .l{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8A93A3;margin:0 0 3px}
  .v{font-size:14px;color:#14213D;font-weight:500;margin:0 0 14px}.code{font-family:'Courier New',monospace;font-size:17px;font-weight:700;letter-spacing:.06em}
  .box{background:#F2F5FB;border-radius:8px;padding:14px 16px;margin:0 0 16px}
  .btn{display:inline-block;background:#25D366;color:#fff!important;padding:12px 22px;border-radius:999px;text-decoration:none;font-size:13px;font-weight:600}
  .f{padding:18px;text-align:center;font-size:11px;color:#8A93A3}
`;
const marco = (contenido: string) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="w"><div class="c">
  <div class="h"><img src="${BASE_URL}/logo-gon.png" alt="GON Ópticas"/></div>
  <div class="b">${contenido}
  <p class="p" style="margin:22px 0 0">¿Dudas? Escríbenos por WhatsApp:</p>
  <p style="margin:10px 0 0"><a class="btn" href="${WA}">WhatsApp 664 834 3018</a></p></div>
  <div class="f">GON Ópticas · Playas de Rosarito, B.C.</div></div></div></body></html>`;

async function enviar(order_id: number, tipo: string, to: string, subject: string, html: string) {
  if (!to || await yaEnviado(order_id, tipo)) return;
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
    await log(order_id, tipo, data?.id || null, !error, error?.message);
  } catch (e: any) { await log(order_id, tipo, null, false, e?.message); }
}

const sucursalHtml = (k: string) => {
  const s = SUCURSALES_GON[k];
  return s ? `<p class="l">Recoges en</p><p class="v">${s.nombre}<br/><span style="font-weight:400;color:#5B6475">${s.dir}</span> · <a href="${s.maps}" style="color:#1B2F5E">Ver mapa</a></p>` : '';
};

// 1. Pago recibido (una sola vez por compra; se manda con el id del primer pedido)
export async function correoCompraGon(order_id: number, to: string, nombre: string, detalle: string[], pago: PagoGon, faltaExamen = false) {
  const titulo = pago.modo === 'apartar' ? '¡Apartamos tus lentes!' : '¡Recibimos tu pedido!';
  // Sin graduación: el siguiente paso es el examen (todavía no se pueden mandar a hacer)
  const explicaExamen = `${pago.modo === 'apartar' ? 'Tu apartado está confirmado' : 'Tu pedido está pagado'}. El siguiente paso es tu <b>examen de la vista gratis</b>: en cuanto tengamos tu graduación mandamos a hacer tus lentes. Si tu graduación necesita otro material, te avisamos la diferencia antes de hacerlos.${pago.modo === 'apartar' && pago.apartado_vence ? ` Recuerda que tu apartado vale hasta el <b>${fechaLarga(pago.apartado_vence)}</b>.` : ''}`;
  const explica = faltaExamen ? explicaExamen : pago.modo === 'apartar'
    ? `Tu apartado está confirmado. Tienes hasta el <b>${pago.apartado_vence ? fechaLarga(pago.apartado_vence) : '10 días'}</b> para pasar a la óptica a completar tu anticipo (35% o más) y mandamos a hacer tus lentes. El apartado no es reembolsable; si no se completa a tiempo, tu dinero queda como saldo a favor por 30 días.`
    : pago.modo === 'anticipo'
      ? 'Recibimos tu anticipo y ya mandamos a hacer tus lentes. Te avisamos en cuanto estén listos; el resto lo pagas al recogerlos.'
      : 'Tu pedido está pagado y ya mandamos a hacer tus lentes. Te avisamos en cuanto estén listos para recoger.';
  const html = marco(`
    <p class="t">${titulo}</p>
    <p class="p">Hola ${nombre.split(' ')[0] || ''}, ${explica}</p>
    <hr class="hr"/>
    <p class="l">Pedido</p><p class="v"><span class="code">${codigoPedido(order_id)}</span></p>
    <p class="l">Tus lentes</p><p class="v">${detalle.join('<br/>')}</p>
    <div class="box">
      <p class="l">Total web</p><p class="v">${mxn(pago.total)}</p>
      <p class="l">Pagaste</p><p class="v">${mxn(pago.pagado)}</p>
      <p class="l">Pendiente al recoger</p><p class="v" style="margin:0">${mxn(pago.saldo)}</p>
    </div>
    ${sucursalHtml(pago.sucursal)}
    ${faltaExamen ? `<p style="margin:16px 0 0"><a class="btn" href="${WA}?text=${encodeURIComponent(`¡Hola GON! 👋 Ya hice mi pedido ${codigoPedido(order_id)} en línea y quiero agendar mi examen de la vista.`)}">Agendar mi examen por WhatsApp</a></p>` : ''}`);
  await enviar(order_id, 'compra', to, `${titulo} · ${codigoPedido(order_id)}`, html);
}

// 2. En proceso (se mandó a hacer)
export async function correoProcesoGon(order_id: number, to: string, nombre: string) {
  const html = marco(`
    <p class="t">Tus lentes ya están en proceso 🔧</p>
    <p class="p">Hola ${nombre.split(' ')[0] || ''}, ya mandamos a hacer tus lentes. Te avisamos en cuanto estén listos para recoger.</p>
    <p class="l">Pedido</p><p class="v"><span class="code">${codigoPedido(order_id)}</span></p>`);
  await enviar(order_id, 'fabricacion', to, `Tus lentes están en proceso · ${codigoPedido(order_id)}`, html);
}

// 3. Listos para recoger
export async function correoListoGon(order_id: number, to: string, nombre: string, pago?: PagoGon | null) {
  const html = marco(`
    <p class="t">¡Tus lentes están listos! 🎉</p>
    <p class="p">Hola ${nombre.split(' ')[0] || ''}, ya puedes pasar por ellos. No olvides traer tu identificación.</p>
    <p class="l">Pedido</p><p class="v"><span class="code">${codigoPedido(order_id)}</span></p>
    ${pago && pago.saldo > 0 ? `<div class="box"><p class="l">Pendiente al recoger</p><p class="v" style="margin:0">${mxn(pago.saldo)}</p></div>` : ''}
    ${pago ? sucursalHtml(pago.sucursal) : ''}`);
  await enviar(order_id, 'listo', to, `¡Tus lentes están listos para recoger! · ${codigoPedido(order_id)}`, html);
}

// 4. Entregados
export async function correoEntregadoGon(order_id: number, to: string, nombre: string) {
  const html = marco(`
    <p class="t">¡Gracias por tu compra!</p>
    <p class="p">Hola ${nombre.split(' ')[0] || ''}, esperamos que disfrutes tus lentes nuevos. Si algo no te queda bien, escríbenos y te ayudamos.</p>
    <p class="l">Pedido</p><p class="v"><span class="code">${codigoPedido(order_id)}</span></p>`);
  await enviar(order_id, 'entregado', to, `¡Disfruta tus lentes! · ${codigoPedido(order_id)}`, html);
}
