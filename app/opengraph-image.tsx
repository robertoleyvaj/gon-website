import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GON — Grupo Óptico del Noroeste';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#F4F7FA',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Lado izquierdo — branding */}
        <div
          style={{
            width: '52%',
            height: '100%',
            background: '#1B2F5E',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px',
          }}
        >
          {/* Logo text */}
          <div style={{ fontSize: 96, fontWeight: 700, color: 'white', letterSpacing: '-3px', lineHeight: 1 }}>
            gon
          </div>
          {/* Subtítulo */}
          <div style={{ fontSize: 13, fontWeight: 400, color: '#2DBFB8', letterSpacing: '3px', textTransform: 'uppercase', marginTop: 14 }}>
            Grupo Óptico del Noroeste
          </div>
          {/* Línea decorativa */}
          <div style={{ width: 48, height: 2, background: '#2DBFB8', marginTop: 36 }} />
          {/* Tagline */}
          <div style={{ fontSize: 34, fontWeight: 300, color: 'white', marginTop: 36, lineHeight: 1.3, maxWidth: 420 }}>
            Tu visión.<br/>Nuestra prioridad.
          </div>
          {/* Bullets */}
          <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
            {['Examen gratis', '3 sucursales', 'Rosarito, B.C.'].map((t) => (
              <div key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {t}
              </div>
            ))}
          </div>
          {/* URL */}
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 48, letterSpacing: '2px' }}>
            GONMX.COM
          </div>
        </div>

        {/* Lado derecho — imagen */}
        <div
          style={{
            width: '48%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://gonmx.com/hero-man.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }}
          />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
