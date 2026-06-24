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

  const prev = () => setCurrent(c => (c - 1 + fotos.length) % fotos.length);

  useEffect(() => {
    if (isHovered || fotos.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isHovered, next, fotos.length]);

  if (!fotos.length) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', background: 'var(--border)' }}
    >
      {/* Slides */}
      {fotos.map((foto, i) => (
        <div key={foto} style={{ position: 'absolute', inset: 0, opacity: i === current ? 1 : 0, transition: 'opacity 0.7s ease', zIndex: i === current ? 1 : 0 }}>
          <img
            src={foto}
            alt={`${nombre} — foto ${i + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              const t = e.currentTarget as HTMLImageElement;
              t.style.display = 'none';
              const p = t.parentElement;
              if (p && !p.querySelector('.ph')) {
                const d = document.createElement('div');
                d.className = 'ph';
                d.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--warm-gray);font-size:0.85rem;font-family:var(--font-sans)';
                d.textContent = `Foto de ${nombre}`;
                p.appendChild(d);
              }
            }}
          />
        </div>
      ))}

      {/* Flechas */}
      {fotos.length > 1 && (
        <>
          {[{ fn: prev, dir: 'left', pts: '15 18 9 12 15 6' }, { fn: next, dir: 'right', pts: '9 18 15 12 9 6' }].map(({ fn, dir, pts }) => (
            <button key={dir} onClick={fn} aria-label={dir} style={{ position: 'absolute', [dir]: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round"><polyline points={pts}/></svg>
            </button>
          ))}
        </>
      )}

      {/* Dots */}
      {fotos.length > 1 && (
        <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }}>
          {fotos.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ border: 'none', cursor: 'pointer', borderRadius: '999px', height: '7px', width: i === current ? '20px' : '7px', background: i === current ? 'white' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s ease', padding: 0 }} />
          ))}
        </div>
      )}

      {/* Contador */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '999px', fontFamily: 'var(--font-sans)' }}>
        {current + 1} / {fotos.length}
      </div>
    </div>
  );
}
