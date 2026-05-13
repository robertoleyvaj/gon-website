// app/lib/emails.ts
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FROM = 'Verly Optical <orders@send.verlyoptical.com>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://verlyoptical.com';

// ── HELPERS ───────────────────────────────────────────────────────────────
async function logEmail(order_id: number, email_type: string, resend_email_id: string | null, status: string, error?: string) {
  await supabase.from('email_logs').insert({
    order_id,
    email_type,
    resend_email_id,
    status,
    error_message: error || null,
  });
}

async function yaEnviado(order_id: number, email_type: string): Promise<boolean> {
  const { data } = await supabase
    .from('email_logs')
    .select('id')
    .eq('order_id', order_id)
    .eq('email_type', email_type)
    .eq('status', 'sent')
    .limit(1);
  return (data?.length || 0) > 0;
}

// ── ESTILOS BASE ──────────────────────────────────────────────────────────
const estilos = `
  body { margin: 0; padding: 0; background: #F7F4EF; font-family: -apple-system, sans-serif; }
  .wrapper { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
  .card { background: white; border-radius: 8px; border: 1px solid #E2DDD6; overflow: hidden; }
  .header { background: #1C1C1A; padding: 32px 40px; text-align: center; }
  .header img { height: 32px; }
  .body { padding: 40px; }
  .title { font-family: Georgia, serif; font-size: 24px; font-weight: 300; color: #1C1C1A; margin: 0 0 12px; line-height: 1.3; }
  .text { font-size: 14px; color: #8C8680; line-height: 1.8; margin: 0 0 20px; }
  .divider { border: none; border-top: 1px solid #E2DDD6; margin: 28px 0; }
  .label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8C8680; margin: 0 0 4px; }
  .value { font-size: 14px; color: #1C1C1A; font-weight: 500; margin: 0 0 16px; }
  .btn { display: inline-block; background: #1C1C1A; color: white; padding: 12px 28px; border-radius: 3px; text-decoration: none; font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
  .btn-sage { background: #4A5940; }
  .footer { padding: 24px 40px; text-align: center; }
  .footer-text { font-size: 11px; color: #8C8680; line-height: 1.7; margin: 0; }
`;

const logo = `${BASE_URL}/logo-trasparente.png`;

function footer() {
  return `
    <div class="footer">
      <p class="footer-text">
        Verly Optical — Tijuana, México<br/>
        <a href="mailto:support@verlyoptical.com" style="color: #8C8680;">support@verlyoptical.com</a>
      </p>
    </div>
  `;
}

// ── 1. GRACIAS POR TU COMPRA ──────────────────────────────────────────────
export async function enviarEmailCompra(order_id: number, cliente_email: string, cliente_nombre: string, detalle: string, total: number) {
  if (await yaEnviado(order_id, 'compra')) return;

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly"/></div>
        <div class="body">
          <p class="title">¡Gracias por tu compra,<br/>${cliente_nombre}!</p>
          <p class="text">Hemos recibido tu pedido y nuestro equipo lo revisará pronto. Te avisaremos cuando comencemos a fabricar tus lentes.</p>
          <hr class="divider"/>
          <p class="label">Número de pedido</p>
          <p class="value">#${order_id}</p>
          <p class="label">Detalle</p>
          <p class="value">${detalle}</p>
          <p class="label">Total</p>
          <p class="value">$${total} USD</p>
          <hr class="divider"/>
          <p class="text" style="margin:0;">¿Tienes alguna duda? Escríbenos a <a href="mailto:support@verlyoptical.com" style="color:#4A5940;">support@verlyoptical.com</a></p>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `¡Gracias por tu compra! — Pedido #${order_id}`,
      html,
    });
    await logEmail(order_id, 'compra', data?.id || null, error ? 'error' : 'sent', error?.message);
  } catch (e: any) {
    await logEmail(order_id, 'compra', null, 'error', e.message);
  }
}

// ── 2. EN FABRICACIÓN ─────────────────────────────────────────────────────
export async function enviarEmailFabricacion(order_id: number, cliente_email: string, cliente_nombre: string) {
  if (await yaEnviado(order_id, 'fabricacion')) return;

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly"/></div>
        <div class="body">
          <p class="title">Tus lentes están<br/>en fabricación</p>
          <p class="text">Hola ${cliente_nombre}, hemos revisado tu receta y comenzamos a fabricar tus lentes. Este proceso toma entre 2 y 4 días hábiles.</p>
          <hr class="divider"/>
          <p class="text">Pedido <strong>#${order_id}</strong></p>
          <p class="text" style="margin:0;">Te avisaremos en cuanto estén listos para envío.</p>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `Tus lentes están en fabricación — Pedido #${order_id}`,
      html,
    });
    await logEmail(order_id, 'fabricacion', data?.id || null, error ? 'error' : 'sent', error?.message);
  } catch (e: any) {
    await logEmail(order_id, 'fabricacion', null, 'error', e.message);
  }
}

// ── 3. ENVIADO ────────────────────────────────────────────────────────────
export async function enviarEmailEnviado(order_id: number, cliente_email: string, cliente_nombre: string, tracking: string, paqueteria: string) {
  if (await yaEnviado(order_id, 'enviado')) return;

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly"/></div>
        <div class="body">
          <p class="title">¡Tus lentes van<br/>en camino!</p>
          <p class="text">Hola ${cliente_nombre}, tu pedido ha sido enviado. Llegará en 3 a 7 días hábiles.</p>
          <hr class="divider"/>
          <p class="label">Pedido</p>
          <p class="value">#${order_id}</p>
          <p class="label">Paquetería</p>
          <p class="value">${paqueteria}</p>
          <p class="label">Número de rastreo</p>
          <p class="value" style="font-size:18px; font-weight:600; letter-spacing:0.05em;">${tracking}</p>
          <hr class="divider"/>
          <p class="text" style="margin-bottom:20px;">Puedes rastrear tu paquete directamente con ${paqueteria}.</p>
          <p class="text" style="margin:0; font-size:13px; color:#8C8680;">¿Algún problema? <a href="mailto:support@verlyoptical.com" style="color:#4A5940;">Contáctanos</a></p>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `¡Tu pedido #${order_id} va en camino! 📦`,
      html,
    });
    await logEmail(order_id, 'enviado', data?.id || null, error ? 'error' : 'sent', error?.message);
  } catch (e: any) {
    await logEmail(order_id, 'enviado', null, 'error', e.message);
  }
}

// ── 4. ENTREGADO ──────────────────────────────────────────────────────────
export async function enviarEmailEntregado(order_id: number, cliente_email: string, cliente_nombre: string) {
  if (await yaEnviado(order_id, 'entregado')) return;

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly"/></div>
        <div class="body">
          <p class="title">¡Tu pedido fue<br/>entregado!</p>
          <p class="text">Hola ${cliente_nombre}, esperamos que tus nuevos lentes te encanten. Recuerda que tienes 90 días de garantía y 30 días para devoluciones sin complicaciones.</p>
          <hr class="divider"/>
          <p class="text">Pedido <strong>#${order_id}</strong></p>
          <p class="text" style="margin-bottom:24px;">Si tienes algún problema con tu pedido, no dudes en contactarnos.</p>
          <a href="mailto:support@verlyoptical.com" class="btn btn-sage">Contactar soporte</a>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `¡Tu pedido #${order_id} fue entregado!`,
      html,
    });
    await logEmail(order_id, 'entregado', data?.id || null, error ? 'error' : 'sent', error?.message);

    // Programar email de 30 días
    const scheduled_for = new Date();
    scheduled_for.setDate(scheduled_for.getDate() + 30);
    await supabase.from('scheduled_emails').insert({
      order_id,
      email_type: 'seguimiento_30',
      scheduled_for: scheduled_for.toISOString(),
      sent: false,
    });
  } catch (e: any) {
    await logEmail(order_id, 'entregado', null, 'error', e.message);
  }
}

// ── 5. SEGUIMIENTO 30 DÍAS ────────────────────────────────────────────────
export async function enviarEmailSeguimiento(order_id: number, cliente_email: string, cliente_nombre: string) {
  if (await yaEnviado(order_id, 'seguimiento_30')) return;

  const encuesta_url = `${BASE_URL}/encuesta?pedido=${order_id}`;

  const html = `
    <!DOCTYPE html><html><head><style>${estilos}</style></head><body>
    <div class="wrapper">
      <div class="card">
        <div class="header"><img src="${logo}" alt="Verly"/></div>
        <div class="body">
          <p class="title">¿Cómo van tus<br/>nuevos lentes?</p>
          <p class="text">Hola ${cliente_nombre}, han pasado 30 días desde que recibiste tu pedido #${order_id}. Nos encantaría saber cómo ha sido tu experiencia.</p>
          <hr class="divider"/>
          <p class="text" style="margin-bottom:24px;">Tu opinión nos ayuda a mejorar y es muy importante para nosotros. Solo toma 2 minutos.</p>
          <a href="${encuesta_url}" class="btn">Dejar mi opinión</a>
          <hr class="divider"/>
          <p class="text" style="margin:0; font-size:13px;">¿Algo no está bien con tus lentes? <a href="mailto:support@verlyoptical.com" style="color:#4A5940;">Contáctanos</a>, tenemos garantía de 90 días.</p>
        </div>
        ${footer()}
      </div>
    </div>
    </body></html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: cliente_email,
      subject: `¿Cómo van tus lentes? — Pedido #${order_id}`,
      html,
    });
    await logEmail(order_id, 'seguimiento_30', data?.id || null, error ? 'error' : 'sent', error?.message);

    // Marcar como enviado en scheduled_emails
    await supabase
      .from('scheduled_emails')
      .update({ sent: true, sent_at: new Date().toISOString() })
      .eq('order_id', order_id)
      .eq('email_type', 'seguimiento_30');
  } catch (e: any) {
    await logEmail(order_id, 'seguimiento_30', null, 'error', e.message);
  }
}