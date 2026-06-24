'use client';

import Link from 'next/link';
import { useLang } from '../components/LanguageContext';
import { posts } from './posts';
import Navbar from '../components/Navbar';

const CATEGORIAS = {
  local:          { es: 'Local',        en: 'Local'      },
  'salud-visual': { es: 'Salud Visual', en: 'Eye Health' },
  frontera:       { es: 'Frontera',     en: 'Border'     },
  moda:           { es: 'Moda',         en: 'Style'      },
};

const CAT_COLORS: Record<string, string> = {
  local:          '#DBEAFE',
  'salud-visual': '#D1FAE5',
  frontera:       '#FEF3C7',
  moda:           '#EDE9FE',
};
const CAT_TEXT: Record<string, string> = {
  local:          '#1E40AF',
  'salud-visual': '#065F46',
  frontera:       '#92400E',
  moda:           '#5B21B6',
};

export default function BlogPage() {
  const { lang } = useLang();
  const es = lang === 'es';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ paddingTop: '100px', background: 'var(--sage)', color: 'white' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>
            GON ÓPTICA
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1 }}>
            {es ? 'Blog de Salud Visual' : 'Eye Health Blog'}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.8 }}>
            {es
              ? 'Guías, consejos y todo lo que necesitas saber sobre lentes, óptica y salud visual — desde Rosarito.'
              : 'Guides, tips, and everything you need to know about eyecare and vision health — from Rosarito.'}
          </p>
        </div>
      </div>

      {/* Grid de posts */}
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ display: 'block', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', transition: 'box-shadow 0.2s ease', background: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              {/* Chip de categoría */}
              <div style={{ padding: '1rem 1rem 0' }}>
                <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '999px', background: CAT_COLORS[post.categoria], color: CAT_TEXT[post.categoria] }}>
                  {CATEGORIAS[post.categoria][lang]}
                </span>
              </div>

              <div style={{ padding: '0.75rem 1rem 1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {es ? post.titulo_es : post.titulo_en}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {es ? post.descripcion_es : post.descripcion_en}
                </p>
                <p style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--warm-gray-light)' }}>
                  {new Date(post.fecha).toLocaleDateString(es ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
