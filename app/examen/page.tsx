// app/examen/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';

const WHATSAPP = 'https://wa.me/526648343018';

const SUCURSALES = [
  { id: 'centro',   nombre: 'GON Centro',        direccion: 'Blvd. Benito Juárez 123, Centro, Rosarito, B.C.' },
  { id: 'pabellon', nombre: 'GON Plaza Pabellón', direccion: 'Plaza Pabellón, Local 15, Rosarito, B.C.' },
  { id: 'norte',    nombre: 'GON Zona Norte',     direccion: 'Blvd. Popotla 300, Local 8, Rosarito, B.C.' },
];

function msgWA(sucursal: string, tipo: 'solo_cita' | 'con_pedido', pedido?: string) {
  if (tipo === 'con_pedido') {
    return encodeURIComponent(`Hola, quiero agendar mi examen de la vista en ${sucursal}. Ya hice mi pedido en línea (${pedido || 'pendiente'}), solo necesito la graduación. ¿Qué horarios tienen disponibles?`);
  }
  return encodeURIComponent(`Hola, me gustaría agendar una cita para examen de la vista en ${sucursal}. ¿Qué horarios tienen disponibles?`);
}

export default function ExamenPage() {
  const { lang } = useLang() as any;
  const [esMobil, setEsMobil] = useState(false);
  const [flujo, setFlujo] = useState<'inicio' | 'explorador' | 'sin_graduacion'>('inicio');
  const [sucursalSel, setSucursalSel] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const t = (es: string, en: string) => lang === 'es' ? es : en;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ paddingTop: esMobil ? '100px' : '120px', paddingBottom: esMobil ? '3rem' : '5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '0 1.5rem' : '0 5rem' }}>
          <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 1rem' }}>
            {t('GON ÓPTICA — EXAMEN DE LA VISTA', 'GON ÓPTICA — EYE EXAM')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '3rem' : '5rem', fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 1.5rem', lineHeight: 1.0, color: 'var(--charcoal)', maxWidth: '700px' }}>
            {t('Ve con claridad.\nSiempre.', 'See clearly.\nAlways.')}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--warm-gray)', lineHeight: 1.8, maxWidth: '520px', margin: '0 0 2.5rem' }}>
            {t('Examen profesional de la vista, sin costo. Realizado por optometristas certificados en cualquiera de nuestras sucursales en Rosarito.', 'Professional eye exam at no cost. Performed by certified optometrists at any of our locations in Rosarito.')}
          </p>

          {/* BADGES */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { icono: '✓', label: t('Sin costo', 'Free of charge') },
              { icono: '✓', label: t('Con cita previa', 'By appointment') },
              { icono: '✓', label: t('Optometristas certificados', 'Certified optometrists') },
              { icono: '✓', label: t('3 sucursales en Rosarito', '3 locations in Rosarito') },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 500, color: 'var(--charcoal)', background: 'var(--cream-dark)', padding: '6px 14px', borderRadius: '2px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{b.icono}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ¿CUÁL ES TU CASO? */}
      {flujo === 'inicio' && (
        <div style={{ padding: esMobil ? '3rem 1.5rem' : '5rem 5rem', maxWidth: '1360px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.75rem' }}>
            {t('¿CUÁL ES TU SITUACIÓN?', 'WHAT DESCRIBES YOU BEST?')}
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 3rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {t('Cuéntanos cómo podemos ayudarte', 'Tell us how we can help')}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem' }}>

            {/* Opción 1 */}
            <Link href="/Tienda" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '2rem', cursor: 'pointer', transition: 'box-shadow 0.2s', height: '100%' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,47,94,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 0.5rem' }}>
                  {t('Opción 1', 'Option 1')}
                </p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
                  {t('Ya tengo mi graduación', 'I already have my prescription')}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
                  {t('Compra tus lentes en línea, sube tu receta y recógelos en la sucursal que prefieras.', 'Order your glasses online, upload your prescription, and pick them up at your preferred location.')}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)' }}>
                  {t('Ver armazones', 'Shop frames')} →
                </div>
              </div>
            </Link>

            {/* Opción 2 */}
            <div
              onClick={() => setFlujo('sin_graduacion')}
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '2rem', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,47,94,0.10)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              </div>
              <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 0.5rem' }}>
                {t('Opción 2', 'Option 2')}
              </p>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
                {t('Sé qué quiero, pero no tengo graduación', "I know what I want, but don't have a prescription")}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
                {t('Arma tu pedido en línea y agenda tu examen. Cuando llegues solo tomamos tu graduación y completamos el pedido.', 'Build your order online and schedule your exam. When you arrive we just take your prescription and complete the order.')}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)' }}>
                {t('Agendar examen', 'Schedule exam')} →
              </div>
            </div>

            {/* Opción 3 */}
            <div
              onClick={() => setFlujo('explorador')}
              style={{ background: 'var(--sage)', border: '1px solid var(--sage)', borderRadius: '4px', padding: '2rem', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,47,94,0.20)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.5rem' }}>
                {t('Opción 3', 'Option 3')}
              </p>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'white', margin: '0 0 0.75rem', lineHeight: 1.2 }}>
                {t('No sé por dónde empezar', "I'm not sure where to start")}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
                {t('Agenda tu cita y ven a vernos. Nuestro equipo te asesora en todo — graduación, armazón y lentes.', 'Schedule an appointment and come see us. Our team will guide you through everything — exam, frames, and lenses.')}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white' }}>
                {t('Solo quiero agendar', 'Just schedule')} →
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FLUJO: EXPLORADOR — elegir sucursal */}
      {(flujo === 'explorador' || flujo === 'sin_graduacion') && (
        <div style={{ padding: esMobil ? '3rem 1.5rem' : '5rem 5rem', maxWidth: '1360px', margin: '0 auto' }}>
          <button onClick={() => { setFlujo('inicio'); setSucursalSel(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, color: 'var(--warm-gray)', letterSpacing: '0.08em', padding: '0', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)' }}>
            ← {t('Volver', 'Back')}
          </button>

          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.75rem' }}>
            {t('ELIGE TU SUCURSAL', 'CHOOSE YOUR LOCATION')}
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 0.75rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {flujo === 'sin_graduacion'
              ? t('¿Dónde quieres hacer tu examen?', 'Where would you like your eye exam?')
              : t('¿A qué sucursal quieres ir?', 'Which location would you like to visit?')}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--warm-gray)', margin: '0 0 2.5rem', lineHeight: 1.7 }}>
            {t('Selecciona la sucursal y te conectamos por WhatsApp para confirmar tu cita.', 'Select a location and we\'ll connect you via WhatsApp to confirm your appointment.')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {SUCURSALES.map(s => (
              <div
                key={s.id}
                onClick={() => setSucursalSel(s.id)}
                style={{
                  background: sucursalSel === s.id ? 'var(--sage)' : 'white',
                  border: `1px solid ${sucursalSel === s.id ? 'var(--sage)' : 'var(--border)'}`,
                  borderRadius: '4px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sucursalSel === s.id ? 'white' : 'var(--accent)'} strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: sucursalSel === s.id ? 'white' : 'var(--charcoal)' }}>{s.nombre}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: sucursalSel === s.id ? 'rgba(255,255,255,0.75)' : 'var(--warm-gray)', margin: 0, lineHeight: 1.6 }}>{s.direccion}</p>
              </div>
            ))}
          </div>

          {sucursalSel && (
            <a
              href={`${WHATSAPP}?text=${msgWA(SUCURSALES.find(s => s.id === sucursalSel)!.nombre, flujo === 'sin_graduacion' ? 'con_pedido' : 'solo_cita')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.502 3.935 1.385 5.608L0 24l6.572-1.364A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 0 1-5.032-1.388l-.361-.214-3.741.98.998-3.648-.235-.374A9.755 9.755 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              {t('Agendar por WhatsApp', 'Schedule via WhatsApp')}
            </a>
          )}
        </div>
      )}

      {/* CÓMO FUNCIONA */}
      {flujo === 'inicio' && (
        <div style={{ background: 'var(--cream-dark)', padding: esMobil ? '3rem 1.5rem' : '5rem 5rem' }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.75rem' }}>
              {t('¿CÓMO FUNCIONA?', 'HOW IT WORKS')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 3rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {t('Simple y rápido', 'Simple and fast')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(4, 1fr)', gap: '2rem' }}>
              {[
                { num: '01', titulo: t('Agenda tu cita', 'Book your appointment'), desc: t('Elige tu sucursal y confirma por WhatsApp. Sin formularios complicados.', 'Choose your location and confirm via WhatsApp. No complicated forms.') },
                { num: '02', titulo: t('Llega a tu hora', 'Arrive on time'), desc: t('Preséntate en la sucursal a la hora acordada. La cita dura aproximadamente 20 minutos.', 'Come to the location at the agreed time. The appointment takes about 20 minutes.') },
                { num: '03', titulo: t('Examen profesional', 'Professional exam'), desc: t('Nuestro optometrista determina tu graduación exacta con equipo de última generación.', 'Our optometrist determines your exact prescription with state-of-the-art equipment.') },
                { num: '04', titulo: t('Llévate tus lentes', 'Take home your glasses'), desc: t('Elige tu armazón y lentes ese mismo día, o recibe tu receta para ordenar en línea.', 'Choose your frame and lenses that same day, or get your prescription to order online.') },
              ].map((p, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 300, color: 'var(--border)', lineHeight: 1, marginBottom: '1rem' }}>{p.num}</div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)', margin: '0 0 0.5rem' }}>{p.titulo}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CTA */}
      {flujo === 'inicio' && (
        <div style={{ background: 'var(--sage)', padding: esMobil ? '3rem 1.5rem' : '5rem 5rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, color: 'white', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
            {t('¿Listo para ver mejor?', 'Ready to see better?')}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 2rem', lineHeight: 1.7 }}>
            {t('Agenda tu examen gratis hoy. Sin seguro, sin complicaciones.', 'Schedule your free exam today. No insurance, no complications.')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setFlujo('explorador')} style={{ background: 'white', color: 'var(--sage)', border: 'none', borderRadius: '3px', padding: '14px 28px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {t('Agendar examen gratis', 'Schedule free exam')}
            </button>
            <Link href="/Tienda" style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '3px', padding: '14px 28px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              {t('Ver armazones', 'Shop frames')}
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
