// app/sunglasses/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { supabase } from '../supabase';

type Armazon = {
  id: number;
  nombre: string;
  forma: string;
  genero: string;
  stock: number;
  badge: string | null;
  activo: boolean;
  precio: number;
  color: string;
  imagen_url?: string;
};

function LenteSVG({ color, forma }: { color: string; forma: string }) {
  const rx = forma === 'ovalada' ? '30' : forma === 'rectangular' ? '8' : '14';
  return (
    <svg width="160" height="90" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="12" width="64" height="66" rx={rx} fill="none" stroke={color} strokeWidth="3"/>
      <rect x="92" y="12" width="64" height="66" rx={rx} fill="none" stroke={color} strokeWidth="3"/>
      <path d="M68 38 C72 32, 88 32, 92 38" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="4" y1="36" x2="-6" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="156" y1="36" x2="166" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Tinte solar */}
      <rect x="4" y="12" width="64" height="66" rx={rx} fill={color} fillOpacity="0.15"/>
      <rect x="92" y="12" width="64" height="66" rx={rx} fill={color} fillOpacity="0.15"/>
    </svg>
  );
}

const CATEGORIAS = [
  { id: 'todos', es: 'Todos', en: 'All' },
  { id: 'hombre', es: 'Hombre', en: 'Men' },
  { id: 'mujer', es: 'Mujer', en: 'Women' },
  { id: 'unisex', es: 'Unisex', en: 'Unisex' },
];

export default function Sunglasses() {
  const { t } = useLang();
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('armazones')
        .select('*')
        .eq('activo', true)
        .eq('tipo', 'solar')
        .order('id');
      setArmazones(data || []);
      setLoading(false);
    }
    cargar();
  }, []);

  const filtrados = filtro === 'todos'
    ? armazones
    : armazones.filter(a => a.genero === filtro);

  const labelGenero = (g: string) =>
    g === 'hombre' ? t('Hombre', 'Men')
    : g === 'mujer' ? t('Mujer', 'Women')
    : 'Unisex';

  return (
    <main style={{
      fontFamily: 'var(--font-sans), sans-serif',
      background: 'var(--cream)',
      minHeight: '100vh',
      color: 'var(--charcoal)',
    }}>
      <Navbar />

      {/* HERO HEADER */}
      <div style={{
        paddingTop: '120px',
        paddingBottom: '3rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--warm-gray)',
          marginBottom: '0.75rem',
          display: 'block',
        }}>
          {t('Colección Solar', 'Sun Collection')}
        </span>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 300,
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
          color: 'var(--charcoal)',
          margin: '0 0 1rem',
        }}>
          {t('Lentes de Sol', 'Sunglasses')}
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          color: 'var(--warm-gray)',
          letterSpacing: '0.02em',
          lineHeight: 1.7,
          maxWidth: '480px',
          margin: 0,
        }}>
          {t(
            'También se pueden graduar. Elige tu armazón y configuramos tus micas con tu prescripción.',
            'Prescription-ready. Choose your frame and we\'ll customize the lenses to your prescription.'
          )}
        </p>
      </div>

      {/* FILTROS STICKY */}
      <div style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--cream)',
        position: 'sticky',
        top: '64px',
        zIndex: 10,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
        }}>
          {CATEGORIAS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setFiltro(c.id)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                fontWeight: filtro === c.id ? 500 : 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: filtro === c.id ? 'var(--charcoal)' : 'var(--warm-gray)',
                background: 'none',
                border: 'none',
                borderBottom: filtro === c.id ? '1.5px solid var(--charcoal)' : '1.5px solid transparent',
                padding: '1.1rem 1.5rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                marginLeft: i === 0 ? 0 : undefined,
              }}
            >
              {t(c.es, c.en)}
            </button>
          ))}
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            color: 'var(--warm-gray)',
            whiteSpace: 'nowrap',
            paddingRight: '0.5rem',
          }}>
            {filtrados.length} {t('piezas', 'pieces')}
          </span>
        </div>
      </div>

      {/* GRID */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                background: 'var(--cream)',
                height: '380px',
                animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
          }}>
            {filtrados.map(a => (
              <Link
                key={a.id}
                href={`/armazon/${a.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  onMouseEnter={() => setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: hoveredId === a.id ? 'var(--cream-dark)' : 'var(--cream)',
                    cursor: 'pointer',
                    transition: 'background 0.25s ease',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Imagen */}
                  <div style={{
                    aspectRatio: '4/3',
                    background: '#EDEAE4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {a.imagen_url ? (
                      <img
                        src={a.imagen_url}
                        alt={a.nombre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          transform: hoveredId === a.id ? 'scale(1.04)' : 'scale(1)',
                        }}
                      />
                    ) : (
                      <div style={{ opacity: 0.6 }}>
                        <LenteSVG color={a.color || 'var(--charcoal)'} forma={a.forma || 'cuadrada'} />
                      </div>
                    )}

                    {/* Badge solar */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.62rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--sage)',
                      background: 'var(--cream)',
                      padding: '3px 9px',
                      border: '1px solid var(--border)',
                    }}>
                      {t('Graduable', 'Rx Ready')}
                    </div>

                    {a.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--charcoal)',
                        background: 'var(--cream)',
                        padding: '4px 10px',
                        border: '1px solid var(--border)',
                      }}>
                        {a.badge}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{
                    padding: '1.25rem 1.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    flex: 1,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.65rem',
                      fontWeight: 400,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--warm-gray)',
                    }}>
                      {labelGenero(a.genero)} · {a.forma}
                    </span>

                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.3rem',
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      color: 'var(--charcoal)',
                      margin: '0.15rem 0 0.75rem',
                    }}>
                      {a.nombre}
                    </h3>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                    }}>
                      <div>
                        <span style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: 'var(--charcoal)',
                        }}>
                          ${a.precio}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.7rem',
                          color: 'var(--warm-gray)',
                          marginLeft: '4px',
                          letterSpacing: '0.06em',
                        }}>
                          USD
                        </span>
                      </div>

                      <span style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.7rem',
                        fontWeight: 400,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: hoveredId === a.id ? 'var(--charcoal)' : 'var(--warm-gray)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'color 0.2s ease',
                      }}>
                        {t('Ver más', 'View')}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M2 7h10M8 3l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtrados.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '6rem 2rem',
            color: 'var(--warm-gray)',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 300,
              marginBottom: '0.5rem',
            }}>
              {t('Sin resultados', 'No results')}
            </p>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
            }}>
              {t('Prueba otro filtro', 'Try another filter')}
            </p>
          </div>
        )}
      </div>

      {/* BANNER INFERIOR */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '4rem 2rem',
        background: 'var(--cream-dark)',
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 300,
            color: 'var(--charcoal)',
            marginBottom: '0.75rem',
            lineHeight: 1.3,
          }}>
            {t('¿Necesitas graduación?', 'Need a prescription?')}
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            letterSpacing: '0.04em',
            color: 'var(--warm-gray)',
            lineHeight: 1.7,
          }}>
            {t(
              'Todos nuestros lentes de sol se pueden graduar. Al configurar tu armazón te pedimos tu receta.',
              'All our sunglasses can be made with prescription lenses. We\'ll ask for your Rx during checkout.'
            )}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}