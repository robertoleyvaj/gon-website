'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useLang } from '../../components/LanguageContext';
import { supabase } from '../../supabase';

type Armazon = {
  id: number;
  nombre: string;
  forma: string;
  genero: string;
  stock: number;
  badge: string | null;
  precio: number;
  color: string;
  imagen_url?: string;
};

const visionOpts = [
  { id: 'mono', nombre: 'Monofocal', desc_es: 'Para ver de lejos o cerca.', desc_en: 'For distance or near vision.', precio: 5 },
  { id: 'bi', nombre: 'Bifocal', desc_es: 'Con línea, para lejos y cerca.', desc_en: 'With line, for far and near.', precio: 13 },
  { id: 'prog', nombre: 'Progresivo', desc_es: 'Sin línea, todas las distancias.', desc_en: 'No line, all distances.', precio: 48 },
];

const materialOpts = [
  { id: 'cr39', nombre: 'CR-39', desc_es: 'Económico y ligero.', desc_en: 'Affordable and light.', precio: 0 },
  { id: 'poly', nombre: 'PolyPlus', desc_es: 'Más resistente para uso diario.', desc_en: 'More resistant for daily use.', precio: 29 },
  { id: 'hd', nombre: 'HD Vision', desc_es: 'Más claro y delgado.', desc_en: 'Clearer and thinner.', precio: 39 },
  { id: 'hi', nombre: 'Hi-Index 1.67', desc_es: 'Para graduaciones altas.', desc_en: 'For high prescriptions.', precio: 59 },
  { id: 'shi', nombre: 'Súper Hi-Index 1.74', desc_es: 'El más delgado y estético.', desc_en: 'The thinnest and most aesthetic.', precio: 89 },
];

const filtroOpts = [
  { id: 'ar', nombre: 'AR Normal', desc_es: 'Antirreflejante estándar.', desc_en: 'Standard anti-reflective.', precio: 9 },
  { id: 'blue', nombre: 'Blue Light', desc_es: 'Protección contra pantallas.', desc_en: 'Screen protection.', precio: 17 },
  { id: 'foto', nombre: 'Fotocromático', desc_es: 'Se oscurece con el sol.', desc_en: 'Darkens in sunlight.', precio: 39 },
  { id: 'anti', nombre: 'Antiempañante', desc_es: 'Evita que se empañen.', desc_en: 'Anti-fog coating.', precio: 15 },
  { id: 'arprem', nombre: 'AR Premium', desc_es: 'Ideal para manejar de noche.', desc_en: 'Ideal for night driving.', precio: 39 },
  { id: 'pol', nombre: 'Polarizado', desc_es: 'Ideal para exteriores.', desc_en: 'Ideal for outdoors.', precio: 89 },
  { id: 'tinte', nombre: 'Tinte estético', desc_es: 'Color gris, café, etc.', desc_en: 'Gray, brown tint, etc.', precio: 28 },
];

function LenteSVG({ color, forma, size = 'large' }: { color: string; forma: string; size?: string }) {
  const rx = forma === 'ovalada' ? '30' : forma === 'rectangular' ? '8' : '14';
  const w = size === 'large' ? 320 : 100;
  const h = size === 'large' ? 180 : 56;
  return (
    <svg width={w} height={h} viewBox="0 0 160 90" fill="none">
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

function VerlyTip({ mensaje }: { mensaje: string }) {
  if (!mensaje) return null;
  return (
    <div style={{
      background: '#E0F7F4', border: '1px solid #2BBFB3',
      borderRadius: '12px', padding: '0.9rem 1rem',
      marginBottom: '1.25rem',
      display: 'flex', gap: '10px', alignItems: 'flex-start',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: '#2BBFB3', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 800, flexShrink: 0,
      }}>V</div>
      <p style={{ fontSize: '13px', color: '#1A5C58', lineHeight: 1.6, margin: 0 }}>{mensaje}</p>
    </div>
  );
}

export default function DetalleArmazon() {
  const { id } = useParams();
  const { t } = useLang();
  const [armazon, setArmazon] = useState<Armazon | null>(null);
  const [relacionados, setRelacionados] = useState<Armazon[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Receta
  const [recetaMode, setRecetaMode] = useState<'manual' | 'foto'>('manual');
  const [fotoReceta, setFotoReceta] = useState('');
  const [receta, setReceta] = useState({
    od: { sph: '', cyl: '', axis: '', add: '', dp: '' },
    oi: { sph: '', cyl: '', axis: '', add: '', dp: '' },
    notas: '',
  });

  // Configurador
  const [paso, setPaso] = useState(1);
  const [vision, setVision] = useState('');
  const [material, setMaterial] = useState('');
  const [filtros, setFiltros] = useState<string[]>([]);
  const [loadingPago, setLoadingPago] = useState(false);

  const precioArmazon = armazon?.precio || 43;
  const precioVision = visionOpts.find(v => v.id === vision)?.precio || 0;
  const precioMaterial = materialOpts.find(m => m.id === material)?.precio || 0;
  const precioFiltros = filtroOpts.filter(f => filtros.includes(f.id)).reduce((a, f) => a + f.precio, 0);
  const total = precioArmazon + precioVision + precioMaterial + precioFiltros;

  const toggleFiltro = (fid: string) => {
    setFiltros(prev => prev.includes(fid) ? prev.filter(f => f !== fid) : [...prev, fid]);
  };

  // Graduación para tips de Verly (usa SPH del ojo derecho o izquierdo)
  const grad = Math.abs(parseFloat(receta.od.sph) || parseFloat(receta.oi.sph) || 0);

  const verlyTips: Record<number, string> = {
    1: grad > 0
      ? t(`Con SPH ${receta.od.sph || receta.oi.sph}, el Monofocal es ideal si solo necesitas corregir una distancia.`, `With SPH ${receta.od.sph || receta.oi.sph}, Monofocal is ideal if you only need one distance corrected.`)
      : t('Ingresa tu receta arriba para que te recomiende mejor. Si no la tienes, el Monofocal es el más común.', "Enter your prescription above for better tips. If you don't have it, Monofocal is most common."),
    2: grad === 0
      ? t('Ingresa tu SPH en la receta para que te recomiende el material ideal.', 'Enter your SPH in the prescription for material recommendations.')
      : grad <= 1.5
      ? t('Con tu graduación, el CR-39 es perfecto — económico y muy ligero.', 'With your prescription, CR-39 is perfect — affordable and very light.')
      : grad <= 3.0
      ? t('Con tu graduación te recomiendo PolyPlus — más resistente y delgado que el básico.', 'I recommend PolyPlus — more resistant and thinner than basic.')
      : grad <= 5.0
      ? t('Con tu graduación, el Hi-Index 1.67 hará tus lentes mucho más delgados y ligeros.', 'Hi-Index 1.67 will make your lenses much thinner and lighter.')
      : t('Con una graduación alta como la tuya, el Súper Hi-Index 1.74 es la mejor opción.', 'With a high prescription, Super Hi-Index 1.74 is the best option.'),
    3: t('Si trabajas en computadora agrega Blue Light. Si manejas de noche, AR Premium es excelente.', 'Add Blue Light if you work on screens. AR Premium is great for night driving.'),
    4: t('Todo listo. Revisa tu pedido y procede al pago seguro con Stripe.', 'All set. Review your order and proceed to secure payment with Stripe.'),
  };

  const handlePago = async () => {
    setLoadingPago(true);
    try {
      const v = visionOpts.find(x => x.id === vision)?.nombre || '';
      const m = materialOpts.find(x => x.id === material)?.nombre || '';
      const fs = filtroOpts.filter(f => filtros.includes(f.id)).map(f => f.nombre).join(', ');
      const items = `${armazon?.nombre} + ${v} + ${m}${fs ? ' + ' + fs : ''}`;
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert('Error al procesar el pago.'); setLoadingPago(false); }
    } catch { alert('Error al procesar el pago.'); setLoadingPago(false); }
  };

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('armazones').select('*').eq('id', id).single();
      if (data) {
        setArmazon(data);
        const { data: rel } = await supabase.from('armazones').select('*').eq('activo', true).eq('forma', data.forma).neq('id', id).limit(4);
        setRelacionados(rel || []);
      }
      setLoading(false);
    }
    cargar();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  if (loading) return (
    <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', background: '#FAFAFA', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '6rem', color: '#7A8494' }}>{t('Cargando...', 'Loading...')}</div>
    </main>
  );

  if (!armazon) return (
    <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', background: '#FAFAFA', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '6rem', color: '#7A8494' }}>
        {t('Armazón no encontrado.', 'Frame not found.')}
        <br/><a href="/Tienda" style={{ color: '#2BBFB3', fontWeight: 700 }}>{t('← Volver a la tienda', '← Back to store')}</a>
      </div>
    </main>
  );

  const pasos = [t('Visión', 'Vision'), t('Material', 'Material'), t('Filtros', 'Filters'), t('Resumen', 'Summary')];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px', borderRadius: '6px',
    border: '1.5px solid #EAECF0', fontSize: '13px',
    fontFamily: 'var(--font-jakarta), sans-serif',
    outline: 'none', boxSizing: 'border-box', textAlign: 'center',
  };

  return (
    <main style={{ fontFamily: 'var(--font-jakarta), sans-serif', background: '#FAFAFA', minHeight: '100vh', color: '#1A1A2E' }}>
      <Navbar />

      {/* OVERLAY */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 200, backdropFilter: 'blur(2px)',
        }}/>
      )}

      {/* DRAWER */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '480px', maxWidth: '100vw',
        background: 'white', zIndex: 201,
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>

        {/* Header drawer */}
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid #EAECF0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: 'white', zIndex: 1,
        }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#2BBFB3', margin: 0 }}>
              {t('Personalizando', 'Customizing')}
            </p>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0 0' }}>{armazon.nombre}</h3>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{
            background: '#F5F5F3', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer',
            fontSize: '20px', color: '#5A6478', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-jakarta), sans-serif',
          }}>×</button>
        </div>

        {/* RECETA */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EAECF0', background: '#FAFAFA' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#5A6478', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
            {t('TU RECETA ÓPTICA', 'YOUR PRESCRIPTION')}
          </label>

          {/* Toggle manual/foto */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            {(['manual', 'foto'] as const).map(mode => (
              <button key={mode} onClick={() => setRecetaMode(mode)} style={{
                flex: 1, padding: '8px', borderRadius: '6px', border: '1.5px solid',
                borderColor: recetaMode === mode ? '#2BBFB3' : '#EAECF0',
                background: recetaMode === mode ? '#E0F7F4' : 'white',
                color: recetaMode === mode ? '#2BBFB3' : '#5A6478',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-jakarta), sans-serif',
              }}>
                {mode === 'manual' ? t('Ingresar manual', 'Enter manually') : t('Subir foto', 'Upload photo')}
              </button>
            ))}
          </div>

          {recetaMode === 'foto' ? (
            <div>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed #C8D8E8', borderRadius: '10px', padding: '1.5rem',
                cursor: 'pointer', background: 'white', gap: '8px',
              }}>
                <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setFotoReceta(URL.createObjectURL(file));
                  }}
                />
                {fotoReceta ? (
                  <img src={fotoReceta} alt="receta" style={{ width: '100%', borderRadius: '8px', maxHeight: '160px', objectFit: 'contain' }}/>
                ) : (
                  <>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2BBFB3" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#5A6478' }}>
                      {t('Toca para subir foto de tu receta', 'Tap to upload your prescription photo')}
                    </span>
                    <span style={{ fontSize: '11px', color: '#7A8494' }}>JPG, PNG — máx 10MB</span>
                  </>
                )}
              </label>
              {fotoReceta && (
                <button onClick={() => setFotoReceta('')} style={{
                  marginTop: '8px', background: 'none', border: 'none',
                  color: '#E05A5A', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-jakarta), sans-serif',
                }}>
                  {t('Quitar foto', 'Remove photo')}
                </button>
              )}
            </div>
          ) : (
            <div>
              {(['od', 'oi'] as const).map(ojo => (
                <div key={ojo} style={{ marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                    textTransform: 'uppercase', color: '#1A1A2E',
                    marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{
                      background: ojo === 'od' ? '#E0F7F4' : '#FFF3E0',
                      color: ojo === 'od' ? '#2BBFB3' : '#E08A2A',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800,
                    }}>
                      {ojo === 'od' ? 'OD' : 'OI'}
                    </span>
                    {ojo === 'od' ? t('Ojo Derecho', 'Right Eye') : t('Ojo Izquierdo', 'Left Eye')}
                  </div>

                  {/* SPH CYL AXIS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                    {[
                      { key: 'sph', label: 'SPH', placeholder: '0.00', step: '0.25' },
                      { key: 'cyl', label: 'CYL', placeholder: '0.00', step: '0.25' },
                      { key: 'axis', label: 'EJE', placeholder: '0°', step: '1' },
                    ].map(campo => (
                      <div key={campo.key}>
                        <label style={{ fontSize: '10px', fontWeight: 700, color: '#7A8494', display: 'block', marginBottom: '3px' }}>
                          {campo.label}
                        </label>
                        <input
                          type="number"
                          step={campo.step}
                          placeholder={campo.placeholder}
                          value={receta[ojo][campo.key as 'sph' | 'cyl' | 'axis']}
                          onChange={e => setReceta(prev => ({
                            ...prev,
                            [ojo]: { ...prev[ojo], [campo.key]: e.target.value }
                          }))}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>

                  {/* ADD DP */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {[
                      { key: 'add', label: 'ADD', placeholder: '+0.00', step: '0.25' },
                      { key: 'dp', label: 'DP / DIP', placeholder: '63', step: '0.5' },
                    ].map(campo => (
                      <div key={campo.key}>
                        <label style={{ fontSize: '10px', fontWeight: 700, color: '#7A8494', display: 'block', marginBottom: '3px' }}>
                          {campo.label}
                        </label>
                        <input
                          type="number"
                          step={campo.step}
                          placeholder={campo.placeholder}
                          value={receta[ojo][campo.key as 'add' | 'dp']}
                          onChange={e => setReceta(prev => ({
                            ...prev,
                            [ojo]: { ...prev[ojo], [campo.key]: e.target.value }
                          }))}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Notas / Prisma */}
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#7A8494', display: 'block', marginBottom: '3px' }}>
                  {t('NOTAS / PRISMA / ESPECIFICACIONES', 'NOTES / PRISM / EXTRA')}
                </label>
                <textarea
                  placeholder={t('Ej: Prisma 1.0 base OUT, bifocal especial...', 'Ex: Prism 1.0 base OUT, special bifocal...')}
                  value={receta.notas}
                  onChange={e => setReceta(prev => ({ ...prev, notas: e.target.value }))}
                  rows={2}
                  style={{
                    width: '100%', padding: '8px', borderRadius: '6px',
                    border: '1.5px solid #EAECF0', fontSize: '12px', resize: 'none',
                    fontFamily: 'var(--font-jakarta), sans-serif',
                    outline: 'none', boxSizing: 'border-box', color: '#1A1A2E',
                  }}
                />
              </div>
            </div>
          )}

          <p style={{ fontSize: '11px', color: '#7A8494', margin: '8px 0 0' }}>
            {t('Verly usa tu SPH para recomendarte el material ideal.', 'Verly uses your SPH to recommend the ideal material.')}
          </p>
        </div>

        {/* STEPPER */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EAECF0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {pasos.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: paso > i + 1 ? '#2BBFB3' : 'white',
                    border: paso >= i + 1 ? '2px solid #2BBFB3' : '2px solid #EAECF0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '12px',
                    color: paso > i + 1 ? 'white' : paso === i + 1 ? '#2BBFB3' : '#7A8494',
                  }}>
                    {paso > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: paso >= i + 1 ? '#2BBFB3' : '#7A8494' }}>{p}</span>
                </div>
                {i < pasos.length - 1 && (
                  <div style={{ width: '40px', height: '2px', background: paso > i + 1 ? '#2BBFB3' : '#EAECF0', margin: '0 4px 16px' }}/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENIDO DEL PASO */}
        <div style={{ padding: '1.5rem', flex: 1 }}>

          <VerlyTip mensaje={verlyTips[paso] || ''} />

          {/* PASO 1: VISIÓN */}
          {paso === 1 && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{t('Tipo de visión', 'Vision type')}</h4>
              <p style={{ fontSize: '13px', color: '#7A8494', marginBottom: '1rem' }}>{t('¿Cómo ves?', 'How do you see?')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {visionOpts.map(o => (
                  <div key={o.id} onClick={() => setVision(o.id)} style={{
                    border: vision === o.id ? '2px solid #2BBFB3' : '1.5px solid #EAECF0',
                    borderRadius: '10px', padding: '0.9rem 1rem', cursor: 'pointer',
                    background: vision === o.id ? '#E0F7F4' : 'white', transition: 'all 0.15s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{o.nombre}</div>
                        <div style={{ fontSize: '12px', color: '#7A8494', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#2BBFB3' }}>+${o.precio}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: MATERIAL */}
          {paso === 2 && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{t('Material de la mica', 'Lens material')}</h4>
              <p style={{ fontSize: '13px', color: '#7A8494', marginBottom: '1rem' }}>{t('Afecta el grosor y peso.', 'Affects thickness and weight.')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {materialOpts.map(o => (
                  <div key={o.id} onClick={() => setMaterial(o.id)} style={{
                    border: material === o.id ? '2px solid #2BBFB3' : '1.5px solid #EAECF0',
                    borderRadius: '10px', padding: '0.9rem 1rem', cursor: 'pointer',
                    background: material === o.id ? '#E0F7F4' : 'white', transition: 'all 0.15s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{o.nombre}</div>
                        <div style={{ fontSize: '12px', color: '#7A8494', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#2BBFB3' }}>{o.precio === 0 ? t('Incluido', 'Included') : `+$${o.precio}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: FILTROS */}
          {paso === 3 && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{t('Filtros y protecciones', 'Filters & coatings')}</h4>
              <p style={{ fontSize: '13px', color: '#7A8494', marginBottom: '1rem' }}>{t('Opcionales. Puedes elegir varios.', 'Optional. You can choose multiple.')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {filtroOpts.map(o => (
                  <div key={o.id} onClick={() => toggleFiltro(o.id)} style={{
                    border: filtros.includes(o.id) ? '2px solid #2BBFB3' : '1.5px solid #EAECF0',
                    borderRadius: '10px', padding: '0.9rem 1rem', cursor: 'pointer',
                    background: filtros.includes(o.id) ? '#E0F7F4' : 'white', transition: 'all 0.15s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '4px',
                          border: '2px solid', borderColor: filtros.includes(o.id) ? '#2BBFB3' : '#EAECF0',
                          background: filtros.includes(o.id) ? '#2BBFB3' : 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                        }}>
                          {filtros.includes(o.id) ? '✓' : ''}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>{o.nombre}</div>
                          <div style={{ fontSize: '12px', color: '#7A8494' }}>{t(o.desc_es, o.desc_en)}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#2BBFB3' }}>+${o.precio}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 4: RESUMEN */}
          {paso === 4 && (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '1rem' }}>{t('Resumen de tu pedido', 'Order summary')}</h4>
              <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
                {[
                  { label: t('Armazón', 'Frame'), value: `$${precioArmazon}` },
                  { label: `${t('Visión', 'Vision')}: ${visionOpts.find(v => v.id === vision)?.nombre}`, value: `+$${precioVision}` },
                  { label: `${t('Material', 'Material')}: ${materialOpts.find(m => m.id === material)?.nombre}`, value: precioMaterial === 0 ? t('Incluido', 'Included') : `+$${precioMaterial}` },
                  ...filtroOpts.filter(f => filtros.includes(f.id)).map(f => ({ label: f.nombre, value: `+$${f.precio}` })),
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: '1px solid #EAECF0', fontSize: '13px',
                  }}>
                    <span style={{ color: '#5A6478' }}>{item.label}</span>
                    <span style={{ fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '18px', fontWeight: 800, color: '#2BBFB3' }}>
                  <span>TOTAL</span>
                  <span>${total} USD</span>
                </div>
              </div>
              <button onClick={handlePago} disabled={loadingPago} style={{
                width: '100%', background: loadingPago ? '#7A8494' : '#2BBFB3',
                color: 'white', border: 'none', borderRadius: '8px',
                padding: '15px', fontSize: '15px', fontWeight: 700,
                cursor: loadingPago ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-jakarta), sans-serif',
              }}>
                {loadingPago ? t('Procesando...', 'Processing...') : t('Pagar con tarjeta →', 'Pay with card →')}
              </button>
            </div>
          )}
        </div>

        {/* FOOTER DRAWER */}
        {paso < 4 && (
          <div style={{
            padding: '1.25rem 1.5rem', borderTop: '1px solid #EAECF0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'sticky', bottom: 0, background: 'white',
          }}>
            {paso > 1 ? (
              <button onClick={() => setPaso(p => p - 1)} style={{
                background: 'none', border: '1.5px solid #EAECF0',
                borderRadius: '6px', padding: '10px 20px',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                color: '#5A6478', fontFamily: 'var(--font-jakarta), sans-serif',
              }}>
                ← {t('Atrás', 'Back')}
              </button>
            ) : <div/>}
            <button
              onClick={() => {
                if (paso === 1 && !vision) return;
                if (paso === 2 && !material) return;
                setPaso(p => p + 1);
              }}
              style={{
                background: (paso === 1 && !vision) || (paso === 2 && !material) ? '#E2E8F0' : '#1A1A2E',
                color: (paso === 1 && !vision) || (paso === 2 && !material) ? '#7A8494' : 'white',
                border: 'none', borderRadius: '6px', padding: '10px 24px',
                fontSize: '13px', fontWeight: 700,
                cursor: (paso === 1 && !vision) || (paso === 2 && !material) ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-jakarta), sans-serif',
              }}
            >
              {paso === 3 ? t('Ver resumen →', 'See summary →') : t('Siguiente →', 'Next →')}
            </button>
          </div>
        )}
      </div>

      {/* BREADCRUMB */}
      <div style={{ background: 'white', borderBottom: '1px solid #EAECF0', padding: '0.85rem 2rem', fontSize: '13px', color: '#7A8494' }}>
        <a href="/" style={{ color: '#7A8494', textDecoration: 'none' }}>{t('Inicio', 'Home')}</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <a href="/Tienda" style={{ color: '#7A8494', textDecoration: 'none' }}>{t('Tienda', 'Store')}</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#1A1A2E', fontWeight: 600 }}>{armazon.nombre}</span>
      </div>

      {/* DETALLE PRINCIPAL */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start',
      }}>
        {/* IMAGEN */}
        <div style={{
          background: 'white', borderRadius: '16px', border: '1px solid #EAECF0',
          padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '360px', position: 'sticky', top: '90px',
        }}>
          {armazon.imagen_url
            ? <img src={armazon.imagen_url} alt={armazon.nombre} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}/>
            : <LenteSVG color={armazon.color || '#2BBFB3'} forma={armazon.forma} size="large"/>
          }
        </div>

        {/* INFO */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#F0FBF8', color: '#2BBFB3', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              {armazon.genero === 'hombre' ? t('Hombre', 'Men') : armazon.genero === 'mujer' ? t('Mujer', 'Women') : 'Unisex'}
            </span>
            {armazon.badge && (
              <span style={{ background: '#FFF8D6', color: '#9A7000', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                {armazon.badge}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
            {armazon.nombre}
          </h1>
          <p style={{ color: '#7A8494', fontSize: '14px', marginBottom: '1.5rem', textTransform: 'capitalize' }}>
            {t(`Forma ${armazon.forma}`, `${armazon.forma} frame`)}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '32px', fontWeight: 800 }}>${armazon.precio}</span>
            <span style={{ fontSize: '14px', color: '#7A8494' }}>USD</span>
          </div>
          <p style={{ fontSize: '13px', color: '#7A8494', marginBottom: '2rem' }}>
            {t('Armazón incluido · Micas desde +$5 USD', 'Frame included · Lenses from +$5 USD')}
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#7A8494', marginBottom: '0.75rem' }}>
              {t('Color', 'Color')}
            </p>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: armazon.color, border: '3px solid #2BBFB3', boxShadow: '0 0 0 2px white inset' }}/>
          </div>

          <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { es: 'Entrega 3–5 días a California', en: 'Delivery 3–5 days to California' },
              { es: '30 días de devolución gratis', en: '30-day free returns' },
              { es: 'Sin necesidad de aseguranza', en: 'No insurance needed' },
              { es: 'Micas personalizadas a tu graduación', en: 'Lenses customized to your prescription' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#5A6478' }}>
                <span style={{ color: '#2BBFB3', fontWeight: 800 }}>✓</span>
                {t(b.es, b.en)}
              </div>
            ))}
          </div>

          <button onClick={() => { setDrawerOpen(true); setPaso(1); }} style={{
            display: 'block', width: '100%', textAlign: 'center',
            background: '#1A1A2E', color: 'white',
            padding: '16px 32px', borderRadius: '8px',
            fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer',
            letterSpacing: '0.3px', marginBottom: '12px',
            fontFamily: 'var(--font-jakarta), sans-serif',
          }}>
            {t('Personalizar mis micas →', 'Customize my lenses →')}
          </button>
          <a href="/Tienda" style={{
            display: 'block', textAlign: 'center',
            background: 'transparent', color: '#5A6478',
            padding: '14px 32px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            border: '1.5px solid #EAECF0',
          }}>
            {t('← Ver más armazones', '← See more frames')}
          </a>
        </div>
      </div>

      {/* RELACIONADOS */}
      {relacionados.length > 0 && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 4rem' }}>
          <div style={{ borderTop: '1px solid #EAECF0', paddingTop: '3rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#2BBFB3', marginBottom: '0.5rem' }}>
              {t('También te puede gustar', 'You might also like')}
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {t('Estilos similares', 'Similar styles')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {relacionados.map(r => (
              <a key={r.id} href={`/armazon/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  background: 'white', borderRadius: '10px', border: '1px solid #EAECF0', overflow: 'hidden',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  }}
                >
                  <div style={{ height: '130px', background: '#F5F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {r.imagen_url
                      ? <img src={r.imagen_url} alt={r.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      : <LenteSVG color={r.color || '#2BBFB3'} forma={r.forma} size="small"/>
                    }
                  </div>
                  <div style={{ padding: '0.9rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{r.nombre}</div>
                    <div style={{ fontSize: '13px', color: '#7A8494' }}>${r.precio} USD</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}