'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { LanguageContext } from '../components/LanguageContext';
import { posts } from './posts';

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

export default function BlogPage() {
  const { lang } = useContext(LanguageContext);
  const es = lang === 'es';

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#012E40] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            {es ? 'Blog de Salud Visual' : 'Eye Health Blog'}
          </h1>
          <p className="text-lg text-blue-200">
            {es
              ? 'Guías, consejos y todo lo que necesitas saber sobre lentes, óptica y salud visual — desde Rosarito para el mundo.'
              : 'Guides, tips, and everything you need to know about glasses, eyecare, and vision health — from Rosarito to the world.'}
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Category chip */}
              <div className="px-4 pt-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CATEGORIA_COLORS[post.categoria]}`}>
                  {CATEGORIAS[post.categoria][lang]}
                </span>
              </div>

              <div className="p-4">
                <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#012E40] transition-colors leading-snug">
                  {es ? post.titulo_es : post.titulo_en}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {es ? post.descripcion_es : post.descripcion_en}
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  {new Date(post.fecha).toLocaleDateString(es ? 'es-MX' : 'en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
