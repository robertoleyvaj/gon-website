// app/ubicaciones/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';

const SUCURSALES = [
  {
    id: 'bajavision',
    slug: 'optica-baja-vision-rosarito',
    telefono: '661 104 0873',
    nombre: 'Óptica Baja Visión',
    direccion: 'Blvd. Benito Juárez 79B, Centro, Rosarito, B.C.',
    años: '9',
    maps: 'https://maps.google.com/?q=Optica+Baja+Vision+Blvd+Benito+Juarez+Rosarito',
    // OpenStreetMap embed — lat/lon centrado en Blvd. Benito Juárez, Rosarito
    osm: 'https://www.openstreetmap.org/export/embed.html?bbox=-117.068%2C32.358%2C32.378%2C-117.038&layer=mapnik&marker=32.368%2C-117.058',
    horario_es: 'Lun – Dom: 10:00 – 18:00',
    horario_en: 'Mon – Sun: 10:00 AM – 6:00 PM',
    horario_extra_es: 'Atención fuera de horario con cita previa',
    horario_extra_en: 'After-hours service by appointment',
    wa: 'https://wa.me/526648343018?text=' + encodeURIComponent('Hola, quiero información sobre Óptica Baja Visión (Blvd. Benito Juárez).'),
  },
  {
    id: '5demayo',
    slug: 'optica-5-de-mayo-rosarito',
    telefono: '661 612 0316',
    nombre: 'Óptica Rosarito 5 de Mayo',
    direccion: 'C. 5 de Mayo 200, Local 1, Rosarito, B.C.',
    años: '12+',
    maps: 'https://maps.google.com/?q=Optica+Rosarito+5+de+Mayo+200+Rosarito+BC',
    osm: 'https://www.openstreetmap.org/export/embed.html?bbox=-117.062%2C32.358%2C32.378%2C-117.032&layer=mapnik&marker=32.365%2C-117.050',
    horario_es: 'Lun – Sáb: 10:00 – 18:00 · Dom: Cerrado',
    horario_en: 'Mon – Sat: 10:00 AM – 6:00 PM · Sun: Closed',
    horario_extra_es: 'Atención fuera de horario con cita previa',
    horario_extra_en: 'After-hours service by appointment',
    wa: 'https://wa.me/526648343018?text=' + encodeURIComponent('Hola, quiero información sobre Óptica Rosarito sucursal 5 de Mayo.'),
  },
  {
    id: 'laureles',
    slug: 'optica-laureles-rosarito',
    telefono: '661 104 0431',
    nombre: 'Óptica Rosarito Plaza Laureles',
    direccion: 'C. José María Morelos 118, Plaza Laureles, Rosarito, B.C.',
    años: '6',
    maps: 'https://maps.google.com/?q=Plaza+Laureles+Jose+Maria+Morelos+118+Rosarito+BC',
    osm: 'https://www.openstreetmap.org/export/embed.html?bbox=-117.065%2C32.358%2C32.378%2C-117.035&layer=mapnik&marker=32.370%2C-117.052',
    horario_es: 'Lun – Dom: 10:00 – 18:00',
    horario_en: 'Mon – Sun: 10:00 AM – 6:00 PM',
    horario_extra_es: 'Atención fuera de horario con cita previa',
    horario_extra_en: 'After-hours service by appointment',
    wa: 'https://wa.me/526648343018?text=' + encodeURIComponent('Hola, quiero información sobre Óptica Rosarito sucursal Plaza Laureles.'),
  },
];

export default function UbicacionesPage() {
  const { lang } = useLang() as any;
  const [esMobil, setEsMobil] = useState(false);
  const [activa, setActiva] = useState(SUCURSALES[0].id);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const t = (es: string, en: string) => lang === 'es' ? es : en;
  const sucursal = SUCURSALES.find(s => s.id === activa)!;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ paddingTop: esMobil ? '100px' : '120px', paddingBottom: esMobil ? '2.5rem' : '4rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '0 1.5rem' : '0 5rem' }}>
          <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 1rem' }}>
            {t('GON ÓPTICA — SUCURSALES', 'GON ÓPTICA — LOCATIONS')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '3rem' : '5rem', fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 1rem', lineHeight: 1.0, color: 'var(--charcoal)' }}>
            {t('Encuéntranos en Rosarito', 'Find us in Rosarito')}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--warm-gray)', lineHeight: 1.8, maxWidth: '520px', margin: 0 }}>
            {t('Tres sucursales en Playas de Rosarito para atenderte. Elige la más cercana a ti.', 'Three locations in Playas de Rosarito to serve you. Choose the one closest to you.')}
          </p>
        </div>
      </div>

      {/* SELECTOR + MAPA */}
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '2rem 1.5rem' : '4rem 5rem' }}>

        {/* Tabs de sucursal */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {SUCURSALES.map(s => (
            <button
              key={s.id}
              onClick={() => setActiva(s.id)}
              style={{
                background: activa === s.id ? 'var(--sage)' : 'white',
                color: activa === s.id ? 'white' : 'var(--charcoal)',
                border: `1px solid ${activa === s.id ? 'var(--sage)' : 'var(--border)'}`,
                borderRadius: '3px',
                padding: '10px 20px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {s.nombre}
            </button>
          ))}
        </div>

        {/* Layout: info + mapa */}
        <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1.6fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* Info */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '2rem' }}>
            <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 0.5rem' }}>
              {sucursal.años} {t('años en Rosarito', 'years in Rosarito')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 1.5rem', lineHeight: 1.2 }}>
              {sucursal.nombre}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Dirección */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '2px' }}>{t('Dirección', 'Address')}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--charcoal)', lineHeight: 1.5 }}>{sucursal.direccion}</div>
                </div>
              </div>

              {/* Horario */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '2px' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '2px' }}>{t('Horario', 'Hours')}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--charcoal)', lineHeight: 1.5 }}>{lang === 'es' ? sucursal.horario_es : sucursal.horario_en}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px', fontStyle: 'italic' }}>{lang === 'es' ? sucursal.horario_extra_es : sucursal.horario_extra_en}</div>
                </div>
              </div>

              {/* Teléfono */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.44 2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '2px' }}>{t('Teléfono', 'Phone')}</div>
                  <a href={`tel:${sucursal.telefono}`} style={{ fontSize: '0.85rem', color: 'var(--charcoal)', textDecoration: 'none', fontWeight: 600 }}>{sucursal.telefono}</a>
                  <div style={{ fontSize: '0.72rem', color: 'var(--warm-gray)', marginTop: '4px' }}>
                    WhatsApp: <a href="https://wa.me/526648343018" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>664 834 3018</a>
                  </div>
                </div>
              </div>

            </div>

            {/* Botones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
              <a
                href={sucursal.wa}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25D366', color: 'white', padding: '12px 20px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.502 3.935 1.385 5.608L0 24l6.572-1.364A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 0 1-5.032-1.388l-.361-.214-3.741.98.998-3.648-.235-.374A9.755 9.755 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                {t('Contactar por WhatsApp', 'Contact via WhatsApp')}
              </a>
              <a
                href={sucursal.maps}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'white', color: 'var(--sage)', border: '1px solid var(--border)', padding: '12px 20px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {t('Abrir en Google Maps', 'Open in Google Maps')}
              </a>
              <Link
                href="/examen"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--sage)', color: 'white', padding: '12px 20px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                {t('Agendar cita aquí', 'Book appointment here')}
              </Link>
            </div>
          </div>

          {/* Mapa OpenStreetMap — gratuito, sin API key */}
          <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)', height: esMobil ? '300px' : '480px' }}>
            <iframe
              key={activa}
              src={sucursal.osm}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
            />
          </div>

        </div>
      </div>

      {/* TODAS LAS SUCURSALES EN RESUMEN */}
      <div style={{ background: 'var(--cream-dark)', padding: esMobil ? '3rem 1.5rem' : '4rem 5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 2rem' }}>
            {t('TODAS LAS SUCURSALES', 'ALL LOCATIONS')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3,1fr)', gap: '1.25rem' }}>
            {SUCURSALES.map(s => (
              <div
                key={s.id}
                onClick={() => { setActiva(s.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ background: 'white', border: `1px solid ${activa === s.id ? 'var(--sage)' : 'var(--border)'}`, borderRadius: '4px', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--charcoal)' }}>{s.nombre}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', margin: '0 0 0.75rem', lineHeight: 1.5 }}>{s.direccion}</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em' }}>
                    {t('Ver en mapa →', 'View on map →')}
                  </span>
                  <Link
                    href={`/sucursales/${s.slug}`}
                    onClick={e => e.stopPropagation()}
                    style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--sage)', letterSpacing: '0.05em', textDecoration: 'none' }}
                  >
                    {t('Página completa →', 'Full page →')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
