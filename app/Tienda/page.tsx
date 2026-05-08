'use client';
import { useState, useEffect } from 'react';
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
      <rect x="4" y="12" width="64" height="66" rx={rx} fill="white" stroke={color} strokeWidth="4"/>
      <rect x="92" y="12" width="64" height="66" rx={rx} fill="white" stroke={color} strokeWidth="4"/>
      <path d="M68 38 C72 32, 88 32, 92 38" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <line x1="4" y1="36" x2="-6" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <line x1="156" y1="36" x2="166" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="26" cy="36" rx="10" ry="6" fill={color} opacity="0.08"/>
      <ellipse cx="114" cy="36" rx="10" ry="6" fill={color} opacity="0.08"/>
    </svg>
  );
}

export default function Tienda() {
  const { t } = useLang();
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('armazones')
        .select('*')
        .eq('activo', true)
        .order('id');
      setArmazones(data || []);
      setLoading(false);
    }
    cargar();
  }, []);

  const categorias = [
    { id: 'todos', es: 'Todos', en: 'All' },
    { id: 'hombre', es: 'Hombre', en: 'Men' },
    { id: 'mujer', es: 'Mujer', en: 'Women' },
    { id: 'unisex', es: 'Unisex', en: 'Unisex' },
  ];

  const filtrados = filtro === 'todos'
    ? armazones
    : armazones.filter(a => a.genero === filtro);

  const labelGenero = (g: string) =>
    g === 'hombre' ? t('Hombre', 'Men')
    : g === 'mujer' ? t('Mujer', 'Women')
    : 'Unisex';

  return (
    <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', background: '#FAFAFA', minHeight: '100vh', color: '#1A1A2E' }}>
      <Navbar />

      {/* HEADER */}
      <div style={{
        background: 'white', borderBottom: '1px solid #EAECF0',
        padding: '3rem 2rem 2rem', textAlign: 'center',
      }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
          textTransform: 'uppercase', color: '#2BBFB3', marginBottom: '0.5rem',
        }}>
          {t('Catálogo', 'Catalog')}
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem',
        }}>
          {t('Nuestros Armazones', 'Our Frames')}
        </h1>
        <p style={{ color: '#7A8494', fontSize: '15px' }}>
          {t('Elige el que más te guste y personaliza tus micas.', 'Choose your favorite and customize your lenses.')}
        </p>
      </div>

      {/* FILTROS */}
      <div style={{
        background: 'white', borderBottom: '1px solid #EAECF0',
        padding: '1rem 2rem',
        display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap',
      }}>
        {categorias.map(c => (
          <button key={c.id} onClick={() => setFiltro(c.id)} style={{
            padding: '8px 20px', borderRadius: '6px', border: '1.5px solid',
            borderColor: filtro === c.id ? '#2BBFB3' : '#EAECF0',
            background: filtro === c.id ? '#2BBFB3' : 'white',
            color: filtro === c.id ? 'white' : '#5A6478',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-jakarta), sans-serif',
          }}>
            {t(c.es, c.en)}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '3rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#7A8494' }}>
            {t('Cargando armazones...', 'Loading frames...')}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtrados.map(a => (
              <a key={a.id} href={`/armazon/${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  background: 'white', borderRadius: '12px',
                  border: '1px solid #EAECF0', overflow: 'hidden',
                  transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  }}
                >
                  {/* Imagen */}
                  <div style={{
                    height: '200px', background: '#F5F5F3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {a.imagen_url ? (
                      <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    ) : (
                      <LenteSVG color={a.color || '#2BBFB3'} forma={a.forma || 'cuadrada'}/>
                    )}
                    {/* Badge genero */}
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: 'white', color: '#5A6478',
                      padding: '4px 10px', borderRadius: '4px',
                      fontSize: '11px', fontWeight: 600, border: '1px solid #EAECF0',
                    }}>
                      {labelGenero(a.genero)}
                    </div>
                    {/* Badge especial (Nuevo, Popular, etc) */}
                    {a.badge && (
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: '#F5C518', color: '#1A1A2E',
                        padding: '4px 10px', borderRadius: '4px',
                        fontSize: '11px', fontWeight: 700,
                      }}>
                        {a.badge}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{a.nombre}</div>
                    <div style={{ fontSize: '13px', color: '#7A8494', marginBottom: '1rem', textTransform: 'capitalize' }}>
                      {t(`Forma ${a.forma}`, `${a.forma} frame`)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '20px', fontWeight: 800 }}>${a.precio}</span>
                        <span style={{ fontSize: '12px', color: '#7A8494', marginLeft: '4px' }}>USD</span>
                      </div>
                      <div style={{
                        background: '#1A1A2E', color: 'white',
                        padding: '10px 20px', borderRadius: '6px',
                        fontSize: '13px', fontWeight: 700,
                      }}>
                        {t('Ver más', 'View')}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* BANNER INFERIOR */}
      <div style={{
        background: '#F0FBF8', borderTop: '1px solid #D0F0EC',
        padding: '3rem 2rem', textAlign: 'center',
      }}>
        <p style={{ fontSize: '15px', color: '#5A6478', marginBottom: '0.5rem' }}>
          {t('¿No sabes cuál elegir?', "Can't decide?")}
        </p>
        <p style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.5rem' }}>
          {t('Verly te ayuda a encontrar el armazón perfecto.', 'Verly helps you find the perfect frame.')}
        </p>
        <p style={{ fontSize: '13px', color: '#7A8494' }}>
          {t('Abre el chat de Verly abajo a la derecha →', 'Open the Verly chat on the bottom right →')}
        </p>
      </div>

    </main>
  );
}