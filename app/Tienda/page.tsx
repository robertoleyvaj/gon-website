// app/Tienda/page.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';
import { supabase } from '../supabase';

type Armazon = {
  id: number; nombre: string; forma: string; genero: string;
  precio: number; color: string; imagen_url?: string;
  badge?: string; material?: string; talla?: string; tipo?: string;
  color1?: string; descuento?: number;
};

const FORMAS = ['Rectangle', 'Round', 'Square', 'Oval', 'Aviator'];
const MATERIALES = ['Acetato', 'Metálico', 'TR-90', 'Titanio', 'Mixto'];
const TALLAS = ['S', 'M', 'L', 'XL'];

export default function Tienda() {
  const { t, lang } = useLang() as any;
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [loading, setLoading] = useState(true);
  const [esMobil, setEsMobil] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [generoTab, setGeneroTab] = useState('all');

  // Filtros activos
  const [filtroGenero, setFiltroGenero] = useState<string[]>([]);
  const [filtroForma, setFiltroForma] = useState<string[]>([]);
  const [filtroMaterial, setFiltroMaterial] = useState<string[]>([]);
  const [filtroTalla, setFiltroTalla] = useState<string[]>([]);
  // Acordeones sidebar
  const [openSections, setOpenSections] = useState<string[]>(['gender', 'shape']);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase.from('armazones').select('*').eq('activo', true).order('id')
      .then(({ data }) => { setArmazones(data || []); setLoading(false); });
  }, []);

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const toggleSection = (s: string) =>
    setOpenSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  // Chips activos
  const chips = [
    ...filtroGenero.map(v => ({ label: v, type: 'genero', val: v })),
    ...filtroForma.map(v => ({ label: v, type: 'forma', val: v })),
    ...filtroMaterial.map(v => ({ label: v, type: 'material', val: v })),
    ...filtroTalla.map(v => ({ label: `Talla ${v}`, type: 'talla', val: v })),
  ];

  const removeChip = (chip: any) => {
    if (chip.type === 'genero') setFiltroGenero(prev => prev.filter(x => x !== chip.val));
    if (chip.type === 'forma') setFiltroForma(prev => prev.filter(x => x !== chip.val));
    if (chip.type === 'material') setFiltroMaterial(prev => prev.filter(x => x !== chip.val));
    if (chip.type === 'talla') setFiltroTalla(prev => prev.filter(x => x !== chip.val));
  };

  const clearAll = () => { setFiltroGenero([]); setFiltroForma([]); setFiltroMaterial([]); setFiltroTalla([]); };

  const filtered = useMemo(() => {
    let r = armazones;
    if (generoTab !== 'all') r = r.filter(a => a.genero === generoTab);
    if (filtroGenero.length) r = r.filter(a => filtroGenero.some(g => a.genero === g.toLowerCase()));
    if (filtroForma.length) r = r.filter(a => filtroForma.some(f => a.forma?.toLowerCase().includes(f.toLowerCase())));
    if (filtroMaterial.length) r = r.filter(a => filtroMaterial.some(m => a.material === m));
    if (filtroTalla.length) r = r.filter(a => filtroTalla.includes(a.talla || 'M'));
    return r;
  }, [armazones, generoTab, filtroGenero, filtroForma, filtroMaterial, filtroTalla]);

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {[
        {
          id: 'gender', label: t('Género', 'Gender'),
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '1rem' }}>
              {[{val:'',label:t('Todos','All')},{val:'hombre',label:t('Hombre','Men')},{val:'mujer',label:t('Mujer','Women')},{val:'unisex',label:'Unisex'}].map(o => (
                <label key={o.val} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1d1d1d' }}>
                  <div onClick={() => {
                    if (o.val === '') { setFiltroGenero([]); return; }
                    setFiltroGenero(prev => toggleArr(prev, o.val));
                  }} style={{ width: '16px', height: '16px', borderRadius: '3px', border: `1.5px solid ${(o.val === '' && filtroGenero.length === 0) || filtroGenero.includes(o.val) ? '#55624c' : '#d1ccc5'}`, background: (o.val === '' && filtroGenero.length === 0) || filtroGenero.includes(o.val) ? '#55624c' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {((o.val === '' && filtroGenero.length === 0) || filtroGenero.includes(o.val)) && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  {o.label}
                </label>
              ))}
            </div>
          )
        },
        {
          id: 'shape', label: t('Forma', 'Shape'),
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '1rem' }}>
              {FORMAS.map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1d1d1d' }}>
                  <div onClick={() => setFiltroForma(prev => toggleArr(prev, f))} style={{ width: '16px', height: '16px', borderRadius: '3px', border: `1.5px solid ${filtroForma.includes(f) ? '#55624c' : '#d1ccc5'}`, background: filtroForma.includes(f) ? '#55624c' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {filtroForma.includes(f) && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  {f}
                </label>
              ))}
            </div>
          )
        },
        {
          id: 'material', label: 'Material',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '1rem' }}>
              {MATERIALES.map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1d1d1d' }}>
                  <div onClick={() => setFiltroMaterial(prev => toggleArr(prev, m))} style={{ width: '16px', height: '16px', borderRadius: '3px', border: `1.5px solid ${filtroMaterial.includes(m) ? '#55624c' : '#d1ccc5'}`, background: filtroMaterial.includes(m) ? '#55624c' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {filtroMaterial.includes(m) && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  {m}
                </label>
              ))}
            </div>
          )
        },
        {
          id: 'size', label: t('Talla', 'Size'),
          content: (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '1rem' }}>
              {TALLAS.map(s => (
                <button key={s} onClick={() => setFiltroTalla(prev => toggleArr(prev, s))} style={{ padding: '6px 14px', borderRadius: '4px', border: `1.5px solid ${filtroTalla.includes(s) ? '#55624c' : '#e2ddd6'}`, background: filtroTalla.includes(s) ? '#55624c' : 'white', color: filtroTalla.includes(s) ? 'white' : '#1d1d1d', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-sans)' }}>{s}</button>
              ))}
            </div>
          )
        },
      ].map(sec => (
        <div key={sec.id} style={{ borderBottom: '1px solid #f0ede8' }}>
          <button onClick={() => toggleSection(sec.id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1d1d1d' }}>
            {sec.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="1.5" strokeLinecap="round" style={{ transform: openSections.includes(sec.id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {openSections.includes(sec.id) && sec.content}
        </div>
      ))}
    </div>
  );

  return (
    <main style={{ fontFamily: 'var(--font-sans), sans-serif', background: '#f7f4ef', minHeight: '100vh', color: '#1d1d1d' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '64px', background: '#edeae3', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: esMobil ? '2.5rem 1.25rem' : '0 3rem', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr', alignItems: 'center', minHeight: esMobil ? 'auto' : '320px', gap: esMobil ? '1.5rem' : '0' }}>
          {/* Texto */}
          <div style={{ padding: esMobil ? '0' : '3rem 0' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#55624c', margin: '0 0 0.75rem' }}>Collection</p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '3rem' : '4.5rem', fontWeight: 400, letterSpacing: '-0.03em', color: '#1d1d1d', margin: '0 0 1rem', lineHeight: 1.05 }}>
              {t('Armazones', 'Eyewear')}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#6f6a63', margin: '0 0 1.5rem', lineHeight: 1.7, maxWidth: '340px' }}>
              {t('Diseño atemporal. Comodidad diaria. Lentes que se adaptan a tu vida.', 'Timeless design. Everyday comfort. Lenses that fit your lifestyle.')}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2ddd6', borderRadius: '6px', padding: '8px 14px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#55624c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <span style={{ fontSize: '0.72rem', color: '#1d1d1d', fontWeight: 500 }}>{t('Envío gratis +$69', 'Free shipping over $69')}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#55624c', borderRadius: '6px', padding: '8px 14px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                <span style={{ fontSize: '0.72rem', color: 'white', fontWeight: 500 }}>{t('Fotocromático desde $39', 'Photochromic from $39')}</span>
              </div>
            </div>
          </div>
          {/* Imagen lifestyle */}
          {!esMobil && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '320px', overflow: 'hidden' }}>
              <img src="/hero-man.jpg" alt="" style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center 20%', borderRadius: '12px 12px 0 0', opacity: 0.92 }}/>
            </div>
          )}
        </div>
      </div>

      {/* ── TABS GÉNERO ──────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2ddd6', position: 'sticky', top: '64px', zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {[{val:'all',label:t('Todos','All')},{val:'hombre',label:t('Hombre','Men')},{val:'mujer',label:t('Mujer','Women')},{val:'unisex',label:'Unisex'}].map(tab => (
              <button key={tab.val} onClick={() => setGeneroTab(tab.val)} style={{ padding: '1rem 1.25rem', background: 'none', border: 'none', borderBottom: generoTab === tab.val ? '2px solid #1d1d1d' : '2px solid transparent', fontSize: '0.75rem', fontWeight: generoTab === tab.val ? 600 : 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: generoTab === tab.val ? '#1d1d1d' : '#9a9a9a', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', marginBottom: '-1px' }}>
                {tab.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#9a9a9a', letterSpacing: '0.04em' }}>{filtered.length} {t('piezas', 'styles')}</span>
        </div>
      </div>

      {/* ── LAYOUT PRINCIPAL ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: esMobil ? '1.5rem 1rem' : '2.5rem 3rem', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '200px 1fr', gap: esMobil ? '0' : '3rem', alignItems: 'start' }}>

        {/* ── SIDEBAR DESKTOP ──────────────────────────────────────────── */}
        {!esMobil && (
          <div style={{ position: 'sticky', top: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1d1d1d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
                {t('Filtros', 'Filters')}
              </span>
              {chips.length > 0 && <button onClick={clearAll} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#55624c', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}>{t('Limpiar', 'Clear all')}</button>}
            </div>
            <SidebarContent />
          </div>
        )}

        {/* ── CATÁLOGO ─────────────────────────────────────────────────── */}
        <div>

          {/* Filtros móvil + chips */}
          <div style={{ marginBottom: chips.length > 0 || esMobil ? '1.25rem' : '0' }}>
            {esMobil && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: chips.length > 0 ? '0.75rem' : '0' }}>
                <button onClick={() => setFiltersOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', background: 'white', border: '1px solid #e2ddd6', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: '#1d1d1d' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
                  {t('Filtros', 'Filters')} {chips.length > 0 && <span style={{ background: '#55624c', color: 'white', borderRadius: '20px', padding: '1px 7px', fontSize: '10px', fontWeight: 700 }}>{chips.length}</span>}
                </button>
                <span style={{ fontSize: '0.72rem', color: '#9a9a9a' }}>{filtered.length} {t('piezas', 'styles')}</span>
              </div>
            )}
            {/* Chips activos */}
            {chips.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                {chips.map((chip, i) => (
                  <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#f0f4ef', border: '1px solid #c8dbc4', borderRadius: '20px', fontSize: '11px', fontWeight: 500, color: '#3a4f33' }}>
                    {chip.label}
                    <button onClick={() => removeChip(chip)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7a5e', fontSize: '14px', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center' }}>×</button>
                  </div>
                ))}
                <button onClick={clearAll} style={{ background: 'none', border: 'none', fontSize: '11px', color: '#9a9a9a', cursor: 'pointer', fontFamily: 'var(--font-sans)', textDecoration: 'underline' }}>{t('Limpiar todo', 'Clear all')}</button>
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#9a9a9a', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 300 }}>{t('Cargando...', 'Loading...')}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: esMobil ? '12px' : '20px' }}>
              {filtered.map(a => (
                <Link key={a.id} href={`/armazon/${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div
                    style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.4s ease', cursor: 'pointer' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(-4px)';
                      el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.09)';
                      el.style.borderColor = 'rgba(85,98,76,0.15)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                      el.style.borderColor = 'rgba(0,0,0,0.04)';
                    }}
                  >
                    {/* Imagen */}
                    <div style={{ aspectRatio: '4/3', background: '#faf9f7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', padding: esMobil ? '1rem' : '1.5rem', boxSizing: 'border-box' }}>
                      {a.imagen_url ? (
                        <img
                          src={a.imagen_url}
                          alt={a.nombre}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s ease' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      ) : (
                        <svg width="80" height="44" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.2 }}>
                          <rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                          <rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                          <path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                        </svg>
                      )}
                      {/* Badge */}
                      {a.badge && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: a.badge?.toLowerCase() === 'popular' ? '#1d1d1d' : '#55624c', color: 'white' }}>
                          {a.badge}
                        </div>
                      )}
                      {/* Wishlist */}
                      <button onClick={e => e.preventDefault()} style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '50%', background: 'white', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6f6a63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                    {/* Info */}
                    <div style={{ padding: esMobil ? '0.75rem' : '1rem 1.25rem 1.25rem' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '0.95rem' : '1.1rem', fontWeight: 400, color: '#1d1d1d', marginBottom: '2px', letterSpacing: '-0.01em' }}>{a.nombre}</div>
                      {a.material && <div style={{ fontSize: '0.72rem', color: '#9a9a9a', marginBottom: '8px', textTransform: 'capitalize' }}>{a.material}</div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1d' }}>
                          {t('Desde', 'From')} ${a.precio}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#55624c' }}>
                          {t('Ver', 'View')} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', color: '#9a9a9a' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 300, marginBottom: '0.5rem' }}>{t('Sin resultados', 'No results found')}</div>
                  <button onClick={clearAll} style={{ background: 'none', border: 'none', color: '#55624c', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}>{t('Limpiar filtros', 'Clear filters')}</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── WHY VERLY ────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderTop: '1px solid #e2ddd6', padding: esMobil ? '3rem 1.25rem' : '5rem 3rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '1.8rem' : '2.2rem', fontWeight: 400, textAlign: 'center', color: '#1d1d1d', margin: '0 0 3rem', letterSpacing: '-0.02em' }}>
            {t('¿Por qué Verly?', 'Why Verly?')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: esMobil ? '2rem' : '3rem' }}>
            {[
              {
                icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#55624c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>),
                title: t('Envío rápido', 'Fast delivery'),
                desc: t('Envío gratis en pedidos +$69. Recibe tus lentes en 5–7 días.', 'Free shipping over $69 and easy returns.'),
              },
              {
                icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#55624c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>),
                title: t('Micas accesibles', 'Affordable lenses'),
                desc: t('Calidad premium sin el precio de una óptica tradicional.', 'Premium quality lenses without the premium price.'),
              },
              {
                icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#55624c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>),
                title: t('Receta fácil', 'Easy prescription upload'),
                desc: t('Sube tu receta en segundos. Manual o con foto.', 'Upload your prescription in seconds, manually or by photo.'),
              },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: esMobil ? 'row' : 'column', gap: esMobil ? '1rem' : '1.25rem', alignItems: esMobil ? 'flex-start' : 'center', textAlign: esMobil ? 'left' : 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0f4ef', border: '1px solid #c8dbc4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: '#1d1d1d', marginBottom: '6px' }}>{b.title}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#6f6a63', lineHeight: 1.7 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DRAWER FILTROS MÓVIL ─────────────────────────────────────────── */}
      {esMobil && (
        <>
          {filtersOpen && <div onClick={() => setFiltersOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: 'white', borderRadius: '16px 16px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.12)', transform: filtersOpen ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', maxHeight: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header drawer */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0ede8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1d' }}>{t('Filtros', 'Filters')}</span>
              <button onClick={() => setFiltersOpen(false)} style={{ background: '#f5f3ef', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#6f6a63' }}>×</button>
            </div>
            {/* Contenido filtros */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem' }}>
              <SidebarContent />
            </div>
            {/* Footer botones */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f0ede8', display: 'flex', gap: '10px', flexShrink: 0, background: 'white' }}>
              <button onClick={() => { clearAll(); setFiltersOpen(false); }} style={{ flex: 1, background: 'white', border: '1px solid #e2ddd6', borderRadius: '8px', padding: '13px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: '#6f6a63' }}>{t('Limpiar todo', 'Clear all')}</button>
              <button onClick={() => setFiltersOpen(false)} style={{ flex: 2, background: '#55624c', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', color: 'white', letterSpacing: '0.06em' }}>
                {t('Aplicar', 'Apply filters')} {chips.length > 0 && `(${chips.length})`}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </main>
  );
}