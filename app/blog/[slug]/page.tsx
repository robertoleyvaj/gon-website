'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '../../components/LanguageContext';
import { posts } from '../posts';
import Navbar from '../../components/Navbar';

const CATEGORIAS = {
  local:          { es: 'Local',        en: 'Local'      },
  'salud-visual': { es: 'Salud Visual', en: 'Eye Health' },
  frontera:       { es: 'Frontera',     en: 'Border'     },
  moda:           { es: 'Moda',         en: 'Style'      },
};

const CAT_COLORS: Record<string, string> = {
  local: '#DBEAFE', 'salud-visual': '#D1FAE5', frontera: '#FEF3C7', moda: '#EDE9FE',
};
const CAT_TEXT: Record<string, string> = {
  local: '#1E40AF', 'salud-visual': '#065F46', frontera: '#92400E', moda: '#5B21B6',
};

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang } = useLang();
  const es = lang === 'es';

  const post = posts.find(p => p.slug === slug);
  if (!post) notFound();

  const related = posts.filter(p => p.categoria === post.categoria && p.slug !== post.slug).slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />

      {/* Header del artículo */}
      <div style={{ paddingTop: '64px', background: 'var(--sage)', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 2.5rem' }}>
          <Link href="/blog" style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            ← {es ? 'Blog' : 'Blog'}
          </Link>
          <span style={{ marginLeft: '0.75rem', display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '999px', background: CAT_COLORS[post.categoria], color: CAT_TEXT[post.categoria] }}>
            {CATEGORIAS[post.categoria][lang]}
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '-0.02em', marginTop: '1rem', lineHeight: 1.15 }}>
            {es ? post.titulo_es : post.titulo_en}
          </h1>
          <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-sans)' }}>
            {new Date(post.fecha).toLocaleDateString(es ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}GON Óptica Rosarito
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: es ? post.contenido_es : post.contenido_en }}
        />

        {/* CTA */}
        <div style={{ marginTop: '3rem', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--sage)', marginBottom: '0.5rem' }}>
            {es ? '¿Listo para ver mejor?' : 'Ready to see better?'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
            {es
              ? 'Visítanos en cualquiera de nuestras 3 sucursales en Rosarito. Examen de la vista gratis, sin cita.'
              : 'Visit any of our 3 locations in Rosarito. Free eye exam, no appointment needed.'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/Tienda" style={{ background: 'var(--sage)', color: 'white', padding: '10px 24px', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
              {es ? 'Ver armazones' : 'Browse Frames'}
            </Link>
            <Link href="/ubicaciones" style={{ border: '1px solid var(--sage)', color: 'var(--sage)', padding: '10px 24px', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
              {es ? 'Nuestras sucursales' : 'Our Locations'}
            </Link>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '1.25rem' }}>
              {es ? 'Artículos relacionados' : 'Related Articles'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', textDecoration: 'none', color: 'inherit', display: 'block', background: 'white' }}>
                  <span style={{ display: 'inline-block', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '999px', background: CAT_COLORS[r.categoria], color: CAT_TEXT[r.categoria], marginBottom: '0.5rem' }}>
                    {CATEGORIAS[r.categoria][lang]}
                  </span>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.3 }}>
                    {es ? r.titulo_es : r.titulo_en}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Estilos del contenido del artículo */}
      <style>{`
        .blog-content h2 {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 300;
          color: var(--sage);
          margin: 2rem 0 0.75rem;
          letter-spacing: -0.02em;
        }
        .blog-content p {
          font-size: 0.95rem;
          color: var(--warm-gray);
          line-height: 1.85;
          margin-bottom: 1rem;
        }
        .blog-content ul {
          margin: 0.5rem 0 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .blog-content li {
          font-size: 0.92rem;
          color: var(--warm-gray);
          line-height: 1.7;
        }
        .blog-content strong {
          color: var(--charcoal);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
