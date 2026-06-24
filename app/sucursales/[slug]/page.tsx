'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '../../components/LanguageContext';
import { sucursales } from '../sucursales';
import PhotoCarousel from '../../components/PhotoCarousel';
import Navbar from '../../components/Navbar';

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= n ? '#FBBC04' : '#E5E7EB'} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const ICON_STYLE = { flexShrink: 0, marginTop: '2px' } as const;

export default function SucursalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang } = useLang();
  const es = lang === 'es';

  const s = sucursales.find(s => s.slug === slug);
  if (!s) notFound();

  const visibles = 3;
  const [reviewStart, setReviewStart] = useState(0);
  const total = s.resenas.length;
  const pages = Math.ceil(total / visibles);
  const currentPage = Math.floor(reviewStart / visibles);

  const avg = (s.resenas.reduce((a, r) => a + r.estrellas, 0) / total).toFixed(1);

  const t = (a: string, b: string) => es ? a : b;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{ paddingTop: '64px', background: 'var(--sage)', color: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem 2.5rem' }}>
          <Link href="/ubicaciones" style={{ fontSize: '0.72rem', color: 'var(--accent)', textDecoration: 'none', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '1rem' }}>
            ← {t('Todas las sucursales', 'All locations')}
          </Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {s.nombre_largo}
          </h1>
          <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>{s.direccion}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <Stars n={5} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{avg}</span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
              {total} {t('reseñas en Google', 'Google reviews')}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ── Carrusel ── */}
        <PhotoCarousel fotos={s.fotos} nombre={s.nombre_corto} />

        {/* ── Info ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          {[
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={ICON_STYLE}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
              label: t('Dirección', 'Address'),
              content: <>{s.direccion}<br/><a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600 }}>{t('Ver en Google Maps →', 'Open in Google Maps →')}</a></>,
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={ICON_STYLE}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
              label: t('Horario', 'Hours'),
              content: es ? s.horario_es : s.horario_en,
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={ICON_STYLE}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91A16 16 0 0 0 16 17l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
              label: t('Teléfono', 'Phone'),
              content: <a href={`tel:${s.telefono}`} style={{ color: 'var(--sage)', fontWeight: 600 }}>{s.telefono}</a>,
            },
          ].map(({ icon, label, content }) => (
            <div key={label} style={{ display: 'flex', gap: '12px' }}>
              {icon}
              <div>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '4px' }}>{label}</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--charcoal)', lineHeight: 1.6 }}>{content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Descripción + servicios ── */}
        <div style={{ marginTop: '2.5rem', background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.75rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--warm-gray)', lineHeight: 1.85, marginBottom: '1rem' }}>
            {es ? s.descripcion_es : s.descripcion_en}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.4rem' }}>
            {[
              t('✓ Examen de la vista gratis', '✓ Free eye exam'),
              t('✓ Sin cita previa', '✓ Walk-ins welcome'),
              t('✓ Optometristas certificados', '✓ Certified optometrists'),
              t('✓ Monofocal, bifocal y progresivo', '✓ Single vision, bifocal & progressive'),
              t('✓ Más de 100 modelos de armazones', '✓ 100+ frame styles'),
              t('✓ Pagos en MXN y USD', '✓ MXN and USD accepted'),
            ].map(item => (
              <p key={item} style={{ fontSize: '0.82rem', color: 'var(--charcoal)' }}>{item}</p>
            ))}
          </div>
        </div>

        {/* ── Reseñas ── */}
        <div style={{ marginTop: '3rem' }}>
          {/* Header reseñas */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.4rem' }}>
                {t('Reseñas de Google', 'Google Reviews')}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stars n={5} />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--charcoal)' }}>{avg}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--warm-gray)' }}>({total} {t('reseñas', 'reviews')})</span>
                <GoogleLogo />
              </div>
            </div>
            {/* Flechas paginación */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { fn: () => setReviewStart(r => Math.max(0, r - visibles)), pts: '15 18 9 12 15 6', dis: currentPage === 0 },
                { fn: () => setReviewStart(r => currentPage < pages - 1 ? r + visibles : r), pts: '9 18 15 12 9 6', dis: currentPage >= pages - 1 },
              ].map(({ fn, pts, dis }, i) => (
                <button key={i} onClick={fn} disabled={dis} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)', background: 'white', cursor: dis ? 'default' : 'pointer', opacity: dis ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points={pts}/></svg>
                </button>
              ))}
            </div>
          </div>

          {/* Cards reseñas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {s.resenas.slice(reviewStart, reviewStart + visibles).map((r, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', background: 'white', transition: 'box-shadow 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    {r.nombre.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nombre}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--warm-gray)' }}>{r.fecha}</p>
                  </div>
                  <GoogleLogo />
                </div>
                <Stars n={r.estrellas} />
                <p style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {r.texto}
                </p>
              </div>
            ))}
          </div>

          {/* Dots reseñas */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1.25rem' }}>
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => setReviewStart(i * visibles)} style={{ border: 'none', cursor: 'pointer', borderRadius: '999px', height: '7px', width: i === currentPage ? '20px' : '7px', background: i === currentPage ? 'var(--sage)' : 'var(--border)', transition: 'all 0.3s ease', padding: 0 }} />
              ))}
            </div>
          )}
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: '3rem', background: 'var(--sage)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', color: 'white' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>
            {t('¿Listo para visitarnos?', 'Ready to visit us?')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            {t('No necesitas cita previa. Llega, haz tu examen gratis y elige tus lentes.', 'No appointment needed. Walk in, get your free eye exam, and choose your glasses.')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
            <a href={`tel:${s.telefono}`} style={{ background: 'white', color: 'var(--sage)', padding: '10px 24px', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
              {t('Llamar', 'Call')} — {s.telefono}
            </a>
            <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '10px 24px', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
              {t('Cómo llegar', 'Get Directions')}
            </a>
            <Link href="/Tienda" style={{ border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '10px 24px', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
              {t('Ver armazones', 'Browse Frames')}
            </Link>
          </div>
        </div>

        {/* ── Otras sucursales ── */}
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '1rem' }}>
            {t('Otras sucursales GON en Rosarito', 'Other GON Locations in Rosarito')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {sucursales.filter(o => o.slug !== s.slug).map(o => (
              <Link key={o.slug} href={`/sucursales/${o.slug}`} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', textDecoration: 'none', color: 'inherit', display: 'block', background: 'white' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--charcoal)', marginBottom: '4px' }}>{o.nombre_largo}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', marginBottom: '0.5rem' }}>{o.direccion}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em' }}>
                  {t('Ver página →', 'View page →')}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
