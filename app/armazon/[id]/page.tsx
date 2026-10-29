// app/armazon/[id]/page.tsx
'use client';
import { usePrecios, redondearMXN } from '../../hooks/usePrecios';
import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useLang } from '../../components/LanguageContext';
import { supabase } from '../../lib/supabase';
import { waGon, precioGon } from '../../lib/precio-gon';
import { PRECIOS_LISTA_DEFAULT, webVision, webMaterial, webFiltro, materialDisponible, type ListaPrecios } from '../../lib/precios-lentes';
import { fbTrack } from '../../lib/fpixel';
import { swatchColor as swatchLib, nombreColor } from '../../lib/colores';
import { nombreMaterial, nombreBadge } from '../../lib/textos';
import { FORMAS, normForma, tallaDeMedidas } from '../../lib/armazon-web';
import { useCart, generateCartId } from '../../context/CartContext';

type Armazon = {
  id: number; nombre: string; forma: string; genero: string;
  stock: number; badge: string | null; precio: number; precio_gon?: number; color: string;
  imagen_url?: string; imagen2_url?: string; imagen3_url?: string;
  imagen4_url?: string; imagen5_url?: string; tipo?: string;
  material?: string; medidas?: string; talla?: string; descuento?: number;
  color1?: string; color2?: string; color3?: string; modelo?: string; marca?: string; sku?: string;
};

type PaqueteGON = {
  precioArmazon: number;
  vision: { id: string; nombre: string; nombre_en: string; precio: number };
  material: { id: string; nombre: string; nombre_en: string; precio: number };
  filtroBase: { id: string; nombre: string; nombre_en: string; precio: number };
  precioOriginal: number; precioFinal: number; descuento: number;
  condicion: string; explicacion: string;
  upsells: { id: string; nombre: string; precio: number; razon: string }[];
};

type RecetaData = {
  sph_od: number | null; cyl_od: number | null; axis_od: number | null;
  sph_os: number | null; cyl_os: number | null; axis_os: number | null;
  add: number | null; dp: number | null; prisma: string;
};

type RecetaEstado = 'sin_receta' | 'manual' | 'foto' | 'despues' | 'sin_graduacion' | 'guardada';

const PRECIO_ARMAZON = 13; // USD fallback (solo cuando armazon.precio no está disponible)
const TURQUESA = '#2BBFB3';
const TURQUESA_DARK = '#1fa89f';

// Precios en MXN directamente (no USD)
const visionOpts = [
  { id: 'mono', nombre: 'Monofocal básico', nombre_en: 'Single Vision', desc_es: 'Para ver de lejos o cerca. Ideal para uso diario.', desc_en: 'For distance or near vision. Great for everyday use.', precio: 749 },
  { id: 'bi', nombre: 'Bifocal', nombre_en: 'Bifocal', desc_es: 'Para ver de lejos y cerca con línea visible.', desc_en: 'For distance and near vision with a visible line.', precio: 1149 },
  { id: 'prog', nombre: 'Progresivo', nombre_en: 'Progressive', desc_es: 'Visión para todas las distancias sin línea visible.', desc_en: 'All-distance vision without a visible line.', precio: 1899 },
];

const materialOpts = [
  { id: 'cr39', nombre: 'Essential', nombre_en: 'Essential', desc_es: 'Mica base incluida. Para graduaciones hasta ±2.00.', desc_en: 'Included base lens. For prescriptions up to ±2.00.', precio: 0 },
  { id: 'hd', nombre: 'Slim HD', nombre_en: 'Slim HD', desc_es: 'Hi-Index 1.60. Más delgado que Poly Plus. Para graduaciones medias.', desc_en: 'Hi-Index 1.60. Thinner than Poly Plus. For mid-range prescriptions.', precio: 397 },
  { id: 'poly', nombre: 'Poly Plus', nombre_en: 'Poly Plus', desc_es: 'Policarbonato 1.58. Muy resistente. Ideal para niños o uso activo.', desc_en: 'Polycarbonate 1.58. Highly resistant. Ideal for kids or active use.', precio: 997 },
  { id: 'hi', nombre: 'Ultra Slim', nombre_en: 'Ultra Slim', desc_es: 'Hi-Index 1.67. Significativamente más delgado y ligero.', desc_en: 'Hi-Index 1.67. Significantly thinner and lighter.', precio: 3197 },
  { id: 'shi', nombre: 'Ultra Slim Pro', nombre_en: 'Ultra Slim Pro', desc_es: 'Hi-Index 1.74. Nuestra opción más delgada para graduaciones altas.', desc_en: 'Hi-Index 1.74. Our thinnest option for high prescriptions.', precio: 4697 },
];

const filtroOpts = [
  { id: 'ar', nombre: 'Antirreflejo', nombre_en: 'Anti-Reflective', desc_es: 'Reduce reflejos. Mejor visión de noche y en pantallas.', desc_en: 'Reduces glare. Better vision at night and on screens.', precio: 279 },
  { id: 'blue', nombre: 'Blue Light', nombre_en: 'Blue Light', desc_es: 'Filtra la luz azul de pantallas. Ideal para uso intenso de celular o compu.', desc_en: 'Filters blue light from screens. Ideal for heavy screen users.', precio: 549 },
  { id: 'foto', nombre: 'Fotocromático', nombre_en: 'Photochromic', desc_es: 'Se oscurece en exterior y vuelve claro en interior.', desc_en: 'Darkens outdoors and returns clear indoors.', precio: 949 },
  { id: 'pol', nombre: 'Polarizado', nombre_en: 'Polarized', desc_es: 'Elimina reflejos intensos. Ideal para manejar o playa.', desc_en: 'Eliminates intense glare. Ideal for driving or beach.', precio: 1699 },
  { id: 'tinte', nombre: 'Tinte', nombre_en: 'Fashion Tint', desc_es: 'Agrega color a tus lentes. Disponible en varios tonos.', desc_en: 'Adds color to your lenses. Available in various shades.', precio: 549 },
];

const filtroOptsSolar = [
  { id: 'pol', nombre: 'Polarizado', nombre_en: 'Polarized', desc_es: 'Elimina reflejos intensos. El estándar para lentes de sol de calidad.', desc_en: 'Eliminates intense glare. The standard for quality sunglasses.', precio: 1699 },
  { id: 'foto', nombre: 'Fotocromático', nombre_en: 'Photochromic', desc_es: 'Se oscurece en exterior y aclara en interior automáticamente.', desc_en: 'Darkens outdoors and clears indoors automatically.', precio: 949 },
  { id: 'tinte', nombre: 'Tinte', nombre_en: 'Fashion Tint', desc_es: 'Elige el color de tus lentes para un look único.', desc_en: 'Choose your lens color for a unique look.', precio: 549 },
  { id: 'ar', nombre: 'Antirreflejo', nombre_en: 'Anti-Reflective', desc_es: 'Reduce reflejos internos para mayor claridad.', desc_en: 'Reduces internal reflections for better clarity.', precio: 279 },
];

const COLORES_FOTO = [
  { id: 'gris', nombre_es: 'Gris', nombre_en: 'Gray', hex: '#6B7280' },
  { id: 'cafe', nombre_es: 'Café', nombre_en: 'Brown', hex: '#92400E' },
  { id: 'rosa', nombre_es: 'Rosa', nombre_en: 'Pink', hex: '#EC4899' },
  { id: 'azul', nombre_es: 'Azul', nombre_en: 'Blue', hex: '#3B82F6' },
  { id: 'morado', nombre_es: 'Morado', nombre_en: 'Purple', hex: '#8B5CF6' },
  { id: 'amarillo', nombre_es: 'Amarillo', nombre_en: 'Yellow', hex: '#F59E0B' },
];

const COLORES_POLARIZADO = [
  { id: 'negro', nombre_es: 'Negro', nombre_en: 'Black', hex: '#1A1A2E' },
  { id: 'cafe', nombre_es: 'Café', nombre_en: 'Brown', hex: '#92400E' },
];

const COLORES_TINTE = [
  { id: 'negro', nombre_es: 'Negro', nombre_en: 'Black', hex: '#1A1A2E' },
  { id: 'cafe', nombre_es: 'Café', nombre_en: 'Brown', hex: '#92400E' },
  { id: 'gris', nombre_es: 'Gris', nombre_en: 'Gray', hex: '#6B7280' },
  { id: 'azul', nombre_es: 'Azul', nombre_en: 'Blue', hex: '#3B82F6' },
  { id: 'morado', nombre_es: 'Morado', nombre_en: 'Purple', hex: '#8B5CF6' },
  { id: 'rosa', nombre_es: 'Rosa', nombre_en: 'Pink', hex: '#EC4899' },
  { id: 'verde', nombre_es: 'Verde', nombre_en: 'Green', hex: '#4A7C59' },
  { id: 'ambar', nombre_es: 'Ámbar', nombre_en: 'Amber', hex: '#D97706' },
];

function getColoresDisponibles(visionId: string, materialId: string) {
  const soloGris = [{ id: 'gris', nombre_es: 'Gris', nombre_en: 'Gray', hex: '#6B7280' }];
  if (visionId === 'bi') return soloGris;
  if (visionId === 'mono') {
    if (materialId === 'cr39' || materialId === 'hd' || materialId === 'hi') return COLORES_FOTO;
    return soloGris;
  }
  if (visionId === 'prog') {
    if (materialId === 'cr39' || materialId === 'hd' || materialId === 'hi')
      return COLORES_FOTO.filter(c => c.id === 'gris' || c.id === 'cafe');
    return soloGris;
  }
  return soloGris;
}

function range(min: number, max: number, step: number): number[] {
  const result: number[] = [];
  for (let v = min; v <= max + 0.001; v += step) result.push(parseFloat(v.toFixed(2)));
  return result;
}

const SPH_OPTS = range(-20, 20, 0.25);
const CYL_OPTS = range(-8, 8, 0.25);
const AXIS_OPTS = range(1, 180, 1);
const ADD_OPTS = range(0.75, 3.50, 0.25);
const DP_OPTS = range(35, 79, 0.5);

// ── CeldaReceta ──────────────────────────────────────────
function CeldaReceta({ value, onChange, options, disabled, unit }: {
  value: number | null; onChange: (v: number | null) => void;
  options: number[]; disabled?: boolean; unit?: 'axis' | 'dp' | 'add' | 'sph' | 'cyl';
}) {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [abreArriba, setAbreArriba] = useState(false);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAbreArriba(window.innerHeight - rect.bottom < 260);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setBusqueda(''); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (!busqueda) {
          const el = listRef.current?.querySelector(`[data-val="${value ?? 0}"]`) as HTMLElement;
          if (el) el.scrollIntoView({ block: 'center' });
        }
      }, 60);
    } else setBusqueda('');
  }, [open]);

  const formatVal = (v: number) => {
    if (unit === 'axis') return `${v}°`;
    if (unit === 'dp') return v.toFixed(1);
    return (v >= 0 ? '+' : '') + v.toFixed(2);
  };

  const opcionesFiltradas = busqueda.trim()
    ? (() => {
        const num = parseFloat(busqueda.replace(',', '.'));
        if (isNaN(num)) return options.filter(o => formatVal(o).includes(busqueda));
        return [...options].sort((a, b) => Math.abs(a - num) - Math.abs(b - num)).slice(0, 15);
      })()
    : options;

  const usarGrid = unit === 'add' || unit === 'dp';
  const isEmpty = value === null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        style={{
          width: '100%', padding: '8px 4px',
          background: disabled ? 'var(--cream)' : open ? 'rgba(74,89,64,0.07)' : isEmpty ? 'var(--cream)' : 'white',
          border: `1.5px solid ${disabled ? 'var(--border)' : open ? 'var(--sage)' : isEmpty ? 'var(--border)' : 'var(--sage)'}`,
          borderRadius: '4px', cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-sans)', transition: 'all 0.15s', textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.3px', color: disabled ? 'var(--border)' : isEmpty ? 'var(--warm-gray)' : value === 0 ? 'var(--warm-gray)' : 'var(--charcoal)' }}>
          {disabled ? '—' : isEmpty ? '—' : formatVal(value!)}
        </span>
      </button>
      {open && !disabled && (
        <div style={{ position: 'absolute', ...(abreArriba ? { bottom: 'calc(100% + 4px)', top: 'auto' } : { top: 'calc(100% + 4px)', bottom: 'auto' }), left: '50%', transform: 'translateX(-50%)', width: usarGrid ? '200px' : '130px', background: 'white', borderRadius: '6px', zIndex: 500, boxShadow: '0 8px 32px rgba(28,28,26,0.10)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '6px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
            <input ref={inputRef} type="text" placeholder={unit === 'axis' ? 'Ej: 90' : unit === 'dp' ? 'Ej: 63' : 'Ej: -1.25'} value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '3px', border: '1px solid var(--border)', fontSize: '12px', outline: 'none', boxSizing: 'border-box', textAlign: 'center', background: 'white', fontFamily: 'var(--font-sans)' }}/>
          </div>
          <div onClick={() => { onChange(null); setOpen(false); }} style={{ padding: '7px', cursor: 'pointer', fontSize: '13px', color: 'var(--warm-gray)', fontWeight: 500, textAlign: 'center', borderBottom: '1px solid var(--border)', background: isEmpty ? 'var(--cream-dark)' : 'white' }}>—</div>
          {usarGrid ? (
            <div ref={listRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', padding: '6px', maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div key={opt} data-val={opt} onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }} style={{ padding: '8px 4px', cursor: 'pointer', textAlign: 'center', fontSize: '12px', fontWeight: value === opt ? 700 : 400, color: value === opt ? 'white' : 'var(--charcoal)', background: value === opt ? 'var(--sage)' : 'var(--cream)', borderRadius: '3px', transition: 'all 0.1s' }}>{formatVal(opt)}</div>
              ))}
            </div>
          ) : (
            <div ref={listRef} style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {opcionesFiltradas.map(opt => (
                <div key={opt} data-val={opt} onClick={() => { onChange(opt); setOpen(false); setBusqueda(''); }} style={{ padding: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '13px', fontWeight: value === opt ? 700 : 400, color: value === opt ? 'var(--sage)' : 'var(--charcoal)', background: value === opt ? 'rgba(74,89,64,0.07)' : 'white', borderBottom: '1px solid var(--cream)', transition: 'background 0.1s' }}>{formatVal(opt)}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── FormReceta ───────────────────────────────────────────
function FormReceta({ receta, onChange, errores, t }: { receta: RecetaData; onChange: (r: RecetaData) => void; errores: string[]; t: (es: string, en: string) => string; }) {
  const cylOdActivo = receta.cyl_od !== null && receta.cyl_od !== 0;
  const cylOsActivo = receta.cyl_os !== null && receta.cyl_os !== 0;
  return (
    <div style={{ background: 'white', borderRadius: '6px', border: '1px solid var(--border)', overflow: 'visible' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', overflow: 'visible' }}>
        <thead>
          <tr style={{ background: 'var(--cream)' }}>
            <th style={{ padding: '10px 8px', width: '52px', borderBottom: '1px solid var(--border)' }}></th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>SPH *</th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>CYL</th>
            <th style={{ padding: '10px 4px', fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>{t('EJE', 'AXIS')}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--cream)' }}>
            <td style={{ padding: '8px', textAlign: 'center' }}>
              <span style={{ background: 'var(--sage)', color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>OD</span>
              <span style={{ fontSize: '9px', color: 'var(--warm-gray)' }}>{t('Der.', 'Right')}</span>
            </td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.sph_od} onChange={v => onChange({ ...receta, sph_od: v })} options={SPH_OPTS} unit="sph"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.cyl_od} onChange={v => onChange({ ...receta, cyl_od: v, axis_od: (!v || v === 0) ? null : receta.axis_od })} options={CYL_OPTS} unit="cyl"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={cylOdActivo ? receta.axis_od : null} onChange={v => onChange({ ...receta, axis_od: v })} options={AXIS_OPTS} disabled={!cylOdActivo} unit="axis"/></td>
          </tr>
          <tr>
            <td style={{ padding: '8px', textAlign: 'center' }}>
              <span style={{ background: 'var(--sage-light)', color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>OS</span>
              <span style={{ fontSize: '9px', color: 'var(--warm-gray)' }}>{t('Izq.', 'Left')}</span>
            </td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.sph_os} onChange={v => onChange({ ...receta, sph_os: v })} options={SPH_OPTS} unit="sph"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={receta.cyl_os} onChange={v => onChange({ ...receta, cyl_os: v, axis_os: (!v || v === 0) ? null : receta.axis_os })} options={CYL_OPTS} unit="cyl"/></td>
            <td style={{ padding: '6px 4px' }}><CeldaReceta value={cylOsActivo ? receta.axis_os : null} onChange={v => onChange({ ...receta, axis_os: v })} options={AXIS_OPTS} disabled={!cylOsActivo} unit="axis"/></td>
          </tr>
        </tbody>
      </table>
      <div style={{ padding: '10px 8px', background: 'var(--cream)', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>ADD <span style={{ fontWeight: 400, fontSize: '9px' }}>({t('ambos ojos', 'both eyes')})</span></div>
          <CeldaReceta value={receta.add} onChange={v => onChange({ ...receta, add: v })} options={ADD_OPTS} unit="add"/>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.5px', textAlign: 'center', marginBottom: '5px' }}>DP / PD <span style={{ fontWeight: 400, fontSize: '9px' }}>({t('total', 'total')})</span></div>
          <CeldaReceta value={receta.dp} onChange={v => onChange({ ...receta, dp: v })} options={DP_OPTS} unit="dp"/>
        </div>
      </div>
      <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>{t('Prisma / Notas', 'Prism / Notes')}</div>
        <input type="text" placeholder={t('Ej: 1.0 base OUT OD', 'Ex: 1.0 base OUT OD')} value={receta.prisma} onChange={e => onChange({ ...receta, prisma: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--charcoal)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }} onFocus={e => (e.currentTarget.style.borderColor = 'var(--sage)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}/>
      </div>
      {errores.length > 0 && (
        <div style={{ padding: '8px 10px', borderTop: '1px solid #ffe0e0', background: '#fff5f5' }}>
          {errores.map((e, i) => <div key={i} style={{ fontSize: '12px', color: '#c0392b', fontWeight: 500, marginBottom: i < errores.length - 1 ? '3px' : 0 }}>⚠ {e}</div>)}
        </div>
      )}
    </div>
  );
}

function calcularPaquete(r: RecetaData, lang: 'es' | 'en', L: ListaPrecios, precioArmazon: number): PaqueteGON {
  const sph_od = r.sph_od ?? 0, sph_os = r.sph_os ?? 0;
  const cyl_od = r.cyl_od ?? 0, cyl_os = r.cyl_os ?? 0;
  const add = r.add ?? 0;
  const eq = Math.max(Math.abs(sph_od + cyl_od / 2), Math.abs(sph_os + cyl_os / 2));
  const cyl = Math.max(Math.abs(cyl_od), Math.abs(cyl_os));
  const astigmatismo = cyl >= 0.75;
  let vision = visionOpts[0];
  if (add > 0) vision = visionOpts[2];
  let material = materialOpts[0]; // Essential por defecto
  if (eq > 4.0) material = materialOpts[4]; // Ultra Slim Pro
  else if (eq > 2.0) material = materialOpts[3]; // Ultra Slim
  else if (eq > 1.5) material = materialOpts[1]; // Slim HD para graduaciones medias
  const filtroBase = filtroOpts[0]; // Antirreflejo base
  let condicion = '', explicacion = '';
  if (add > 0) { condicion = lang === 'es' ? 'Presbicia' : 'Presbyopia'; explicacion = lang === 'es' ? `Tienes adición (ADD +${add.toFixed(2)}), indicando presbicia.` : `You have presbyopia. Progressive lenses correct all distances.`; }
  else if (cyl >= 1.50) { condicion = lang === 'es' ? 'Astigmatismo alto' : 'High astigmatism'; explicacion = lang === 'es' ? 'Astigmatismo alto detectado. El Antirreflejo ayuda a reducir reflejos.' : 'High astigmatism detected. Anti-Reflective helps reduce glare.'; }
  else if (astigmatismo) { condicion = lang === 'es' ? 'Astigmatismo' : 'Astigmatism'; explicacion = lang === 'es' ? 'Tienes astigmatismo. El Antirreflejo mejora la comodidad visual.' : 'You have astigmatism. Anti-Reflective improves visual comfort.'; }
  else if (eq > 4.0) { condicion = lang === 'es' ? 'Graduación muy alta' : 'Very high prescription'; explicacion = lang === 'es' ? 'El Ultra Slim Pro hará tus lentes delgados y elegantes.' : 'Ultra Slim Pro makes your lenses thin and elegant.'; }
  else if (eq > 2.0) { condicion = lang === 'es' ? 'Graduación alta' : 'High prescription'; explicacion = lang === 'es' ? 'El Ultra Slim reducirá el grosor hasta un 30%.' : 'Ultra Slim will reduce lens thickness by up to 30%.'; }
  else { condicion = lang === 'es' ? 'Graduación moderada' : 'Moderate prescription'; explicacion = lang === 'es' ? 'Poly Plus es resistente y el Fotocromático te da comodidad en exteriores.' : 'Poly Plus is strong and Photochromic gives indoor/outdoor comfort.'; }
  // Precios web reales (los mismos del configurador y del cobro); sin descuento inventado
  if (!materialDisponible(L, vision.id, material.id)) material = materialOpts[3];
  const v = { ...vision, precio: webVision(L, vision.id) };
  const m = { ...material, precio: webMaterial(L, vision.id, material.id) };
  const f = { ...filtroBase, precio: webFiltro(L, filtroBase.id) };
  const precioOriginal = precioArmazon + v.precio + m.precio + f.precio;
  const descuento = 0;
  const precioFinal = precioOriginal;
  const upsells: { id: string; nombre: string; precio: number; razon: string }[] = [];
  upsells.push({ id: 'foto', nombre: 'Fotocromático', precio: webFiltro(L, 'foto'), razon: lang === 'es' ? 'Se oscurece en exterior automáticamente' : 'Automatically darkens outdoors' });
  upsells.push({ id: 'blue', nombre: 'Blue Light', precio: webFiltro(L, 'blue'), razon: lang === 'es' ? 'Para uso diario de pantallas' : 'For daily screen use' });
  return { vision: v, material: m, filtroBase: f, precioOriginal, precioFinal, descuento, condicion, explicacion, upsells, precioArmazon };
}

function LensZoneSVG({ tipo }: { tipo: 'mono' | 'bi' | 'prog' }) {
  const W = 64, H = 44;
  // Lens shape: use an ellipse-like rounded rect, wider than tall like a real lens
  const id = `lz-${tipo}`;
  const clip = `url(#${id}-clip)`;
  const lensPath = `M 14 2 Q 2 2 2 12 L 2 ${H-12} Q 2 ${H-2} 14 ${H-2} L ${W-14} ${H-2} Q ${W-2} ${H-2} ${W-2} ${H-12} L ${W-2} 12 Q ${W-2} 2 ${W-14} 2 Z`;

  if (tipo === 'mono') return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0 }}>
      <defs>
        <clipPath id={`${id}-clip`}><path d={lensPath}/></clipPath>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(85,98,76,0.07)"/>
          <stop offset="100%" stopColor="rgba(85,98,76,0.18)"/>
        </linearGradient>
      </defs>
      <path d={lensPath} fill={`url(#${id}-g)`} clipPath={clip}/>
      <path d={lensPath} fill="none" stroke="#55624c" strokeWidth="1.5" opacity="0.7"/>
      {/* Dot in center indicating uniform zone */}
      <circle cx={W/2} cy={H/2} r="3" fill="#55624c" opacity="0.35"/>
    </svg>
  );

  if (tipo === 'bi') {
    const lineY = Math.round(H * 0.62);
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0 }}>
        <defs>
          <clipPath id={`${id}-clip`}><path d={lensPath}/></clipPath>
        </defs>
        {/* Top zone — far vision */}
        <path d={lensPath} fill="rgba(85,98,76,0.08)" clipPath={clip}/>
        {/* Bottom zone — near vision */}
        <rect x="0" y={lineY} width={W} height={H} fill="rgba(85,98,76,0.32)" clipPath={clip}/>
        {/* Dividing line */}
        <line x1="4" y1={lineY} x2={W-4} y2={lineY} stroke="#55624c" strokeWidth="1.2" opacity="0.8"/>
        {/* Lens border */}
        <path d={lensPath} fill="none" stroke="#55624c" strokeWidth="1.5" opacity="0.7"/>
        {/* Zone dots */}
        <circle cx={W/2} cy={lineY/2} r="2.5" fill="#55624c" opacity="0.25"/>
        <circle cx={W/2} cy={lineY + (H-lineY)/2} r="2.5" fill="#55624c" opacity="0.6"/>
      </svg>
    );
  }

  // Progresivo — smooth gradient with 3 zone indicators
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0 }}>
      <defs>
        <clipPath id={`${id}-clip`}><path d={lensPath}/></clipPath>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(85,98,76,0.06)"/>
          <stop offset="45%"  stopColor="rgba(85,98,76,0.20)"/>
          <stop offset="100%" stopColor="rgba(85,98,76,0.48)"/>
        </linearGradient>
      </defs>
      <path d={lensPath} fill={`url(#${id}-g)`} clipPath={clip}/>
      <path d={lensPath} fill="none" stroke="#55624c" strokeWidth="1.5" opacity="0.7"/>
      {/* Three zone dots */}
      <circle cx={W/2} cy={10} r="2" fill="#55624c" opacity="0.22"/>
      <circle cx={W/2} cy={H/2} r="2.2" fill="#55624c" opacity="0.42"/>
      <circle cx={W/2} cy={H-10} r="2.5" fill="#55624c" opacity="0.7"/>
    </svg>
  );
}

function LenteSVG({ color, forma, size = 'large', solar = false }: { color: string; forma: string; size?: string; solar?: boolean }) {
  const rx = forma === 'ovalada' ? '30' : forma === 'rectangular' ? '8' : '14';
  const w = size === 'large' ? 280 : 90; const h = size === 'large' ? 160 : 50;
  return (
    <svg width={w} height={h} viewBox="0 0 160 90" fill="none">
      <rect x="4" y="12" width="64" height="66" rx={rx} fill={solar ? color : 'white'} fillOpacity={solar ? 0.15 : 1} stroke={color} strokeWidth="3.5"/>
      <rect x="92" y="12" width="64" height="66" rx={rx} fill={solar ? color : 'white'} fillOpacity={solar ? 0.15 : 1} stroke={color} strokeWidth="3.5"/>
      <path d="M68 38 C72 32, 88 32, 92 38" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="4" y1="36" x2="-6" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="156" y1="36" x2="166" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── GONModalPaquete ─────────────────────────────────────
function GONModalPaquete({ paquete, armazonNombre, onAceptar, onManual, lang, tipoCambio }: {
  paquete: PaqueteGON; armazonNombre: string;
  onAceptar: (extrasIds: string[]) => void; onManual: () => void; lang: 'es' | 'en'; tipoCambio: number;
}) {
  const [paso, setPaso] = useState<'paquete' | 'upsell'>('paquete');
  const [extras, setExtras] = useState<string[]>([]);
  const toggleExtra = (id: string) => setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  const precioExtras = extras.reduce((sum, id) => sum + (paquete.upsells.find(u => u.id === id)?.precio || 0), 0);
  // Lens prices are now in MXN directly
  const pxMXN = (mxn: number) => lang === 'es' ? `$${mxn.toLocaleString('es-MX')} MXN` : `$${Math.round(mxn / tipoCambio)} USD`;
  const pxPlusMXN = (mxn: number) => lang === 'es' ? `+$${mxn.toLocaleString('es-MX')} MXN` : `+$${Math.round(mxn / tipoCambio)} USD`;
  // Frame price stays in USD from DB
  const pxArmazon = (usd: number) => lang === 'es' ? `$${redondearMXN(usd, tipoCambio)} MXN` : `$${usd} USD`;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(28,28,26,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(28,28,26,0.18)', overflow: 'hidden', animation: 'slideUp 0.3s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>
        {paso === 'paquete' ? (
          <>
            <div style={{ background: 'var(--charcoal)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '0.5rem' }}>{lang === 'es' ? 'GON recomienda' : 'GON recommends'}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'white', lineHeight: 1.2 }}>{lang === 'es' ? 'El paquete perfecto para ti' : 'The perfect package for you'}</div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ background: 'var(--cream)', borderRadius: '6px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '13px', color: 'var(--charcoal)', lineHeight: 1.6 }}>{paquete.explicacion}</div>
              <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--cream-dark)', padding: '0.65rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)' }}>{lang === 'es' ? `Paquete ${paquete.condicion}` : `${paquete.condicion} Package`}</span>
                  {paquete.descuento > 0 && <span style={{ background: 'var(--sage)', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>−{pxMXN(paquete.descuento)}</span>}
                </div>
                <div style={{ padding: '0.75rem 1rem' }}>
                  {[
                    { label: armazonNombre, valor: pxMXN(paquete.precioArmazon) },
                    { label: lang === 'es' ? paquete.vision.nombre : paquete.vision.nombre_en, valor: pxPlusMXN(paquete.vision.precio) },
                    { label: lang === 'es' ? paquete.material.nombre : paquete.material.nombre_en, valor: paquete.material.precio === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : pxPlusMXN(paquete.material.precio) },
                    { label: lang === 'es' ? paquete.filtroBase.nombre : paquete.filtroBase.nombre_en, valor: pxPlusMXN(paquete.filtroBase.precio) },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--cream)' : 'none' }}>
                      <span style={{ color: 'var(--warm-gray)' }}>{item.label}</span><span style={{ fontWeight: 500 }}>{item.valor}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1rem', background: 'var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {paquete.descuento > 0 && <div style={{ fontSize: '11px', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>{pxMXN(paquete.precioOriginal)}</div>}
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--sage)' }}>{pxMXN(paquete.precioFinal)}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--warm-gray)' }}>{lang === 'es' ? 'Precio web' : 'Online price'}</div>
                </div>
              </div>
              {/* DRAWER ACTION → TURQUESA */}
              <button onClick={() => setPaso('upsell')} style={{ width: '100%', background: TURQUESA, color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-sans)', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = TURQUESA_DARK)} onMouseLeave={e => (e.currentTarget.style.background = TURQUESA)}>
                {lang === 'es' ? 'Sí, quiero este paquete →' : 'Yes, I want this package →'}
              </button>
              <button onClick={onManual} style={{ width: '100%', background: 'white', color: 'var(--warm-gray)', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {lang === 'es' ? 'Prefiero elegir manualmente' : 'I prefer to choose manually'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: 'var(--cream-dark)', padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)' }}>{lang === 'es' ? '¿Le añadimos algo más?' : 'Shall we add anything else?'}</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--warm-gray)', marginTop: '4px' }}>{lang === 'es' ? 'Opcional' : 'Optional'}</div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {paquete.upsells.map(u => (
                <div key={u.id} onClick={() => toggleExtra(u.id)} style={{ border: extras.includes(u.id) ? `1.5px solid var(--sage)` : '1px solid var(--border)', borderRadius: '6px', padding: '1rem', cursor: 'pointer', background: extras.includes(u.id) ? 'rgba(74,89,64,0.06)' : 'white', marginBottom: '0.75rem', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '3px', border: '1.5px solid', borderColor: extras.includes(u.id) ? 'var(--sage)' : 'var(--border)', background: extras.includes(u.id) ? 'var(--sage)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', flexShrink: 0 }}>{extras.includes(u.id) ? '✓' : ''}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{u.nombre}</div>
                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{u.razon}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--sage)', flexShrink: 0 }}>{pxPlusMXN(u.precio)}</div>
                </div>
              ))}
              <div style={{ background: 'var(--cream)', borderRadius: '6px', padding: '0.9rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--warm-gray)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--charcoal)' }}>{pxMXN(paquete.precioFinal + precioExtras)}</span>
              </div>
              {/* DRAWER ACTION → TURQUESA */}
              <button onClick={() => onAceptar(extras)} style={{ width: '100%', background: TURQUESA, color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-sans)', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = TURQUESA_DARK)} onMouseLeave={e => (e.currentTarget.style.background = TURQUESA)}>
                {lang === 'es' ? 'Ir al resumen →' : 'Go to summary →'}
              </button>
              <button onClick={() => onAceptar([])} style={{ width: '100%', background: 'white', color: 'var(--warm-gray)', border: '1px solid var(--border)', borderRadius: '6px', padding: '11px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {lang === 'es' ? 'No gracias, ir al resumen' : 'No thanks, go to summary'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── SelectorColores ──────────────────────────────────────
function SelectorColores({ colores, valorActivo, onChange, lang }: { colores: { id: string; nombre_es: string; nombre_en: string; hex: string }[]; valorActivo: string; onChange: (id: string) => void; lang: string; }) {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {colores.map(c => (
        <div key={c.id} onClick={() => onChange(c.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.hex, border: valorActivo === c.id ? '2.5px solid var(--charcoal)' : '2.5px solid transparent', outline: valorActivo === c.id ? '1.5px solid var(--sage)' : 'none', outlineOffset: '2px', boxShadow: '0 2px 6px rgba(28,28,26,0.12)', transition: 'all 0.15s' }}/>
          <span style={{ fontSize: '10px', fontWeight: valorActivo === c.id ? 600 : 400, color: valorActivo === c.id ? 'var(--charcoal)' : 'var(--warm-gray)' }}>{lang === 'es' ? c.nombre_es : c.nombre_en}</span>
        </div>
      ))}
    </div>
  );
}

// ── Acordeon ─────────────────────────────────────────────
function Acordeon({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 400, color: 'var(--charcoal)', textAlign: 'left', letterSpacing: '0.01em' }}>
        {titulo}
        <span style={{ fontSize: '20px', color: 'var(--warm-gray)', transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s', display: 'inline-block', lineHeight: 1 }}>+</span>
      </button>
      {open && <div style={{ paddingBottom: '1.25rem', fontSize: '13px', color: 'var(--warm-gray)', lineHeight: 1.8 }}>{children}</div>}
    </div>
  );
}

const SUCURSALES_WA = [
  { id: 'bajavision', nombre: 'Óptica Baja Visión', nombre_en: 'Óptica Baja Visión', dir: 'Blvd. Benito Juárez 79B' },
  { id: '5demayo',   nombre: 'Óptica Rosarito 5 de Mayo', nombre_en: 'Óptica Rosarito 5 de Mayo', dir: 'C. 5 de Mayo 200' },
  { id: 'laureles',  nombre: 'Óptica Rosarito Plaza Laureles', nombre_en: 'Óptica Rosarito Plaza Laureles', dir: 'Plaza Laureles, Morelos 118' },
];

function InicioDrawer({ esSolar, t, lang, onManual, onFoto, onDespues, onVolverSolar }: {
  esSolar: boolean; t: (es: string, en: string) => string; lang: string;
  onManual: () => void; onFoto: () => void; onDespues: () => void; onVolverSolar: () => void;
}) {
  const [expandido, setExpandido] = useState<'graduacion' | 'examen' | null>(null);
  const [sucursalSel, setSucursalSel] = useState<string | null>(null);

  const toggleGraduacion = () => setExpandido(prev => prev === 'graduacion' ? null : 'graduacion');
  const toggleExamen = () => { setExpandido(prev => prev === 'examen' ? null : 'examen'); setSucursalSel(null); };

  const sucursal = SUCURSALES_WA.find(s => s.id === sucursalSel);
  const msgWA = sucursal
    ? encodeURIComponent(`Hola, me interesa agendar un examen de la vista en ${lang === 'es' ? sucursal.nombre : sucursal.nombre_en}. ¿Qué horarios tienen disponibles?`)
    : '';

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '6px' }}>
          {t('¿Cómo quieres continuar?', 'How would you like to continue?')}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--warm-gray)' }}>
          {t('Elige la opción que mejor describe tu situación', 'Choose the option that best describes your situation')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* OPCIÓN 1: Ya tengo mi graduación */}
        <div style={{ border: `1px solid ${expandido === 'graduacion' ? 'var(--sage)' : 'var(--border)'}`, borderRadius: '8px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
          <button onClick={toggleGraduacion} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1.1rem 1.25rem', background: expandido === 'graduacion' ? 'rgba(27,47,94,0.04)' : 'var(--cream)', cursor: 'pointer', textAlign: 'left', width: '100%', border: 'none', fontFamily: 'var(--font-sans)' }}>
            <div style={{ color: 'var(--sage)', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)' }}>{t('Ya tengo mi graduación', 'I already have my prescription')}</div>
              <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{t('Ingrésala ahora para personalizar tus micas', 'Enter it now to customize your lenses')}</div>
            </div>
            <span style={{ color: 'var(--warm-gray)', fontSize: '18px', transform: expandido === 'graduacion' ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', display: 'inline-block' }}>›</span>
          </button>
          {expandido === 'graduacion' && (
            <div style={{ borderTop: '1px solid var(--border)', background: 'white', display: 'flex', flexDirection: 'column', gap: '6px', padding: '0.75rem' }}>
              <button onClick={onManual} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sage)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{t('Escribir manualmente', 'Enter manually')}</div>
                  <div style={{ fontSize: '11px', color: 'var(--warm-gray)' }}>SPH, CYL, {t('EJE', 'AXIS')}, ADD, PD</div>
                </div>
              </button>
              <button onClick={onFoto} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sage)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{t('Subir foto de mi receta', 'Upload prescription photo')}</div>
                  <div style={{ fontSize: '11px', color: 'var(--warm-gray)' }}>{t('Foto, PDF o captura de pantalla', 'Photo, PDF or screenshot')}</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* OPCIÓN 2: Quiero hacer mi examen */}
        <div style={{ border: `1px solid ${expandido === 'examen' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
          <button onClick={toggleExamen} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1.1rem 1.25rem', background: expandido === 'examen' ? 'rgba(45,191,184,0.05)' : 'var(--cream)', cursor: 'pointer', textAlign: 'left', width: '100%', border: 'none', fontFamily: 'var(--font-sans)' }}>
            <div style={{ color: 'var(--accent)', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)' }}>{t('Quiero hacer mi examen de la vista', "I'd like to get an eye exam")}</div>
              <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{t('Agenda en tu sucursal más cercana — sin costo', 'Schedule at your nearest location — free of charge')}</div>
            </div>
            <span style={{ color: 'var(--warm-gray)', fontSize: '18px', transform: expandido === 'examen' ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', display: 'inline-block' }}>›</span>
          </button>
          {expandido === 'examen' && (
            <div style={{ borderTop: '1px solid var(--border)', background: 'white', padding: '0.75rem' }}>
              <p style={{ fontSize: '11px', color: 'var(--warm-gray)', margin: '0 0 0.6rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{t('¿En qué sucursal?', 'Which location?')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '0.75rem' }}>
                {SUCURSALES_WA.map(s => (
                  <button key={s.id} onClick={() => setSucursalSel(s.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', borderRadius: '6px', border: `1px solid ${sucursalSel === s.id ? 'var(--accent)' : 'var(--border)'}`, background: sucursalSel === s.id ? 'rgba(45,191,184,0.06)' : 'var(--cream)', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'var(--font-sans)', transition: 'all 0.15s' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={sucursalSel === s.id ? 'var(--accent)' : 'var(--warm-gray-light)'} strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--charcoal)' }}>{lang === 'es' ? s.nombre : s.nombre_en}</div>
                      <div style={{ fontSize: '11px', color: 'var(--warm-gray)' }}>{s.dir}</div>
                    </div>
                  </button>
                ))}
              </div>
              {sucursalSel && (
                <a href={`https://wa.me/526648343018?text=${msgWA}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25D366', color: 'white', padding: '12px', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.502 3.935 1.385 5.608L0 24l6.572-1.364A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 0 1-5.032-1.388l-.361-.214-3.741.98.998-3.648-.235-.374A9.755 9.755 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                  {t('Agendar por WhatsApp', 'Schedule via WhatsApp')}
                </a>
              )}
            </div>
          )}
        </div>

        {/* OPCIÓN 3: La agregaré después */}
        <button onClick={onDespues} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1.1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s', fontFamily: 'var(--font-sans)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sage)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(74,89,64,0.04)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--cream)'; }}>
          <div style={{ color: 'var(--warm-gray)', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)' }}>{t('Solo quiero explorar precios', 'Just exploring prices')}</div>
            <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{t('Agrega tu graduación antes de finalizar tu pedido', 'Add your prescription before placing your order')}</div>
          </div>
          <span style={{ color: 'var(--warm-gray)', fontSize: '18px' }}>›</span>
        </button>

      </div>
      {esSolar && <button onClick={onVolverSolar} style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: 'var(--warm-gray)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>← {t('Volver', 'Back')}</button>}
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────
export default function DetalleArmazon() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const esRegalo = searchParams.get('promo') === 'regalo';
  const { t, lang } = useLang() as any;
  const { addItem, recetasSesion, items, setPagoAbierto } = useCart();
  const [armazon, setArmazon] = useState<Armazon | null>(null);
  const [relacionados, setRelacionados] = useState<Armazon[]>([]);
  const [loading, setLoading] = useState(true);
  type ColorPub = { color: string; sku?: string | null; hex?: string | null; imagen_url?: string | null; imagen2_url?: string | null; imagen3_url?: string | null; imagen4_url?: string | null; portada_url?: string | null; precio?: number | null };
  type RelInfo = { id: number; nombre: string; precio: number; foto: string; colores: { color: string; hex?: string | null }[] };
  const [relInfo, setRelInfo] = useState<RelInfo[]>([]);
  const [colores, setColores] = useState<ColorPub[]>([]);
  const [colorSel, setColorSel] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gonModal, setGonModal] = useState(false);
  const [paqueteGON, setPaqueteGON] = useState<PaqueteGON | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [paciente, setPaciente] = useState('');
  const [reutilizarReceta, setReutilizarReceta] = useState<string | null>(null);
  const { precios: preciosDB, tipoCambio } = usePrecios();

  const esSolar = armazon?.tipo === 'solar';

  type DrawerEstado = 'inicio' | 'inicio_solar' | 'manual' | 'foto' | 'config';
  const [drawerEstado, setDrawerEstado] = useState<DrawerEstado>('inicio');
  const [recetaEstado, setRecetaEstado] = useState<RecetaEstado>('sin_receta');
  const [fotoReceta, setFotoReceta] = useState('');
  const [receta, setReceta] = useState<RecetaData>({ sph_od: null, cyl_od: null, axis_od: null, sph_os: null, cyl_os: null, axis_os: null, add: null, dp: null, prisma: '' });
  const [paso, setPaso] = useState(1);
  const [vision, setVision] = useState('');
  const [material, setMaterial] = useState('');
  const [filtros, setFiltros] = useState<string[]>([]);
  const [colorFoto, setColorFoto] = useState('gris');
  const [colorPolarizado, setColorPolarizado] = useState('negro');
  const [colorTinte, setColorTinte] = useState('negro');
  const [soloArmazon, setSoloArmazon] = useState(false);

  const [fotoActiva, setFotoActiva] = useState(0);
  const [posZoom, setPosZoom] = useState({ x: 50, y: 50 });
  const [zoomActivo, setZoomActivo] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [esMobil, setEsMobil] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const [lbScale, setLbScale] = useState(1);
  const [lbPos, setLbPos] = useState({ x: 0, y: 0 });
  const [lbPinchStart, setLbPinchStart] = useState<number | null>(null);
  const [lbDragStart, setLbDragStart] = useState<{ x: number; y: number; px: number; py: number } | null>(null);
  const lbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      if (!drawerOpen && !gonModal) document.body.style.overflow = '';
      setLbScale(1);
      setLbPos({ x: 0, y: 0 });
    }
  }, [lightboxOpen]);

  // Precios de micas y filtros: lista de OptiOS − 15% (se actualizan solos)
  const [listaLentes, setListaLentes] = useState<ListaPrecios>(PRECIOS_LISTA_DEFAULT);
  useEffect(() => {
    fetch('/api/precios-lentes').then(r => r.json()).then(j => { if (j?.ok && j.precios) setListaLentes(j.precios); }).catch(() => {});
  }, []);
  // Si cambia la visión y el material ya no existe para ella (p. ej. Bifocal + Ultra Slim Pro), regresa a Essential
  useEffect(() => {
    if (vision && material && !materialDisponible(listaLentes, vision, material)) setMaterial('cr39');
  }, [vision, material, listaLentes]);
  const pVision = (id: string) => webVision(listaLentes, id);
  const pMaterial = (id: string) => webMaterial(listaLentes, vision || 'mono', id);
  const pFiltro = (id: string) => webFiltro(listaLentes, id);

  const precioArmazonUSD = esRegalo ? 0 : (armazon?.precio || PRECIO_ARMAZON);
  // Usa precio_gon (MXN directo) si está disponible, si no convierte desde USD
  // Con descuento_gon aplicado (igual que el catálogo y el cobro)
  const precioArmazonMXN = esRegalo ? 0 : (armazon?.precio_gon ? precioGon(armazon as any) : redondearMXN(precioArmazonUSD, tipoCambio));
  // Lens prices are now stored in MXN directly
  const pxMXN = (mxn: number) => lang === 'es' ? `$${mxn.toLocaleString('es-MX')} MXN` : `$${Math.round(mxn / tipoCambio)} USD`;
  const pxPlus = (mxn: number) => lang === 'es' ? `+$${mxn.toLocaleString('es-MX')} MXN` : `+$${Math.round(mxn / tipoCambio)} USD`;
  const precioVision = vision ? pVision(vision) : 0;
  const precioMaterial = vision && material ? pMaterial(material) : 0;
  const precioFiltros = filtros.reduce((sum, fid) => sum + pFiltro(fid), 0);
  const totalMXN = soloArmazon ? precioArmazonMXN : precioArmazonMXN + precioVision + precioMaterial + precioFiltros;

  const toggleFiltro = (fid: string) => setFiltros(prev => prev.includes(fid) ? prev.filter(f => f !== fid) : [...prev, fid]);
  const tieneReceta = recetaEstado === 'guardada' || recetaEstado === 'foto' || recetaEstado === 'sin_graduacion';

  const validarReceta = (): string[] => {
    const errs: string[] = [];
    if (receta.sph_od === null && receta.sph_os === null) errs.push(t('Ingresa al menos el SPH de un ojo', 'Enter at least the SPH for one eye'));
    if (receta.cyl_od !== null && receta.cyl_od !== 0 && receta.axis_od === null) errs.push(t('EJE requerido para OD cuando hay CYL', 'AXIS required for OD when CYL is set'));
    if (receta.cyl_os !== null && receta.cyl_os !== 0 && receta.axis_os === null) errs.push(t('EJE requerido para OS cuando hay CYL', 'AXIS required for OS when CYL is set'));
    return errs;
  };

  const guardarRecetaManual = () => {
    const errs = validarReceta();
    if (errs.length > 0) { setErrores(errs); return; }
    setErrores([]);
    const paquete = calcularPaquete(receta, lang || 'en', listaLentes, precioArmazonMXN);
    setPaqueteGON(paquete);
    setRecetaEstado('guardada');
    setGonModal(true);
  };

  const aceptarPaquete = (extrasIds: string[]) => {
    if (!paqueteGON) return;
    setVision(paqueteGON.vision.id);
    setMaterial(paqueteGON.material.id);
    setFiltros([paqueteGON.filtroBase.id, ...extrasIds]);
    setGonModal(false);
    setDrawerEstado('config');
    setPaso(4);
  };

  const elegirManual = () => { setGonModal(false); setDrawerEstado('config'); setPaso(1); };

  // forzarSolo=true: botón "Llevar solo el armazón" (sin pasar por el configurador)
  const handleAddToCart = (forzarSolo?: unknown) => {
    const solo = forzarSolo === true || soloArmazon;
    if (esRegalo && items.some(i => i.es_regalo)) {
      alert(t('Ya tienes un par de lentes de sol gratis en tu carrito.', 'You already have a free pair of sunglasses in your cart.'));
      return;
    }
    if (reutilizarReceta) {
      const recetaGuardada = recetasSesion.find(r => r.paciente === reutilizarReceta);
      if (recetaGuardada && recetaGuardada.receta.datos) {
        setReceta(recetaGuardada.receta.datos);
        setRecetaEstado('guardada');
      }
    }
    const filtrosSeleccionados = filtroOpts.filter(f => filtros.includes(f.id));
    const item = {
      id: generateCartId(),
      tipo: esSolar ? 'solar' as const : 'optico' as const,
      armazon_id: armazon!.id,
      armazon_nombre: armazon!.nombre,
      armazon_ref: refArmazon(),
      armazon_imagen: armazon!.imagen_url,
      armazon_precio: precioArmazonUSD,
      es_regalo: esRegalo,
      solo_armazon: solo,
      lentes: solo ? undefined : {
        vision, vision_nombre: visionOpts.find(v => v.id === vision)?.nombre_en || vision, vision_precio: precioVision,
        material, material_nombre: materialOpts.find(m => m.id === material)?.nombre_en || material, material_precio: precioMaterial,
        filtros, filtros_nombres: filtrosSeleccionados.map(f => f.nombre_en), filtros_precio: precioFiltros,
      },
      receta: solo ? undefined : {
        metodo: recetaEstado === 'guardada' ? 'manual' as const : recetaEstado === 'foto' ? 'foto' as const : recetaEstado === 'sin_graduacion' ? 'sin_graduacion' as const : 'despues' as const,
        datos: recetaEstado === 'guardada' ? receta : undefined,
        foto_url: recetaEstado === 'foto' ? fotoReceta : undefined,
      },
      paciente: paciente.trim() || undefined,
      precio_total: solo ? precioArmazonMXN : totalMXN,
    };
    addItem(item);
    fbTrack('AddToCart', { content_ids: [String(armazon!.id)], content_type: 'product_group', content_name: armazon!.nombre, value: solo ? precioArmazonMXN : totalMXN, currency: 'MXN' });
    setDrawerOpen(false);
    setPaso(1); setVision(''); setMaterial(''); setFiltros([]);
    setPaciente(''); setReutilizarReceta(null);
    setRecetaEstado('sin_receta'); setFotoReceta('');
    setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio');
  };

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('armazones').select('*').eq('id', id).single();
      if (data) {
        setArmazon(data);
        // Meta Pixel · ViewContent (mismo id que el catálogo)
        fbTrack('ViewContent', { content_ids: [String(data.id)], content_type: 'product_group', content_name: data.nombre, value: data.precio_gon ? precioGon(data) : 0, currency: 'MXN' });
        const { data: rel } = await supabase.from('armazones').select('*').eq('activo', true).eq('publicar_gon', true)
          .eq('tipo', data.tipo || 'optico').neq('id', id).limit(30);
        setRelacionados(rel || []);
        const { data: cols } = await supabase.from('armazon_colores')
          .select('*').eq('armazon_id', id).eq('publicar_gon', true).order('orden');
        setColores(cols || []);
        const pedido = searchParams.get('color');
        const idx = pedido ? (cols || []).findIndex((c: { sku?: string | null }) => c.sku === pedido) : -1;
        if (idx >= 0) setColorSel(idx);
        // Recomendados: con foto (del modelo o de algún color), precio en pesos
        const relIds = (rel || []).map((a: any) => a.id);
        if (relIds.length) {
          const { data: rc } = await supabase.from('armazon_colores').select('armazon_id, color, hex, imagen_url, orden')
            .in('armazon_id', relIds).eq('publicar_gon', true).order('orden');
          const pm: Record<number, any[]> = {};
          for (const c of rc || []) (pm[c.armazon_id] ||= []).push(c);
          const out: RelInfo[] = [];
          for (const a of [...(rel || [])].sort(() => Math.random() - 0.5) as any[]) {
            const cs = pm[a.id] || [];
            const foto = a.imagen_url || cs.find(c => c.imagen_url)?.imagen_url;
            if (!foto || !a.precio_gon) continue;
            out.push({ id: a.id, nombre: a.nombre, precio: precioGon(a), foto, colores: cs.length ? cs : [{ color: a.color || '' }] });
            if (out.length === 4) break;
          }
          setRelInfo(out);
        }
      }
      setLoading(false);
    }
    cargar();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || gonModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, gonModal]);

  // Apartar por WhatsApp (para quien llega de un anuncio y prefiere ir a la óptica)
  // El código web lo agrega solo components/WhatsAppCodigo al dar clic (aplica a todos los botones de WhatsApp)
  // "SWAN · Ray-Ban RB5154 · Negro (VRL-1485-01)": apodo web + marca/modelo + color + SKU, para ubicarlo en la óptica
  const refArmazon = () => {
    const mm = [armazon?.marca, armazon?.modelo].filter(Boolean).join(' ');
    const col = colorActivo?.color ? nombreColor(colorActivo.color, 'es') : '';
    const sku = colorActivo?.sku || armazon?.sku || '';
    return [armazon?.nombre, mm && mm !== armazon?.nombre ? mm : '', col].filter(Boolean).join(' · ') + (sku ? ` (${sku})` : '');
  };
  // El código web lo pone WhatsAppCodigo en [[CODIGO]]
  const textoApartar = () => [
    '¡Hola GON! 👋 ¡Me encantó este armazón! ¿Me lo pueden guardar?',
    '',
    `👓 ${refArmazon()}`,
    precioArmazonMXN > 0 ? `💰 Precio web: $${precioArmazonMXN.toLocaleString('es-MX')}` : '',
    '',
    '[[CODIGO]]',
    `gonmx.com/armazon/${armazon?.id}`,
  ].join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const linkApartar = () => waGon(textoApartar());
  const apartar = () => {
    if (!armazon) return;
    fbTrack('Lead', { content_ids: [String(armazon.id)], content_type: 'product_group', content_name: armazon.nombre, value: precioArmazonMXN, currency: 'MXN' });
  };
  // Mensaje de WhatsApp con TODO lo que armó (el código web lo agrega WhatsAppCodigo)
  const fmtG = (n: number | null) => n == null ? '—' : (n > 0 ? '+' : '') + n.toFixed(2);
  const textoPedidoWA = () => {
    const nomV = visionOpts.find(v => v.id === vision)?.nombre || '';
    const nomM = materialOpts.find(m => m.id === material)?.nombre || '';
    const fs = filtroOpts.filter(f => filtros.includes(f.id)).map(f => {
      if (f.id === 'foto') return `${f.nombre} (${COLORES_FOTO.find(c => c.id === colorFoto)?.nombre_es || colorFoto})`;
      if (f.id === 'pol') return `${f.nombre} (${COLORES_POLARIZADO.find(c => c.id === colorPolarizado)?.nombre_es || colorPolarizado})`;
      if (f.id === 'tinte') return `${f.nombre} (${COLORES_TINTE.find(c => c.id === colorTinte)?.nombre_es || colorTinte})`;
      return f.nombre;
    });
    const color = colorActivo?.color ? ` en color ${nombreColor(colorActivo.color, 'es')}` : '';
    const r = receta;
    const grad = recetaEstado === 'guardada'
      ? `Mi graduación: OD ${fmtG(r.sph_od)} ${fmtG(r.cyl_od)} x ${r.axis_od ?? '—'} · OI ${fmtG(r.sph_os)} ${fmtG(r.cyl_os)} x ${r.axis_os ?? '—'}${r.add ? ` · ADD ${fmtG(r.add)}` : ''}${r.dp ? ` · DP ${r.dp}` : ''}`
      : recetaEstado === 'foto' ? 'Tengo foto de mi receta, se las mando por aquí.'
      : recetaEstado === 'sin_graduacion' ? 'Sin graduación.'
      : 'Todavía no tengo mi graduación (quiero agendar examen).';
    void color;
    const lineas = [
      `¡Hola GON! 👋 Armé mis lentes en su página${paciente.trim() ? ` (para ${paciente.trim()})` : ''}, ¿me los pueden guardar?`,
      '',
      `👓 Armazón: ${refArmazon()}`,
      ...(soloArmazon ? ['🕶️ Solo el armazón'] : [
        nomV ? `🔍 Micas: ${nomV}${nomM ? ` ${nomM}` : ''}` : '',
        fs.length ? `✨ Extras: ${fs.join(', ')}` : '',
      ]),
      `💰 Mi precio web: $${totalMXN.toLocaleString('es-MX')}`,
      '',
      soloArmazon ? '' : `📋 ${grad}`,
      '[[CODIGO]]',
      '',
      '¿Me confirman para pasar por ellos?',
      `gonmx.com/armazon/${armazon?.id}`,
    ];
    return lineas.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  const abrirDrawer = () => { setDrawerOpen(true); setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio'); setSoloArmazon(false); };

  const resumenReceta = () => {
    if (recetaEstado === 'sin_graduacion') return t('Sin graduación', 'No prescription');
    if (recetaEstado === 'foto') return t('Foto adjunta', 'Photo attached');
    if (recetaEstado === 'guardada') return `OD: ${receta.sph_od !== null ? (receta.sph_od >= 0 ? '+' : '') + receta.sph_od.toFixed(2) : '—'} · OS: ${receta.sph_os !== null ? (receta.sph_os >= 0 ? '+' : '') + receta.sph_os.toFixed(2) : '—'}`;
    return '';
  };

  const pasos = [t('Visión', 'Vision'), t('Material', 'Material'), t('Filtros', 'Filters'), t('Resumen', 'Summary')];
  const coloresDisponibles = getColoresDisponibles(vision, material);
  const filtrosActivos = esSolar ? filtroOptsSolar : filtroOpts;
  const colorActivo = colores[colorSel] || null;
  const ambiente = colorActivo?.portada_url || null;
  const fotosColor = colorActivo ? [colorActivo.imagen_url, colorActivo.imagen2_url, colorActivo.imagen3_url, colorActivo.imagen4_url, ambiente].filter(Boolean) as string[] : [];
  const fotos = (fotosColor.length > 0
    ? fotosColor
    : [armazon?.imagen_url, armazon?.imagen2_url, armazon?.imagen3_url, armazon?.imagen4_url].filter(Boolean)) as string[];
  const swatchColor = (n: string): string => {
    const s = (n || '').toUpperCase();
    const map: [string, string][] = [['NEGR', '#1d1d1d'], ['BLANC', '#e8e8e8'], ['AZUL', '#2f4a8c'], ['ROJO', '#a83232'], ['ROSA', '#d46a90'], ['VERDE', '#3a7d4d'], ['GRIS', '#8a8a8a'], ['CAFE', '#5a3a1e'], ['CAREY', '#6b4423'], ['DORAD', '#c9a227'], ['PLATE', '#b8b8b8'], ['MORAD', '#6a3d9a'], ['LILA', '#b39ddb'], ['NARANJ', '#e07b2f'], ['VINO', '#722f37'], ['AMARIL', '#e6c229'], ['TRANSP', '#d8e4e8'], ['CRISTAL', '#d8e4e8'], ['BRONCE', '#8c6239'], ['GUINDA', '#722f37']];
    for (const [k, v] of map) if (s.includes(k)) return v;
    return '#b0b0b0';
  };
  const fotoLifestyle = armazon?.imagen5_url || null;
  const medidas = tallaDeMedidas(armazon?.medidas);
  const fk = normForma(armazon?.forma);
  const formaTxt = fk ? (FORMAS.find(f => f.v === fk)?.[lang === 'es' ? 'es' : 'en'] ?? '') : '';
  const descripcion = ((lang === 'es' ? (armazon as any)?.descripcion_es : (armazon as any)?.descripcion_en) || (armazon as any)?.descripcion_es || '') as string;

  const irFoto = (idx: number) => { setFotoActiva(Math.max(0, Math.min(idx, fotos.length - 1))); setSwipeOffset(0); };
  const fotoPrev = () => irFoto(fotoActiva - 1);
  const fotoNext = () => irFoto(fotoActiva + 1);

  const onTouchStartCarrusel = (e: React.TouchEvent) => { setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY }); setIsSwiping(false); setSwipeOffset(0); };
  const onTouchMoveCarrusel = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const dx = e.touches[0].clientX - touchStart.x;
    const dy = e.touches[0].clientY - touchStart.y;
    if (!isSwiping && Math.abs(dy) > Math.abs(dx)) return;
    setIsSwiping(true);
    let offset = dx;
    if ((fotoActiva === 0 && dx > 0) || (fotoActiva === fotos.length - 1 && dx < 0)) offset = dx * 0.25;
    setSwipeOffset(offset);
  };
  const onTouchEndCarrusel = (e: React.TouchEvent) => {
    if (!touchStart || !isSwiping) { setTouchStart(null); setSwipeOffset(0); setIsSwiping(false); return; }
    const dx = touchStart.x - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { if (dx > 0) fotoNext(); else fotoPrev(); } else { setSwipeOffset(0); }
    setTouchStart(null); setIsSwiping(false);
  };

  const onLbTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); setLbPinchStart(d); }
    else if (e.touches.length === 1 && lbScale > 1) { setLbDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, px: lbPos.x, py: lbPos.y }); }
  };
  const onLbTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length === 2 && lbPinchStart !== null) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); const newScale = Math.min(4, Math.max(1, lbScale * (d / lbPinchStart))); setLbScale(newScale); setLbPinchStart(d); }
    else if (e.touches.length === 1 && lbDragStart && lbScale > 1) { const dx = e.touches[0].clientX - lbDragStart.x; const dy = e.touches[0].clientY - lbDragStart.y; setLbPos({ x: lbDragStart.px + dx, y: lbDragStart.py + dy }); }
  };
  const onLbTouchEnd = () => { setLbPinchStart(null); setLbDragStart(null); if (lbScale < 1.1) { setLbScale(1); setLbPos({ x: 0, y: 0 }); } };
  const lastTap = useRef<number>(0);
  const onLbDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) { if (lbScale > 1) { setLbScale(1); setLbPos({ x: 0, y: 0 }); } else { setLbScale(2.5); } }
    lastTap.current = now;
  };

  if (loading) return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '8rem', color: 'var(--warm-gray)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300 }}>{t('Cargando...', 'Loading...')}</div>
    </main>
  );

  if (!armazon) return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '8rem', color: 'var(--warm-gray)' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300 }}>{t('Armazón no encontrado.', 'Frame not found.')}</p>
        <a href="/Tienda" style={{ color: 'var(--sage)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('← Volver', '← Back')}</a>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: 'var(--font-sans)', background: 'var(--cream)', minHeight: '100vh', color: 'var(--charcoal)' }}>
      <Navbar />
      {gonModal && paqueteGON && <GONModalPaquete paquete={paqueteGON} armazonNombre={armazon.nombre} onAceptar={aceptarPaquete} onManual={elegirManual} lang={lang || 'en'} tipoCambio={tipoCambio}/>}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(28,28,26,0.35)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>}

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && fotos.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setLightboxOpen(false); }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: 'var(--font-sans)' }}>{fotoActiva + 1} / {fotos.length}</span>
            <button onClick={() => setLightboxOpen(false)} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'white', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
          <div ref={lbRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: lbScale > 1 ? 'grab' : 'zoom-in' }} onTouchStart={onLbTouchStart} onTouchMove={onLbTouchMove} onTouchEnd={onLbTouchEnd} onClick={onLbDoubleTap}>
            <img src={fotos[fotoActiva]} alt={armazon.nombre} style={{ maxWidth: '100vw', maxHeight: '100vh', objectFit: 'contain', transform: `scale(${lbScale}) translate(${lbPos.x / lbScale}px, ${lbPos.y / lbScale}px)`, transition: lbPinchStart || lbDragStart ? 'none' : 'transform 0.2s ease', userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none' }} draggable={false}/>
          </div>
          {lbScale === 1 && <div style={{ position: 'absolute', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>{t('Doble toque para zoom', 'Double tap to zoom')}</div>}
          {!esMobil && fotos.length > 1 && (
            <>
              <button onClick={fotoPrev} disabled={fotoActiva === 0} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: fotoActiva === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', cursor: fotoActiva === 0 ? 'default' : 'pointer', color: fotoActiva === 0 ? 'rgba(255,255,255,0.2)' : 'white', fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
              <button onClick={fotoNext} disabled={fotoActiva === fotos.length - 1} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: fotoActiva === fotos.length - 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', cursor: fotoActiva === fotos.length - 1 ? 'default' : 'pointer', color: fotoActiva === fotos.length - 1 ? 'rgba(255,255,255,0.2)' : 'white', fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            </>
          )}
          {fotos.length > 1 && (
            <div style={{ position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
              {fotos.map((f, i) => <button key={i} onClick={() => irFoto(i)} style={{ width: '44px', height: '44px', borderRadius: '4px', overflow: 'hidden', border: fotoActiva === i ? '2px solid white' : '2px solid rgba(255,255,255,0.2)', background: 'transparent', cursor: 'pointer', padding: 0, opacity: fotoActiva === i ? 1 : 0.5, transition: 'all 0.2s' }}><img src={f} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/></button>)}
            </div>
          )}
        </div>
      )}

      {/* ── DRAWER ── */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', maxWidth: '100vw', background: 'white', zIndex: 201, boxShadow: '-2px 0 48px rgba(28,28,26,0.08)', transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* Drawer header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: 0 }}>{t('Personalizando', 'Customizing')}</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, margin: '3px 0 0', color: 'var(--charcoal)' }}>{armazon.nombre}</h3>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'var(--cream)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: 'var(--warm-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Estado: inicio_solar */}
        {drawerEstado === 'inicio_solar' && (
          <div style={{ padding: '2rem', flex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>{t('¿Cómo quieres tus lentes?', 'How do you want your lenses?')}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--warm-gray)' }}>{t('Puedes llevarlos como vienen o personalizarlos.', 'Wear them as-is or customize them.')}</p>
            </div>
            {[
              { title: t('Solo el armazón', 'Frame only'), precio: pxMXN(precioArmazonMXN), desc: t('Incluye lentes oscuros estándar. Sin graduación.', 'Includes standard dark lenses. No prescription.'), dark: false, onClick: () => { setSoloArmazon(true); setDrawerEstado('config'); setPaso(4); } },
              { title: t('Personalizar mis micas', 'Customize my lenses'), precio: `${t('desde', 'from')} ${pxMXN(precioArmazonMXN + pVision('mono'))}`, desc: t('Agregar graduación, polarizado, fotocromático y más.', 'Add prescription, polarized, photochromic and more.'), dark: true, onClick: () => { setSoloArmazon(false); setDrawerEstado('inicio'); } }
            ].map((opt, i) => (
              <div key={i} onClick={opt.onClick} style={{ border: opt.dark ? 'none' : '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', cursor: 'pointer', background: opt.dark ? 'var(--charcoal)' : 'var(--cream)', marginBottom: '0.75rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(28,28,26,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: opt.dark ? 'white' : 'var(--charcoal)' }}>{opt.title}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: opt.dark ? 'rgba(255,255,255,0.65)' : 'var(--warm-gray)' }}>{opt.precio}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: opt.dark ? 'rgba(255,255,255,0.55)' : 'var(--warm-gray)', lineHeight: 1.6, margin: 0 }}>{opt.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Estado: inicio */}
        {drawerEstado === 'inicio' && (
          <InicioDrawer
            esSolar={esSolar}
            t={t}
            lang={lang || 'es'}
            onManual={() => setDrawerEstado('manual')}
            onFoto={() => setDrawerEstado('foto')}
            onDespues={() => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); }}
            onVolverSolar={() => setDrawerEstado('inicio_solar')}
          />
        )}

        {/* Estado: manual */}
        {drawerEstado === 'manual' && (
          <div style={{ padding: '2rem', flex: 1 }}>
            <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontSize: '13px', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontFamily: 'var(--font-sans)' }}>← {t('Atrás', 'Back')}</button>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '1rem' }}>{t('Tu receta óptica', 'Your optical prescription')}</p>
            <FormReceta receta={receta} onChange={setReceta} errores={errores} t={t}/>
            {/* DRAWER ACTION → TURQUESA */}
            <button onClick={guardarRecetaManual} style={{ width: '100%', background: TURQUESA, color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1rem', fontFamily: 'var(--font-sans)', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = TURQUESA_DARK)} onMouseLeave={e => (e.currentTarget.style.background = TURQUESA)}>
              {t('Guardar y ver recomendación →', 'Save & see recommendation →')}
            </button>
            <button onClick={() => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--warm-gray)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '10px', marginTop: '4px' }}>
              {t('Continuar sin receta por ahora', 'Continue without prescription for now')}
            </button>
          </div>
        )}

        {/* Estado: foto */}
        {drawerEstado === 'foto' && (
          <div style={{ padding: '2rem', flex: 1 }}>
            <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontSize: '13px', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontFamily: 'var(--font-sans)' }}>← {t('Atrás', 'Back')}</button>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '1rem' }}>{t('Sube tu receta', 'Upload your prescription')}</p>
            {fotoReceta ? (
              <div style={{ marginBottom: '1rem' }}>
                <img src={fotoReceta} alt="receta" style={{ width: '100%', borderRadius: '6px', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--border)' }}/>
                <button onClick={() => setFotoReceta('')} style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '12px', cursor: 'pointer', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>{t('Quitar foto', 'Remove photo')}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                {[
                  { title: t('Subir archivo', 'Upload file'), sub: 'JPG, PNG, PDF', capture: undefined, accept: 'image/*,.pdf' },
                  { title: t('Tomar foto ahora', 'Take photo now'), sub: t('Usa la cámara de tu dispositivo', 'Use your device camera'), capture: 'environment' as const, accept: 'image/*' }
                ].map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.1rem 1.25rem', borderRadius: '8px', border: '1px dashed var(--border)', cursor: 'pointer', background: 'var(--cream)' }}>
                    <input type="file" accept={opt.accept} capture={opt.capture} style={{ display: 'none' }} onChange={e => { const file = e.target.files?.[0]; if (file) setFotoReceta(URL.createObjectURL(file)); }}/>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{opt.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>{opt.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {fotoReceta && (
              // DRAWER ACTION → TURQUESA
              <button onClick={() => { setRecetaEstado('foto'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: TURQUESA, color: 'white', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = TURQUESA_DARK)} onMouseLeave={e => (e.currentTarget.style.background = TURQUESA)}>
                {t('Foto guardada — continuar →', 'Photo saved — continue →')}
              </button>
            )}
            <button onClick={() => { setRecetaEstado('despues'); setDrawerEstado('config'); setPaso(1); }} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--warm-gray)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '10px', marginTop: '8px' }}>
              {t('Continuar sin foto por ahora', 'Continue without photo for now')}
            </button>
          </div>
        )}

        {/* Estado: config */}
        {drawerEstado === 'config' && (
          <>
            {tieneReceta && (
              <div style={{ padding: '10px 1.5rem', background: 'rgba(74,89,64,0.08)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--sage)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>✓</div>
                <div style={{ flex: 1, fontSize: '11px', color: 'var(--charcoal)', fontWeight: 500 }}>{resumenReceta()}</div>
                <button onClick={() => setDrawerEstado('inicio')} style={{ background: 'none', border: 'none', color: 'var(--sage)', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Editar', 'Edit')}</button>
              </div>
            )}
            {recetaEstado === 'despues' && (
              <div style={{ padding: '10px 1.5rem', background: '#fffbeb', borderBottom: '1px solid rgba(245,197,24,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', flexShrink: 0 }}/>
                <div style={{ flex: 1, fontSize: '11px', color: '#92400e', fontWeight: 500 }}>{t('Recuerda agregar tu graduación antes de pagar', 'Remember to add your prescription before paying')}</div>
                <button onClick={() => setDrawerEstado('inicio')} style={{ background: 'none', border: 'none', color: '#92400e', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{t('Agregar', 'Add')}</button>
              </div>
            )}

            {soloArmazon ? (
              <div style={{ padding: '2rem', flex: 1 }}>
                <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--warm-gray)' }}>{armazon.nombre}</span><span style={{ fontWeight: 500 }}>{pxMXN(precioArmazonMXN)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px' }}><span style={{ color: 'var(--warm-gray)' }}>{t('Lentes oscuros estándar', 'Standard dark lenses')}</span><span style={{ color: 'var(--sage)', fontWeight: 500 }}>{t('Incluido', 'Included')}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300 }}><span>Total</span><span>{pxMXN(precioArmazonMXN)}</span></div>
                </div>
                <button onClick={() => { setSoloArmazon(false); setDrawerEstado('inicio_solar'); }} style={{ width: '100%', background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '11px', fontSize: '12px', color: 'var(--warm-gray)', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: '10px' }}>
                  {t('← Personalizar mis micas', '← Customize my lenses')}
                </button>
                {/* DRAWER ACTION → TURQUESA */}
                <button onClick={handleAddToCart} style={{ width: '100%', background: TURQUESA, color: 'white', border: 'none', borderRadius: '6px', padding: '16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', transition: 'background 0.2s' }} onMouseEnter={e => (e.currentTarget.style.background = TURQUESA_DARK)} onMouseLeave={e => (e.currentTarget.style.background = TURQUESA)}>
                  {t('Agregar al carrito →', 'Add to cart →')}
                </button>
              </div>
            ) : (
              <>
                {/* Stepper */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pasos.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: paso > i + 1 ? 'var(--sage)' : 'white', border: paso >= i + 1 ? '1.5px solid var(--sage)' : '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '11px', color: paso > i + 1 ? 'white' : paso === i + 1 ? 'var(--sage)' : 'var(--warm-gray)' }}>{paso > i + 1 ? '✓' : i + 1}</div>
                          <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', color: paso >= i + 1 ? 'var(--sage)' : 'var(--warm-gray)' }}>{p}</span>
                        </div>
                        {i < pasos.length - 1 && <div style={{ width: '36px', height: '1px', background: paso > i + 1 ? 'var(--sage)' : 'var(--border)', margin: '0 4px 16px' }}/>}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '2rem', flex: 1 }}>
                  {/* Paso 1: Visión */}
                  {paso === 1 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '0.25rem', color: 'var(--charcoal)' }}>{t('Tipo de visión', 'Vision type')}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: '1.25rem' }}>{t('¿Cómo ves?', 'How do you see?')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {visionOpts.map(o => (
                          <div key={o.id} onClick={() => setVision(o.id)} style={{ border: vision === o.id ? '1.5px solid var(--sage)' : '1px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1.1rem', cursor: 'pointer', background: vision === o.id ? 'rgba(74,89,64,0.06)' : 'var(--cream)', transition: 'all 0.15s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)' }}>{lang === 'es' ? o.nombre : o.nombre_en}</div>
                                <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div>
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--sage)', flexShrink: 0 }}>{pxPlus(pVision(o.id))}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Paso 2: Material */}
                  {paso === 2 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '0.25rem', color: 'var(--charcoal)' }}>{t('Material de la mica', 'Lens material')}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: '1.25rem' }}>{t('Afecta el grosor y peso.', 'Affects thickness and weight.')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {materialOpts.filter(o => materialDisponible(listaLentes, vision || 'mono', o.id)).map(o => (
                          <div key={o.id} onClick={() => setMaterial(o.id)} style={{ border: material === o.id ? '1.5px solid var(--sage)' : '1px solid var(--border)', borderRadius: '8px', padding: '1rem 1.1rem', cursor: 'pointer', background: material === o.id ? 'rgba(74,89,64,0.06)' : 'var(--cream)', transition: 'all 0.15s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div><div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)' }}>{lang === 'es' ? o.nombre : o.nombre_en}</div><div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{t(o.desc_es, o.desc_en)}</div></div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--sage)' }}>{pMaterial(o.id) === 0 ? t('Incluido', 'Included') : pxPlus(pMaterial(o.id))}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Paso 3: Filtros */}
                  {paso === 3 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '0.25rem', color: 'var(--charcoal)' }}>{t('Filtros y protecciones', 'Filters & coatings')}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: '1.25rem' }}>{t('Opcionales. Puedes elegir varios.', 'Optional. You can choose multiple.')}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {filtrosActivos.map(o => {
                          const tieneColores = (o.id === 'foto' || o.id === 'pol' || o.id === 'tinte') && filtros.includes(o.id);
                          return (
                            <div key={o.id}>
                              <div onClick={() => toggleFiltro(o.id)} style={{ border: filtros.includes(o.id) ? '1.5px solid var(--sage)' : '1px solid var(--border)', borderRadius: tieneColores ? '8px 8px 0 0' : '8px', padding: '1rem 1.1rem', cursor: 'pointer', background: filtros.includes(o.id) ? 'rgba(74,89,64,0.06)' : 'var(--cream)', transition: 'all 0.15s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '18px', height: '18px', borderRadius: '3px', border: '1.5px solid', borderColor: filtros.includes(o.id) ? 'var(--sage)' : 'var(--border)', background: filtros.includes(o.id) ? 'var(--sage)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', flexShrink: 0 }}>{filtros.includes(o.id) ? '✓' : ''}</div>
                                    <div>
                                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{lang === 'es' ? o.nombre : o.nombre_en}</div>
                                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>{t(o.desc_es, o.desc_en)}</div>
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--sage)' }}>{pxPlus(pFiltro(o.id))}</div>
                                </div>
                              </div>
                              {o.id === 'foto' && filtros.includes('foto') && <div style={{ border: '1.5px solid var(--sage)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1rem', background: 'rgba(74,89,64,0.04)' }}><div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '10px' }}>{t('Elige el color', 'Choose the color')}</div><SelectorColores colores={coloresDisponibles} valorActivo={colorFoto} onChange={setColorFoto} lang={lang}/></div>}
                              {o.id === 'pol' && filtros.includes('pol') && <div style={{ border: '1.5px solid var(--sage)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1rem', background: 'rgba(74,89,64,0.04)' }}><div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '10px' }}>{t('Elige el color', 'Choose the color')}</div><SelectorColores colores={COLORES_POLARIZADO} valorActivo={colorPolarizado} onChange={setColorPolarizado} lang={lang}/></div>}
                              {o.id === 'tinte' && filtros.includes('tinte') && <div style={{ border: '1.5px solid var(--sage)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '1rem', background: 'rgba(74,89,64,0.04)' }}><div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '10px' }}>{t('Elige el color', 'Choose the color')}</div><SelectorColores colores={COLORES_TINTE} valorActivo={colorTinte} onChange={setColorTinte} lang={lang}/></div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Paso 4: Resumen */}
                  {paso === 4 && (
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '1.25rem', color: 'var(--charcoal)' }}>{t('Resumen de tu pedido', 'Order summary')}</h4>
                      {/* "¿Para quién son?" solo cuando ya hay otro par en el carrito (para distinguir graduaciones) */}
                      {items.length > 0 && (
                      <div style={{ marginBottom: '1.25rem', background: 'var(--cream)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border)' }}>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, color: 'var(--charcoal)', margin: '0 0 4px' }}>{t('¿Para quién es este par?', 'Who is this pair for?')}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--warm-gray)', margin: '0 0 0.75rem' }}>{t('Opcional — ya tienes otro par en tu carrito.', 'Optional — you already have another pair in your cart.')}</p>
                        {recetasSesion.length > 0 && (
                          <div style={{ marginBottom: '0.75rem' }}>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{t('Reutilizar receta de', 'Reuse prescription from')}</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {recetasSesion.map((r, i) => (
                                <button key={i} onClick={() => { setReutilizarReceta(r.paciente); setPaciente(r.paciente); }} style={{ padding: '5px 12px', borderRadius: '20px', border: `1.5px solid ${reutilizarReceta === r.paciente ? 'var(--sage)' : 'var(--border)'}`, background: reutilizarReceta === r.paciente ? 'rgba(74,89,64,0.08)' : 'white', color: reutilizarReceta === r.paciente ? 'var(--sage)' : 'var(--warm-gray)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s' }}>↩ {r.paciente}</button>
                              ))}
                            </div>
                          </div>
                        )}
                        <input type="text" placeholder={t('Ej: Rob, Mom, Para mí...', 'e.g. Rob, Mom, For me...')} value={paciente} onChange={e => { setPaciente(e.target.value); setReutilizarReceta(null); }} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--charcoal)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }} onFocus={e => (e.currentTarget.style.borderColor = 'var(--sage)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}/>
                      </div>
                      )}
                      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1.1rem', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
                        {[
                          { label: t('Armazón', 'Frame'), value: esRegalo ? `~~${pxMXN(redondearMXN(armazon?.precio || PRECIO_ARMAZON, tipoCambio))}~~ $0 🎁` : pxMXN(precioArmazonMXN) },
                          { label: `${t('Visión', 'Vision')}: ${lang === 'es' ? (visionOpts.find(v => v.id === vision)?.nombre || '-') : (visionOpts.find(v => v.id === vision)?.nombre_en || '-')}`, value: pxPlus(precioVision) },
                          { label: `${t('Material', 'Material')}: ${lang === 'es' ? (materialOpts.find(m => m.id === material)?.nombre || '-') : (materialOpts.find(m => m.id === material)?.nombre_en || '-')}`, value: precioMaterial === 0 ? t('Incluido', 'Included') : pxPlus(precioMaterial) },
                          ...filtroOpts.filter(f => filtros.includes(f.id)).map(f => {
                            const nombre = lang === 'es' ? f.nombre : f.nombre_en;
                            let label = nombre;
                            if (f.id === 'foto') label = `${nombre} — ${COLORES_FOTO.find(c => c.id === colorFoto)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorFoto}`;
                            if (f.id === 'pol') label = `${nombre} — ${COLORES_POLARIZADO.find(c => c.id === colorPolarizado)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorPolarizado}`;
                            if (f.id === 'tinte') label = `${nombre} — ${COLORES_TINTE.find(c => c.id === colorTinte)?.[lang === 'es' ? 'nombre_es' : 'nombre_en'] || colorTinte}`;
                            return { label, value: pxPlus(pFiltro(f.id)) };
                          })
                        ].map((item, i, arr) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', fontSize: '13px' }}>
                            <span style={{ color: 'var(--warm-gray)' }}>{item.label}</span>
                            <span style={{ fontWeight: 500 }}>{item.value}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300 }}>
                          <span>Total</span><span>{pxMXN(totalMXN)}</span>
                        </div>
                      </div>
                      {!tieneReceta && (
                        <div style={{ background: '#fffbeb', borderRadius: '6px', padding: '0.9rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(245,197,24,0.3)' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', flexShrink: 0 }}/>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: 500, color: '#92400e' }}>{t('Graduación pendiente', 'Prescription pending')}</div>
                            <div style={{ fontSize: '11px', color: '#a16207' }}>{t('Puedes mandarla por WhatsApp o hacerte el examen gratis en la óptica', 'Send it on WhatsApp or get a free eye exam in store')}</div>
                          </div>
                          <button onClick={() => setDrawerEstado('inicio')} style={{ background: 'var(--charcoal)', border: 'none', borderRadius: '3px', padding: '5px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: 'white', fontFamily: 'var(--font-sans)' }}>{t('Agregar', 'Add')}</button>
                        </div>
                      )}
                      {/* Acción principal: ordenar (pagar todo, anticipo o apartar) */}
                      <button onClick={() => { handleAddToCart(); setPagoAbierto(true); }} style={{ width: '100%', background: '#1B2F5E', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                        {t('Ordenar mis lentes', 'Order my glasses')} →
                      </button>
                      <p style={{ fontSize: '12.5px', color: 'var(--warm-gray)', textAlign: 'center', margin: '8px 0 12px', lineHeight: 1.5 }}>
                        {t('Empieza desde $100 y el resto al recoger', 'Start from $100 and pay the rest at pickup')}
                      </p>
                      {/* Secundario: WhatsApp con todo lo que armó + código web */}
                      <a href={waGon(textoPedidoWA())} target="_blank" rel="noopener noreferrer" onClick={apartar}
                        data-armazon={armazon?.id} data-color={colorActivo?.sku || undefined}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', boxSizing: 'border-box', background: 'white', color: '#128C4A', border: '1px solid #25D366', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-sans)', textDecoration: 'none' }}>
                        {t('¿Dudas? Escríbenos por WhatsApp', 'Questions? Message us on WhatsApp')}
                      </a>
                    </div>
                  )}
                </div>

                {/* Bottom nav drawer */}
                {paso < 4 && (
                  <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, background: 'white' }}>
                    {paso > 1
                      ? <button onClick={() => setPaso(p => p - 1)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 20px', fontSize: '12px', cursor: 'pointer', color: 'var(--warm-gray)', fontFamily: 'var(--font-sans)' }}>← {t('Atrás', 'Back')}</button>
                      : <button onClick={() => setDrawerEstado(esSolar ? 'inicio_solar' : 'inicio')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 20px', fontSize: '12px', cursor: 'pointer', color: 'var(--warm-gray)', fontFamily: 'var(--font-sans)' }}>← {t('Mi receta', 'My prescription')}</button>
                    }
                    {/* DRAWER ACTION → TURQUESA (when enabled) */}
                    <button
                      onClick={() => { if (paso === 1 && !vision) return; if (paso === 2 && !material) return; setPaso(p => p + 1); }}
                      style={{ background: (paso === 1 && !vision) || (paso === 2 && !material) ? 'var(--border)' : TURQUESA, color: (paso === 1 && !vision) || (paso === 2 && !material) ? 'var(--warm-gray)' : 'white', border: 'none', borderRadius: '6px', padding: '10px 24px', fontSize: '12px', fontWeight: 600, cursor: (paso === 1 && !vision) || (paso === 2 && !material) ? 'not-allowed' : 'pointer', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)', transition: 'background 0.2s' }}
                      onMouseEnter={e => { if (!((paso === 1 && !vision) || (paso === 2 && !material))) (e.currentTarget.style.background = TURQUESA_DARK); }}
                      onMouseLeave={e => { if (!((paso === 1 && !vision) || (paso === 2 && !material))) (e.currentTarget.style.background = TURQUESA); }}
                    >
                      {paso === 3 ? t('Ver resumen →', 'See summary →') : t('Siguiente →', 'Next →')}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ── BREADCRUMB ── */}
      <div className="va-crumb">
        <a href="/">{t('Inicio', 'Home')}</a><span>/</span>
        <a href="/Tienda">{t('Armazones', 'Frames')}</a><span>/</span>
        <b>{armazon.nombre}</b>
      </div>

      {/* ── PRODUCTO PRINCIPAL (mismo diseño que Verly; botones propios de GON) ── */}
      <div className="va-main">
        <div className="va-gal">
          <div className="va-foto"
            style={{ cursor: fotos.length > 0 ? (esMobil ? 'pointer' : 'zoom-in') : 'default' }}
            onMouseMove={e => { if (esMobil) return; const rect = e.currentTarget.getBoundingClientRect(); setPosZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 }); setZoomActivo(true); }}
            onMouseLeave={() => setZoomActivo(false)}
            onClick={() => { if (fotos.length > 0) setLightboxOpen(true); }}
            onTouchStart={onTouchStartCarrusel}
            onTouchMove={onTouchMoveCarrusel}
            onTouchEnd={onTouchEndCarrusel}
          >
            {fotos.length === 0 && <div className="va-sinfoto"><LenteSVG color="var(--charcoal)" forma={armazon.forma} size="large" /></div>}
            <div style={{ display: 'flex', width: `${Math.max(fotos.length, 1) * 100}%`, height: '100%', transform: `translateX(calc(${-fotoActiva * (100 / Math.max(fotos.length, 1))}% + ${swipeOffset / Math.max(fotos.length, 1)}px))`, transition: isSwiping ? 'none' : 'transform 0.32s cubic-bezier(0.4,0,0.2,1)', willChange: 'transform' }}>
              {fotos.map((foto, i) => (
                <div key={i} style={{ width: `${100 / fotos.length}%`, height: '100%', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={foto} alt={`${armazon.nombre} ${i + 1}`} draggable={false}
                    style={{ transformOrigin: `${posZoom.x}% ${posZoom.y}%`, transform: (!esMobil && i === fotoActiva && zoomActivo) ? 'scale(1.9)' : (foto === ambiente ? 'none' : 'scale(1.06)'), transition: zoomActivo ? 'none' : 'transform 0.4s ease', ...(foto === ambiente ? { objectFit: 'cover', mixBlendMode: 'normal' } : {}) }} />
                </div>
              ))}
            </div>
            {fotos.length > 1 && <span className="va-cont">{fotoActiva + 1} / {fotos.length}</span>}
            {!esMobil && fotos.length > 1 && (
              <>
                <button className="va-nav" style={{ left: 14 }} onClick={e => { e.stopPropagation(); fotoPrev(); }} disabled={fotoActiva === 0} aria-label={t('Anterior', 'Previous')}>‹</button>
                <button className="va-nav" style={{ right: 14 }} onClick={e => { e.stopPropagation(); fotoNext(); }} disabled={fotoActiva === fotos.length - 1} aria-label={t('Siguiente', 'Next')}>›</button>
              </>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="va-thumbs">
              {fotos.map((foto, i) => (
                <button key={i} onClick={() => irFoto(i)} className={fotoActiva === i ? 'on' : ''} aria-label={`${t('Foto', 'Photo')} ${i + 1}`}>
                  <img src={foto} alt="" style={foto === ambiente ? { objectFit: 'cover', mixBlendMode: 'normal' } : undefined} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="va-info">
          <p className="va-eye">
            {[armazon.genero === 'hombre' ? t('Hombre', 'Men') : armazon.genero === 'mujer' ? t('Mujer', 'Women') : armazon.genero === 'nino' ? t('Niños', 'Kids') : 'Unisex', nombreMaterial(armazon.material, lang), formaTxt].filter(Boolean).join(' · ')}
          </p>
          <h1>{armazon.nombre}</h1>
          {armazon.badge && <span className="va-badge">{nombreBadge(armazon.badge, lang)}</span>}
          <div className="va-precio">
            {pxMXN(precioArmazonMXN)}
            {!esRegalo && precioArmazonMXN < Number(armazon.precio_gon || 0) && <s>{pxMXN(Number(armazon.precio_gon))}</s>}
          </div>
          {!esRegalo && precioArmazonMXN < Number(armazon.precio_gon || 0) && (
            <p className="va-pweb">
              <b>{t('Precio web', 'Online price')}</b> · {t('en óptica', 'in store')} {pxMXN(Number(armazon.precio_gon))}.{' '}
              {t('Apártalo en línea y te respetamos este precio en la óptica.', 'Reserve it online and we honor this price in store.')}
            </p>
          )}
          {descripcion && <p className="va-desc">{descripcion}</p>}

          {colores.length > 0 && (
            <div className="va-bloque">
              <p className="va-lbl">{t('Color', 'Color')}: <b>{nombreColor(colorActivo?.color, lang)}</b></p>
              <div className="va-sws">
                {colores.map((c, i) => (
                  <button key={i} onClick={() => { setColorSel(i); setFotoActiva(0); }} title={nombreColor(c.color, lang)}
                    aria-label={nombreColor(c.color, lang)} className={i === colorSel ? 'on' : ''}
                    style={{ background: swatchLib(c.color, c.hex) }} />
                ))}
              </div>
            </div>
          )}

          {medidas && (
            <div className="va-bloque">
              <p className="va-lbl">{t('Talla', 'Size')}: <b>{medidas.talla}</b> <span>· {armazon.medidas}</span></p>
            </div>
          )}

          {/* Botones propios de GON */}
          {!esMobil && (
            <button onClick={abrirDrawer} className="va-cta">
              {esSolar ? t('Configurar mis lentes', 'Configure my lenses') : t('Personalizar mis micas', 'Customize my lenses')}
            </button>
          )}
          {!esSolar && !esRegalo && (
            <button onClick={() => { handleAddToCart(true); setPagoAbierto(true); }} className="va-solo">
              {t('Llevar solo el armazón', 'Frame only')} · {pxMXN(precioArmazonMXN)}
            </button>
          )}
          <a href={linkApartar()} target="_blank" rel="noopener noreferrer" className="va-cta va-cta-wa" onClick={apartar} data-armazon={armazon.id} data-color={colorActivo?.sku || undefined}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45c6.55 0 11.89-5.34 11.89-11.89S18.6 0 12.05 0z"/></svg>
            {t('Apartar por WhatsApp', 'Reserve on WhatsApp')}
          </a>
          <p className="va-guarda">{t('Te respondemos por WhatsApp y te lo guardamos 48 horas con tu precio web.', 'We reply on WhatsApp and hold it for 48 hours at your online price.')}</p>
          <a href={`/examen?armazon=${armazon.id}&nombre=${encodeURIComponent(armazon.nombre || armazon.modelo || '')}&color=${encodeURIComponent(colorActivo?.color ? nombreColor(colorActivo.color, 'es') : '')}&ref=${encodeURIComponent(refArmazon())}`} className="va-examen">{t('Agenda tu examen de la vista gratis', 'Book your free eye exam')} →</a>

          <div className="va-incluye">
            <p>{t('Lo apartamos y pasas a cualquiera de nuestras ópticas en Rosarito.', 'We hold it for you at any of our Rosarito stores.')}</p>
            <p>{t('Examen de la vista ', 'Eye exam ')}<b>{t('gratis', 'free')}</b>{t(' y atención en español e inglés.', ' and service in English and Spanish.')}</p>
          </div>

          <div className="va-acc">
            <Acordeon titulo={t('Detalles del armazón', 'Frame details')}>
              <div className="va-det">
                {armazon.material && <div><span>Material</span><b>{nombreMaterial(armazon.material, lang)}</b></div>}
                {formaTxt && <div><span>{t('Forma', 'Shape')}</span><b>{formaTxt}</b></div>}
                {armazon.medidas && <div><span>{t('Medidas', 'Measurements')}</span><b>{armazon.medidas}</b></div>}
              </div>
            </Acordeon>
            <Acordeon titulo={t('¿Cuál es mi talla?', 'What’s my size?')}>
              {t('Busca tres números en la varilla de tus lentes actuales (ej. 52-18-140). Si se parecen a los de este armazón, te va a quedar igual. Si tienes duda, pruébatelo en la óptica.', 'Look for three numbers on the temple of your current glasses (e.g. 52-18-140). If they are close to this frame’s, it will fit the same. If unsure, try it on at the store.')}
            </Acordeon>
            <Acordeon titulo={t('Recoger en la óptica', 'Pick up at the store')}>
              {t('Puedes apartarlo por WhatsApp o comprarlo en línea y recogerlo en cualquiera de nuestras ópticas de Playas de Rosarito.', 'Reserve it on WhatsApp or buy it online and pick it up at any of our stores in Playas de Rosarito.')}
            </Acordeon>
          </div>
        </div>
      </div>

      {/* ── RELACIONADOS ── */}
      {relInfo.length > 0 && (
        <section className="va-rel">
          <div className="va-rel-h">
            <h2>{t('También te puede gustar', 'You might also like')}</h2>
            <a href="/Tienda">{t('Ver todos los armazones', 'View all frames')} →</a>
          </div>
          <div className="va-rel-g">
            {relInfo.map(r => (
              <a key={r.id} href={`/armazon/${r.id}`} className="va-prod">
                <div className="va-prod-img"><img src={r.foto} alt={r.nombre} loading="lazy" /></div>
                <b>{r.nombre}</b>
                <span>{pxMXN(r.precio)}</span>
                <div className="va-prod-sw">{r.colores.slice(0, 5).map((c, i) => <i key={i} style={{ background: swatchLib(c.color, c.hex) }} />)}</div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── BARRA FIJA EN CELULAR: personalizar + WhatsApp ── */}
      {esMobil && (
        <div className="va-sticky">
          <button onClick={abrirDrawer}>{esSolar ? t('Configurar mis lentes', 'Configure my lenses') : t('Personalizar micas', 'Customize lenses')}</button>
          <a href={linkApartar()} target="_blank" rel="noopener noreferrer" onClick={apartar} data-armazon={armazon.id} data-color={colorActivo?.sku || undefined}>{t('Apartar', 'Reserve')}</a>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        ::-webkit-scrollbar { display: none; }
        .va-crumb{max-width:1320px;margin:72px auto 0;padding:18px 2.5rem 0;font-size:12px;color:var(--warm-gray)}
        .va-crumb a{color:var(--warm-gray);text-decoration:none}
        .va-crumb span{margin:0 8px;opacity:.5}
        .va-crumb b{color:var(--charcoal);font-weight:500}
        .va-main{max-width:1320px;margin:0 auto;padding:22px 2.5rem 80px;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:64px;align-items:start}
        .va-foto{position:relative;aspect-ratio:4/3;background:var(--foto-bg);border-radius:6px;overflow:hidden;user-select:none;-webkit-user-select:none}
        .va-foto img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;pointer-events:none}
        .va-sinfoto{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.2}
        .va-cont{position:absolute;left:16px;bottom:14px;font-size:12px;color:var(--warm-gray)}
        .va-tag{position:absolute;left:16px;top:14px;font-size:11px;font-weight:600;color:var(--sage)}
        .va-nav{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:1px solid var(--border);background:rgba(247,244,239,.9);font-size:20px;color:var(--charcoal);cursor:pointer;z-index:2}
        .va-nav:disabled{opacity:.3;cursor:default}
        .va-thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:10px}
        .va-thumbs button{aspect-ratio:4/3;background:var(--foto-bg);border:1px solid transparent;border-radius:4px;padding:0;cursor:pointer;overflow:hidden;opacity:.7;transition:opacity .2s}
        .va-thumbs button.on{border-color:var(--charcoal);opacity:1}
        .va-thumbs img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
        .va-info{position:sticky;top:96px}
        .va-eye{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 10px}
        .va-info h1{font-size:clamp(2.2rem,3.6vw,3.2rem);font-weight:500;letter-spacing:-.035em;line-height:1;margin:0 0 12px;font-family:var(--font-sans)}
        .va-badge{display:inline-block;font-size:11px;font-weight:600;color:var(--sage);border:1px solid var(--sage);border-radius:99px;padding:3px 10px;margin-bottom:12px}
        .va-precio{font-size:22px;font-weight:500;margin-bottom:14px}
        .va-precio small{font-size:12px;color:var(--warm-gray);font-weight:400}
        .va-precio s{font-size:15px;color:var(--warm-gray);margin-left:10px;font-weight:400}
        .va-pweb{font-size:12.5px;line-height:1.5;color:var(--warm-gray);margin:-8px 0 14px}
        .va-pweb b{color:var(--sage);font-weight:600}
        .va-guarda{font-size:12px;color:var(--warm-gray);text-align:center;margin:-4px 0 12px;line-height:1.5}
        .va-desc{font-size:14.5px;line-height:1.65;color:#4a463f;margin:0 0 18px;max-width:440px}
        .va-bloque{border-top:1px solid var(--border);padding:16px 0}
        .va-lbl{font-size:13px;color:var(--warm-gray);margin:0 0 10px}
        .va-lbl b{color:var(--charcoal);font-weight:600}
        .va-sws{display:flex;flex-wrap:wrap;gap:10px}
        .va-sws button{position:relative;width:30px;height:30px;border-radius:50%;border:1px solid rgba(0,0,0,.12);cursor:pointer;padding:0;overflow:hidden}
        .va-sws button.on{outline:1.5px solid var(--charcoal);outline-offset:3px}
        .va-tache{position:absolute;left:50%;top:-4px;bottom:-4px;width:1.5px;background:var(--charcoal);transform:rotate(45deg)}
        .va-agotado{font-size:12.5px;color:#a33;margin:10px 0 0}
        .va-cta{display:block;width:100%;background:var(--sage);color:#fff;border:0;border-radius:999px;padding:17px;font-size:15px;font-weight:500;cursor:pointer;font-family:var(--font-sans);margin:6px 0 14px;transition:background .2s}
        .va-cta:hover{background:var(--sage-light)}
        .va-cta:disabled{opacity:.4;cursor:default}
        .va-micas{font-size:13px;line-height:1.6;color:var(--warm-gray);margin:0 0 16px}
        .va-incluye{background:var(--cream-dark);border-radius:6px;padding:14px 16px;font-size:13px;line-height:1.6;color:#4a463f}
        .va-incluye p{margin:0}
        .va-incluye b{color:var(--charcoal)}
        .va-gar{font-size:12.5px;color:var(--warm-gray);margin:14px 0 18px;line-height:1.7}
        .va-gar a{color:var(--warm-gray);text-decoration:none;border-bottom:1px solid var(--border)}
        .va-acc{border-bottom:1px solid var(--border)}
        .va-det{display:flex;flex-direction:column;gap:10px}
        .va-det div{display:flex;justify-content:space-between}
        .va-det b{font-weight:500;color:var(--charcoal)}
        .va-rel{max-width:1320px;margin:0 auto;padding:40px 2.5rem 110px;border-top:1px solid var(--border)}
        .va-rel-h{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:26px}
        .va-rel-h h2{font-size:clamp(1.7rem,2.8vw,2.4rem);font-weight:500;letter-spacing:-.03em;margin:0}
        .va-rel-h a{font-size:13px;font-weight:500;color:var(--charcoal);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px;white-space:nowrap}
        .va-rel-g{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .va-prod{text-decoration:none;color:var(--charcoal);display:flex;flex-direction:column;gap:4px}
        .va-prod-img{aspect-ratio:4/3;background:var(--foto-bg);border-radius:4px;overflow:hidden;margin-bottom:10px}
        .va-prod-img img{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;transform:scale(1.08);transition:transform .5s ease}
        .va-prod:hover .va-prod-img img{transform:scale(1.13)}
        .va-prod b{font-size:15px;font-weight:500}
        .va-prod > span{font-size:13px;color:var(--warm-gray)}
        .va-prod-sw{display:flex;gap:6px;margin-top:6px}
        .va-prod-sw i{width:14px;height:14px;border-radius:50%;border:1px solid rgba(0,0,0,.12)}
        @media (max-width:900px){
          .va-crumb{padding:14px 1.25rem 0}
          .va-main{grid-template-columns:1fr;gap:22px;padding:14px 0 40px}
          .va-foto{border-radius:0}
          .va-thumbs{padding:0 1.25rem;grid-template-columns:repeat(5,1fr)}
          .va-info{position:relative;top:auto;padding:0 1.25rem}
          .va-rel{padding:40px 1.25rem 120px;border-top:0}
          .va-rel-g{grid-template-columns:1fr 1fr;gap:12px}
        }

        .va-solo{display:block;width:100%;background:#fff;color:var(--sage);border:1.5px solid var(--sage);border-radius:999px;padding:12px;font-size:13.5px;font-weight:500;cursor:pointer;font-family:var(--font-sans);margin:0 0 12px}
        .va-solo:hover{background:rgba(27,47,94,.05)}
        .va-cta-wa{display:flex;align-items:center;justify-content:center;gap:8px;background:#fff;color:var(--charcoal);border:1.5px solid #25D366;text-decoration:none;margin-top:0}
        .va-cta-wa:hover{background:#f3fbf6}
        .va-examen{display:block;text-align:center;font-size:13.5px;font-weight:500;color:var(--sage);text-decoration:none;margin:4px 0 16px}
        .va-sticky{position:fixed;left:0;right:0;bottom:0;z-index:100;display:flex;gap:10px;padding:12px 1.25rem calc(12px + env(safe-area-inset-bottom));background:var(--cream);border-top:1px solid var(--border)}
        .va-sticky button{flex:1;background:var(--sage);color:#fff;border:0;border-radius:999px;padding:15px;font-size:14px;font-weight:500;font-family:var(--font-sans)}
        .va-sticky a{display:flex;align-items:center;justify-content:center;padding:0 20px;border:1.5px solid #25D366;border-radius:999px;color:var(--charcoal);text-decoration:none;font-size:14px;font-weight:500}
      `}</style>
    </main>
  );
}