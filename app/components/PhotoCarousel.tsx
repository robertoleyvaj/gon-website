'use client';

import { useState, useEffect, useCallback } from 'react';

interface PhotoCarouselProps {
  fotos: string[];
  nombre: string;
}

export default function PhotoCarousel({ fotos, nombre }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % fotos.length);
  }, [fotos.length]);

  const prev = () => {
    setCurrent(c => (c - 1 + fotos.length) % fotos.length);
  };

  // Auto-advance every 4s, pausa al hover
  useEffect(() => {
    if (isHovered || fotos.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isHovered, next, fotos.length]);

  if (!fotos.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-gray-100"
      style={{ aspectRatio: '16/9' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {fotos.map((foto, i) => (
        <div
          key={foto}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={foto}
            alt={`${nombre} — foto ${i + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Placeholder si no existe la foto aún
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.placeholder-label')) {
                const label = document.createElement('div');
                label.className = 'placeholder-label absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-sm';
                label.textContent = `Foto de ${nombre}`;
                parent.appendChild(label);
              }
            }}
          />
        </div>
      ))}

      {/* Flechas */}
      {fotos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all"
            aria-label="Foto anterior"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all"
            aria-label="Siguiente foto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </>
      )}

      {/* Dots */}
      {fotos.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {fotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? '20px' : '7px',
                height: '7px',
                background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
              }}
              aria-label={`Ir a foto ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      <div className="absolute top-3 right-3 z-10 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
        {current + 1} / {fotos.length}
      </div>
    </div>
  );
}
