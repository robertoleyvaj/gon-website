'use client';

import { useContext } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LanguageContext } from '../../components/LanguageContext';
import { posts } from '../posts';
import { use } from 'react';

const CATEGORIAS = {
  local: { es: 'Local', en: 'Local' },
  'salud-visual': { es: 'Salud Visual', en: 'Eye Health' },
  frontera: { es: 'Frontera', en: 'Border' },
  moda: { es: 'Moda', en: 'Style' },
};

const CATEGORIA_COLORS: Record<string, string> = {
  local: 'bg-blue-100 text-blue-800',
  'salud-visual': 'bg-green-100 text-green-800',
  frontera: 'bg-orange-100 text-orange-800',
  moda: 'bg-purple-100 text-purple-800',
};

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang } = useContext(LanguageContext);
  const es = lang === 'es';

  const post = posts.find(p => p.slug === slug);
  if (!post) notFound();

  const titulo = es ? post.titulo_es : post.titulo_en;
  const contenido = es ? post.contenido_es : post.contenido_en;
  const categoria = CATEGORIAS[post.categoria][lang];

  // Related posts (same category, excluding self)
  const related = posts
    .filter(p => p.categoria === post.categoria && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#012E40] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-blue-300 text-sm hover:underline mb-4 inline-block">
            ← {es ? 'Blog' : 'Blog'}
          </Link>
          <span className={`ml-3 text-xs font-semibold px-2 py-1 rounded-full ${CATEGORIA_COLORS[post.categoria]}`}>
            {categoria}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 leading-tight">{titulo}</h1>
          <p className="text-blue-200 mt-2 text-sm">
            {new Date(post.fecha).toLocaleDateString(es ? 'es-MX' : 'en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
            {' · '}GON Óptica Rosarito
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-10">
        <div
          className="prose prose-lg prose-headings:text-[#012E40] prose-a:text-[#012E40] max-w-none"
          dangerouslySetInnerHTML={{ __html: contenido }}
        />

        {/* CTA */}
        <div className="mt-12 bg-[#F0F7FF] border border-blue-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-[#012E40] mb-2">
            {es ? '¿Listo para ver mejor?' : 'Ready to see better?'}
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            {es
              ? 'Visítanos en cualquiera de nuestras 3 sucursales en Rosarito. Examen de la vista gratis, sin cita.'
              : 'Visit any of our 3 locations in Rosarito. Free eye exam, no appointment needed.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/Tienda"
              className="bg-[#012E40] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#024060] transition-colors text-sm"
            >
              {es ? 'Ver armazones' : 'Browse Frames'}
            </Link>
            <Link
              href="/ubicaciones"
              className="border border-[#012E40] text-[#012E40] px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              {es ? 'Nuestras sucursales' : 'Our Locations'}
            </Link>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-[#012E40] mb-6">
            {es ? 'Artículos relacionados' : 'Related Articles'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow block"
              >
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORIA_COLORS[r.categoria]}`}>
                  {CATEGORIAS[r.categoria][lang]}
                </span>
                <p className="mt-2 text-sm font-semibold text-gray-800 leading-snug">
                  {es ? r.titulo_es : r.titulo_en}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
