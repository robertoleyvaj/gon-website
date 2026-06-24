'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useContext } from 'react';
import { LanguageContext } from '../../components/LanguageContext';
import { sucursales } from '../sucursales';
import PhotoCarousel from '../../components/PhotoCarousel';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i <= n ? '#FBBC04' : '#e5e7eb'} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function SucursalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang } = useContext(LanguageContext);
  const es = lang === 'es';

  const s = sucursales.find(s => s.slug === slug);
  if (!s) notFound();

  const [reviewStart, setReviewStart] = useState(0);
  const visibles = 3;
  const totalReviews = s.resenas.length;
  const canNext = reviewStart + visibles < totalReviews;
  const canPrev = reviewStart > 0;

  // Calificación promedio
  const avg = (s.resenas.reduce((acc, r) => acc + r.estrellas, 0) / s.resenas.length).toFixed(1);

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="bg-[#012E40] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/ubicaciones" className="text-blue-300 text-sm hover:underline mb-3 inline-block">
            ← {es ? 'Todas las sucursales' : 'All locations'}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{s.nombre_largo}</h1>
          <p className="text-blue-200 mt-2 text-sm">{s.direccion}</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              <Stars n={5} />
              <span className="text-white font-bold text-sm ml-1">{avg}</span>
            </div>
            <span className="text-blue-300 text-sm">
              {totalReviews} {es ? 'reseñas en Google' : 'Google reviews'}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">

        {/* ── Carrusel de fotos ── */}
        <section>
          <PhotoCarousel fotos={s.fotos} nombre={s.nombre_corto} />
        </section>

        {/* ── Info de la sucursal ── */}
        <section className="grid sm:grid-cols-3 gap-6">
          {/* Dirección */}
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#012E40" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {es ? 'Dirección' : 'Address'}
              </p>
              <p className="text-sm text-gray-800">{s.direccion}</p>
              <a
                href={s.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#012E40] hover:underline mt-1 inline-block font-medium"
              >
                {es ? 'Ver en Google Maps →' : 'View on Google Maps →'}
              </a>
            </div>
          </div>

          {/* Horario */}
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#012E40" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {es ? 'Horario' : 'Hours'}
              </p>
              <p className="text-sm text-gray-800">{es ? s.horario_es : s.horario_en}</p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#012E40" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91A16 16 0 0 0 16 17l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {es ? 'Teléfono' : 'Phone'}
              </p>
              <a href={`tel:${s.telefono}`} className="text-sm text-[#012E40] font-medium hover:underline">
                {s.telefono}
              </a>
            </div>
          </div>
        </section>

        {/* ── Descripción ── */}
        <section className="bg-[#F8FBFF] border border-blue-100 rounded-xl p-6">
          <p className="text-gray-700 leading-relaxed">
            {es ? s.descripcion_es : s.descripcion_en}
          </p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2">
            {[
              es ? '✓ Examen de la vista gratis' : '✓ Free eye exam',
              es ? '✓ Sin cita previa' : '✓ No appointment needed',
              es ? '✓ Optometristas certificados' : '✓ Certified optometrists',
              es ? '✓ Lentes monofocales, bifocales y progresivos' : '✓ Single vision, bifocal & progressive lenses',
              es ? '✓ Más de 100 modelos de armazones' : '✓ 100+ frame styles',
              es ? '✓ Pagos en MXN y USD' : '✓ MXN and USD accepted',
            ].map(item => (
              <li key={item} className="text-sm text-gray-700">{item}</li>
            ))}
          </ul>
        </section>

        {/* ── Reseñas de Google ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#012E40]">
                {es ? 'Reseñas de Google' : 'Google Reviews'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Stars n={5} />
                <span className="text-lg font-bold text-gray-800">{avg}</span>
                <span className="text-gray-400 text-sm">
                  ({totalReviews} {es ? 'reseñas' : 'reviews'})
                </span>
                <GoogleLogo />
              </div>
            </div>
            {/* Flechas de reseñas */}
            <div className="flex gap-2">
              <button
                onClick={() => setReviewStart(r => Math.max(0, r - visibles))}
                disabled={!canPrev}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:border-gray-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={() => setReviewStart(r => canNext ? r + visibles : r)}
                disabled={!canNext}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:border-gray-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          {/* Cards de reseñas */}
          <div className="grid sm:grid-cols-3 gap-4">
            {s.resenas.slice(reviewStart, reviewStart + visibles).map((r, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                {/* Header de reseña */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#012E40] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {r.nombre.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{r.nombre}</p>
                    <p className="text-xs text-gray-400">{r.fecha}</p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <GoogleLogo />
                  </div>
                </div>
                <Stars n={r.estrellas} />
                <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-4">{r.texto}</p>
              </div>
            ))}
          </div>

          {/* Dots de reseñas */}
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: Math.ceil(totalReviews / visibles) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setReviewStart(i * visibles)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: reviewStart / visibles === i ? '20px' : '7px',
                  height: '7px',
                  background: reviewStart / visibles === i ? '#012E40' : '#d1d5db',
                }}
              />
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#012E40] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            {es ? '¿Listo para tu cita?' : 'Ready for your visit?'}
          </h3>
          <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto">
            {es
              ? 'No necesitas cita previa. Llega, haz tu examen gratis y elige tus lentes.'
              : 'No appointment needed. Walk in, get your free eye exam, and choose your glasses.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${s.telefono}`}
              className="bg-white text-[#012E40] px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              {es ? 'Llamar ahora' : 'Call Now'} — {s.telefono}
            </a>
            <a
              href={s.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              {es ? 'Cómo llegar' : 'Get Directions'}
            </a>
            <Link
              href="/Tienda"
              className="border border-white text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              {es ? 'Ver armazones' : 'Browse Frames'}
            </Link>
          </div>
        </section>

        {/* ── Otras sucursales ── */}
        <section>
          <h3 className="text-lg font-bold text-[#012E40] mb-4">
            {es ? 'Otras sucursales GON en Rosarito' : 'Other GON Locations in Rosarito'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {sucursales.filter(other => other.slug !== s.slug).map(other => (
              <Link
                key={other.slug}
                href={`/sucursales/${other.slug}`}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-blue-200 transition-all block"
              >
                <p className="font-semibold text-gray-900 text-sm">{other.nombre_largo}</p>
                <p className="text-xs text-gray-500 mt-1">{other.direccion}</p>
                <p className="text-xs text-[#012E40] mt-2 font-medium">
                  {es ? 'Ver sucursal →' : 'View location →'}
                </p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
