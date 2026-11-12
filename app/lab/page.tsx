// /lab — Prototipos del nuevo Home de GON (A · B · C) para escoger viéndolos en el celular.
// Usa armazones y fotos reales de OptiOS. No está enlazado ni se indexa.
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { precioGon, mxn } from '../lib/precio-gon';
import { nombreColor, swatchColor } from '../lib/colores';

type Color = { color: string; hex?: string | null; fotos: string[] };
type Modelo = { id: number; nombre: string; marca: string; material: string; precio: number; optica: number; colores: Color[] };

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const tramo = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ─── Datos reales ───────────────────────────────────────────────────
function useModelos() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  useEffect(() => {
    (async () => {
      const { data: arms } = await supabase.from('armazones').select('*')
        .eq('activo', true).eq('publicar_gon', true).eq('tipo', 'optico').order('id', { ascending: false }).limit(200);
      const lista = (arms || []) as any[];
      if (!lista.length) return;
      const { data: cols } = await supabase.from('armazon_colores')
        .select('armazon_id, color, hex, imagen_url, imagen2_url, imagen3_url, orden')
        .in('armazon_id', lista.map(a => a.id)).eq('publicar_gon', true).order('orden');
      const por: Record<number, any[]> = {};
      for (const c of cols || []) (por[c.armazon_id] ||= []).push(c);
      const out: Modelo[] = [];
      for (const a of lista) {
        const cs: Color[] = (por[a.id] || [])
          .map(c => ({ color: c.color, hex: c.hex, fotos: [c.imagen_url, c.imagen2_url, c.imagen3_url].filter(Boolean) }))
          .filter(c => c.fotos.length);
        if (!cs.length && a.imagen_url) cs.push({ color: a.color || '', hex: null, fotos: [a.imagen_url, a.imagen2_url, a.imagen3_url].filter(Boolean) });
        if (!cs.length) continue;
        out.push({ id: a.id, nombre: a.nombre || a.modelo, marca: a.marca || '', material: a.material || '', precio: precioGon(a), optica: Number(a.precio_gon) || 0, colores: cs });
      }
      // Los que tienen más ángulos y más colores primero
      out.sort((x, y) => (y.colores.length * 2 + y.colores[0].fotos.length) - (x.colores.length * 2 + x.colores[0].fotos.length));
      setModelos(out);
    })();
  }, []);
  return modelos;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(m.matches);
    const f = () => setR(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return r;
}

// Progreso 0→1 de una sección "pegajosa" (sticky) según el scroll
function useProgreso(ref: React.RefObject<HTMLElement | null>, onFrame: (p: number) => void) {
  const cb = useRef(onFrame);
  cb.current = onFrame;
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      cb.current(total > 0 ? clamp(-r.top / total) : 0);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [ref]);
}

// ═══ A · El armazón protagonista ═══════════════════════════════════
function VarianteA({ modelos }: { modelos: Modelo[] }) {
  const m = modelos.find(x => x.colores.length >= 2 && x.colores[0].fotos.length >= 2) || modelos[0];
  const sec = useRef<HTMLElement>(null);
  const r = useRef<Record<string, HTMLElement | null>>({});
  const [colorI, setColorI] = useState(0);
  const reduce = useReducedMotion();
  const set = (k: string) => (el: HTMLElement | null) => { r.current[k] = el; };

  useProgreso(sec, p => {
    if (reduce) p = 0.95;
    const s = (k: string, css: string) => { const el = r.current[k]; if (el) el.style.cssText += css; };
    const intro = tramo(p, 0, 0.14), angulo = tramo(p, 0.18, 0.36), colores = tramo(p, 0.4, 0.6), micas = tramo(p, 0.62, 0.86), fin = tramo(p, 0.88, 0.97);
    const mobile = window.innerWidth < 768;
    // Armazón: entra, gira (cambio de ángulo), se hace a un lado para las micas
    const lado = mobile ? 0 : lerp(0, -18, micas);
    const sube = mobile ? lerp(0, -9, micas) : 0;
    s('frame', `transform: translate(${lado}vw, ${lerp(4, 0, intro) + sube}vh) scale(${lerp(0.9, 1, intro) * lerp(1, 0.86, micas)}) rotate(${lerp(-3, 0, intro)}deg);`);
    s('f0', `opacity:${1 - angulo}; filter: blur(${Math.sin(angulo * Math.PI) * 6}px);`);
    s('f1', `opacity:${angulo}; filter: blur(${Math.sin(angulo * Math.PI) * 6}px);`);
    s('t1', `opacity:${1 - tramo(p, 0.12, 0.2)}; transform: translateY(${lerp(0, -20, tramo(p, 0.12, 0.2))}px);`);
    s('t2', `opacity:${tramo(p, 0.2, 0.26) * (1 - tramo(p, 0.36, 0.4))};`);
    s('t3', `opacity:${tramo(p, 0.4, 0.45) * (1 - tramo(p, 0.58, 0.62))};`);
    s('t4', `opacity:${tramo(p, 0.62, 0.66) * (1 - fin)};`);
    ['d0', 'd1', 'd2'].forEach((k, i) => {
      const t = tramo(micas, i * 0.28, i * 0.28 + 0.36);
      s(k, `opacity:${t}; transform: translateX(${lerp(60, 0, t)}px) scale(${lerp(0.94, 1, t)});`);
    });
    s('cta', `opacity:${fin}; transform: translateY(${lerp(24, 0, fin)}px); pointer-events:${fin > 0.6 ? 'auto' : 'none'};`);
    s('bar', `transform: scaleX(${p});`);
    const n = m?.colores.length || 1;
    const ci = Math.min(n - 1, Math.floor(colores * n));
    setColorI(prev => (prev === ci ? prev : ci));
  });

  if (!m) return <Cargando />;
  const c = m.colores[colorI] || m.colores[0];
  const f0 = m.colores[0].fotos[0], f1 = m.colores[0].fotos[1] || f0;

  return (
    <section ref={sec} className="a-sec">
      <div className="a-sticky">
        <div className="a-bar" ref={set('bar')} />
        <div className="a-copy">
          <h1 ref={set('t1')} className="a-h">Tus próximos lentes.<span>Armazones reales, precio web de hasta 60% menos.</span></h1>
          <h2 ref={set('t2')} className="a-h a-h2" style={{ opacity: 0 }}>Se ve bien desde cualquier ángulo.</h2>
          <h2 ref={set('t3')} className="a-h a-h2" style={{ opacity: 0 }}>En {m.colores.length} {m.colores.length === 1 ? 'color' : 'colores'}.<span key={colorI} className="a-colorname">{nombreColor(c.color, 'es')}</span></h2>
          <h2 ref={set('t4')} className="a-h a-h2" style={{ opacity: 0 }}>Y tus micas, a tu medida.</h2>
        </div>

        <div ref={set('frame')} className="a-frame">
          {colorI === 0 ? (
            <>
              <img ref={set('f0')} src={f0} alt={m.nombre} className="a-img" />
              <img ref={set('f1')} src={f1} alt="" className="a-img" style={{ opacity: 0 }} />
            </>
          ) : (
            <img key={c.fotos[0]} src={c.fotos[0]} alt={m.nombre} className="a-img a-swap" />
          )}
        </div>

        <div className="a-discs">
          {[
            { t: 'Mica Slim HD 1.60', d: 'Más delgada y ligera', cls: 'disc-clear' },
            { t: 'Antirreflejante', d: 'Sin reflejos de noche ni en pantallas', cls: 'disc-ar' },
            { t: 'Fotocromático', d: 'Se oscurece solo con el sol', cls: 'disc-foto' },
          ].map((x, i) => (
            <div key={x.t} ref={set(`d${i}`)} className="a-disc" style={{ opacity: 0 }}>
              <span className={`disc ${x.cls}`} />
              <div><b>{x.t}</b><span>{x.d}</span></div>
            </div>
          ))}
        </div>

        <div ref={set('cta')} className="a-cta" style={{ opacity: 0 }}>
          <p className="a-cta-n">{m.nombre}</p>
          <p className="a-cta-p">{mxn(m.precio)} <s>{mxn(m.optica)}</s></p>
          <Link href={`/armazon/${m.id}`} className="btn-ink">Ver armazón</Link>
        </div>
        <p className="a-hint">Desliza ↓</p>
      </div>
    </section>
  );
}

// ═══ B · La mica en acción ═════════════════════════════════════════
const PASOS_B = [
  { k: 'sin', t: 'Sin graduación', d: 'Así ves cuando necesitas lentes: todo se ve borroso.' },
  { k: 'grad', t: 'Con tu graduación', d: 'Tu examen de la vista es gratis. A través de la mica, todo nítido.' },
  { k: 'ar', t: 'Antirreflejante', d: 'Adiós a los reflejos de luz en la mica, de día y de noche.' },
  { k: 'foto', t: 'Fotocromático', d: 'Al salir al sol se oscurece solo. Adentro vuelve a ser clara.' },
  { k: 'blue', t: 'Blue light', d: 'Filtra la luz azul de pantallas y celulares. Menos cansancio.' },
];

function Escena() {
  return (
    <g>
      <rect width="1200" height="700" fill="url(#cielo)" />
      <circle cx="930" cy="150" r="70" fill="#FFF3C4" />
      <circle cx="930" cy="150" r="120" fill="#FFF3C4" opacity=".25" />
      <path d="M0 400 Q 200 340 420 380 T 820 360 T 1200 380 V700 H0Z" fill="#9FB7C9" />
      <rect y="430" width="1200" height="270" fill="url(#mar)" />
      <path d="M0 560 Q 300 520 600 560 T 1200 550 V700 H0Z" fill="#E9D8B8" />
      {/* Letrero con letras de examen: lo nítido se nota aquí */}
      <rect x="430" y="170" width="340" height="250" rx="16" fill="#FFFFFF" />
      <rect x="430" y="170" width="340" height="250" rx="16" fill="none" stroke="#1B2F5E" strokeWidth="6" />
      <text x="600" y="255" textAnchor="middle" fontSize="78" fontWeight="700" fill="#111827" fontFamily="Inter, sans-serif">E</text>
      <text x="600" y="315" textAnchor="middle" fontSize="40" fontWeight="700" fill="#111827" letterSpacing="14" fontFamily="Inter, sans-serif">F P</text>
      <text x="600" y="358" textAnchor="middle" fontSize="28" fontWeight="700" fill="#111827" letterSpacing="10" fontFamily="Inter, sans-serif">T O Z</text>
      <text x="600" y="392" textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827" letterSpacing="7" fontFamily="Inter, sans-serif">L P E D</text>
      <rect x="592" y="420" width="16" height="150" fill="#1B2F5E" />
      <path d="M150 560 C 160 470 150 400 175 330" stroke="#5B4636" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M175 330 q -70 -10 -110 40 M175 330 q 60 -40 120 -5 M175 330 q -30 -60 -90 -55 M175 330 q 40 -60 95 -60" stroke="#3E7D5A" strokeWidth="16" fill="none" strokeLinecap="round" />
      <text x="1050" y="640" textAnchor="middle" fontSize="26" fontWeight="600" fill="#1B2F5E" opacity=".7" fontFamily="Inter, sans-serif">ROSARITO</text>
    </g>
  );
}

function VarianteB() {
  const sec = useRef<HTMLElement>(null);
  const [paso, setPaso] = useState(0);
  const reduce = useReducedMotion();
  useProgreso(sec, p => {
    const i = Math.min(PASOS_B.length - 1, Math.floor(p * PASOS_B.length * 0.999));
    setPaso(prev => (prev === i ? prev : i));
  });
  const irA = (i: number) => {
    const el = sec.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + total * ((i + 0.5) / PASOS_B.length), behavior: reduce ? 'auto' : 'smooth' });
  };
  const k = PASOS_B[paso].k;
  const nitido = paso >= 1, sinReflejo = paso >= 2, oscuro = k === 'foto', azul = k === 'blue';

  return (
    <section ref={sec} className="b-sec">
      <div className="b-sticky">
        <div className="b-head">
          <p className="b-kicker">Micas GON</p>
          <h1 className="b-h">Mira lo que hace cada mica.</h1>
        </div>
        <div className="b-stage">
          <svg viewBox="0 0 1200 700" className="b-svg" role="img" aria-label="Escena vista a través de unos lentes">
            <defs>
              <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8EC5F0" /><stop offset="1" stopColor="#DDEFFB" /></linearGradient>
              <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3D8FB8" /><stop offset="1" stopColor="#2B6E93" /></linearGradient>
              <linearGradient id="brillo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".45" stopColor="#fff" stopOpacity=".75" /><stop offset=".55" stopColor="#fff" stopOpacity=".1" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
              <filter id="borroso"><feGaussianBlur stdDeviation="9" /></filter>
              <clipPath id="micas">
                <rect x="250" y="200" width="320" height="250" rx="110" />
                <rect x="630" y="200" width="320" height="250" rx="110" />
              </clipPath>
            </defs>
            {/* Lo que ves fuera de los lentes: siempre borroso */}
            <g filter="url(#borroso)"><Escena /></g>
            <rect width="1200" height="700" fill="#2F5BFF" style={{ opacity: azul ? 0.16 : 0, transition: 'opacity 600ms ease' }} />
            {/* A través de la mica */}
            <g clipPath="url(#micas)">
              <g filter="url(#borroso)"><Escena /></g>
              <g style={{ opacity: nitido ? 1 : 0, transition: `opacity 700ms ${EASE_OUT}` }}><Escena /></g>
              <rect width="1200" height="700" fill="#1C1F26" style={{ opacity: oscuro ? 0.5 : 0, transition: 'opacity 1600ms ease' }} />
              <rect width="1200" height="700" fill="#FFB547" style={{ opacity: azul ? 0.1 : 0, transition: 'opacity 600ms ease' }} />
              <g style={{ opacity: sinReflejo ? 0 : 0.9, transition: `opacity 600ms ${EASE_OUT}` }}>
                <rect x="230" y="160" width="140" height="340" fill="url(#brillo)" transform="rotate(18 300 330)" />
                <rect x="700" y="160" width="110" height="340" fill="url(#brillo)" transform="rotate(18 760 330)" />
                <ellipse cx="860" cy="250" rx="60" ry="18" fill="#B49CFF" opacity=".35" />
              </g>
            </g>
            {/* Armazón */}
            <g fill="none" stroke="#111827" strokeWidth="16">
              <rect x="250" y="200" width="320" height="250" rx="110" />
              <rect x="630" y="200" width="320" height="250" rx="110" />
              <path d="M570 290 Q 600 262 630 290" strokeLinecap="round" />
              <path d="M250 270 L 150 250 M950 270 L 1050 250" strokeLinecap="round" />
            </g>
          </svg>
        </div>
        <div className="b-info">
          <div className="b-pills" role="tablist">
            {PASOS_B.map((x, i) => (
              <button key={x.k} role="tab" aria-selected={i === paso} onClick={() => irA(i)} className={`pill ${i === paso ? 'on' : ''}`}>{x.t}</button>
            ))}
          </div>
          <p key={paso} className="b-desc">{PASOS_B[paso].d}</p>
          <Link href="/lenses" className="b-link">Ver todas las micas →</Link>
        </div>
      </div>
    </section>
  );
}

// ═══ C · Catálogo vivo ═════════════════════════════════════════════
function Tarjeta({ m }: { m: Modelo }) {
  const [ci, setCi] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const c = m.colores[ci] || m.colores[0];
  const mover = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !card.current) return;
    const r = card.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.current.style.setProperty('--rx', `${-y * 8}deg`);
    card.current.style.setProperty('--ry', `${x * 10}deg`);
  };
  const salir = () => { card.current?.style.setProperty('--rx', '0deg'); card.current?.style.setProperty('--ry', '0deg'); };
  return (
    <div ref={card} className="c-card" onPointerMove={mover} onPointerLeave={salir}>
      <Link href={`/armazon/${m.id}`} className="c-foto" aria-label={m.nombre}>
        <img key={c.fotos[0]} src={c.fotos[0]} alt={m.nombre} className="c-img" loading="lazy" />
      </Link>
      <div className="c-meta">
        <div>
          <p className="c-n">{m.nombre}</p>
          <p className="c-p">{mxn(m.precio)} <s>{mxn(m.optica)}</s></p>
        </div>
        {m.colores.length > 1 && (
          <div className="c-dots">
            {m.colores.slice(0, 5).map((x, i) => (
              <button key={i} onClick={() => setCi(i)} aria-label={nombreColor(x.color, 'es')} className={i === ci ? 'on' : ''}
                style={{ background: swatchColor(x.color, x.hex) }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VarianteC({ modelos }: { modelos: Modelo[] }) {
  const riel = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const destacados = modelos.slice(0, 10);
  const resto = modelos.slice(10, 22);

  // En el riel: la tarjeta del centro al frente, las de los lados giradas (scroll horizontal)
  useEffect(() => {
    const el = riel.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      for (const n of Array.from(el.children) as HTMLElement[]) {
        const d = clamp((n.offsetLeft + n.offsetWidth / 2 - mid) / el.clientWidth, -1, 1);
        n.style.transform = `perspective(900px) rotateY(${d * -18}deg) scale(${1 - Math.abs(d) * 0.08})`;
        n.style.opacity = String(1 - Math.abs(d) * 0.35);
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    el.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { el.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [destacados.length]);

  // Cuadrícula: aparecen escalonadas al llegar
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '-60px' });
    el.querySelectorAll('.c-rev').forEach(n => io.observe(n));
    return () => io.disconnect();
  }, [resto.length]);

  if (!modelos.length) return <Cargando />;
  return (
    <section className="c-sec">
      <div className="c-hero">
        <h1 className="c-h">Encuentra tu armazón.</h1>
        <p className="c-sub">{modelos.length}+ modelos en nuestras ópticas de Rosarito. Precio web de hasta 60% menos.</p>
      </div>
      <div ref={riel} className="c-riel">
        {destacados.map(m => <div key={m.id} className="c-slot"><Tarjeta m={m} /></div>)}
      </div>
      <div ref={grid} className="c-grid">
        {resto.map((m, i) => <div key={m.id} className="c-rev" style={{ transitionDelay: `${(i % 4) * 60}ms` }}><Tarjeta m={m} /></div>)}
      </div>
      <div className="c-more"><Link href="/Tienda" className="btn-ink">Ver todos los armazones</Link></div>
    </section>
  );
}

function Cargando() {
  return <div style={{ minHeight: '70svh', display: 'grid', placeItems: 'center', color: '#9CA3AF', fontSize: 14 }}>Cargando armazones…</div>;
}

// ═══ Página + selector ═════════════════════════════════════════════
const VARIANTES = [
  { k: 'a', n: 'A', t: 'Protagonista' },
  { k: 'b', n: 'B', t: 'La mica' },
  { k: 'c', n: 'C', t: 'Catálogo' },
] as const;

export default function Lab() {
  const modelos = useModelos();
  const [v, setV] = useState<'a' | 'b' | 'c'>('a');
  useEffect(() => {
    const h = window.location.hash.replace('#', '');
    if (h === 'a' || h === 'b' || h === 'c') setV(h);
  }, []);
  const cambiar = (k: 'a' | 'b' | 'c') => { setV(k); history.replaceState(null, '', `#${k}`); window.scrollTo({ top: 0 }); };
  const vista = useMemo(() => v === 'a' ? <VarianteA modelos={modelos} /> : v === 'b' ? <VarianteB /> : <VarianteC modelos={modelos} />, [v, modelos]);

  return (
    <main className="lab">
      <style>{CSS}</style>
      <header className="lab-top"><span className="lab-logo">gon</span><span className="lab-tag">Prototipo del Home</span></header>
      {vista}
      {v !== 'c' && (
        <section className="lab-after">
          <p>Aquí seguiría el resto del Home (catálogo, ópticas, examen gratis…).</p>
        </section>
      )}
      <nav className="lab-switch" aria-label="Escoger versión">
        {VARIANTES.map(x => (
          <button key={x.k} onClick={() => cambiar(x.k)} className={v === x.k ? 'on' : ''}><b>{x.n}</b>{x.t}</button>
        ))}
      </nav>
    </main>
  );
}

const CSS = `
.lab{--ink:#0B1220;--navy:#1B2F5E;--teal:#2DBFB8;--ease-out:${EASE_OUT};background:#F5F6F8;color:var(--ink);min-height:100svh;font-family:Inter,system-ui,sans-serif}
.lab img{-webkit-user-drag:none;user-select:none}
.lab-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:rgba(245,246,248,.8);backdrop-filter:saturate(1.6) blur(12px);-webkit-backdrop-filter:saturate(1.6) blur(12px)}
.lab-logo{font-weight:800;font-size:22px;letter-spacing:-.04em;color:var(--navy)}
.lab-tag{font-size:12px;color:#6B7280}
.btn-ink{display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 26px;border-radius:999px;background:var(--navy);color:#fff;font-weight:600;font-size:15px;text-decoration:none;transition:transform 160ms var(--ease-out)}
.btn-ink:active{transform:scale(.97)}
.lab-after{padding:80px 24px 140px;text-align:center;color:#9CA3AF;font-size:14px}
.lab-switch{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:50;display:flex;gap:4px;padding:5px;border-radius:999px;background:rgba(11,18,32,.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lab-switch button{display:flex;align-items:center;gap:6px;height:38px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,.7);font-size:13px;cursor:pointer;touch-action:manipulation;user-select:none;transition:background 200ms ease,color 200ms ease}
.lab-switch button b{font-size:12px;opacity:.6}
.lab-switch button.on{background:#fff;color:var(--ink)}

/* A */
.a-sec{height:460vh;position:relative}
.a-sticky{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;align-items:center;justify-content:center}
.a-bar{position:absolute;top:0;left:0;right:0;height:2px;background:var(--teal);transform-origin:0 50%;transform:scaleX(0)}
.a-copy{position:absolute;top:12vh;left:0;right:0;text-align:center;padding:0 24px}
.a-h{position:absolute;left:0;right:0;margin:0 auto;max-width:760px;font-size:clamp(34px,6.4vw,76px);line-height:1.02;letter-spacing:-.035em;font-weight:700}
.a-h span{display:block;margin-top:14px;font-size:clamp(15px,1.6vw,19px);letter-spacing:0;font-weight:400;color:#6B7280;line-height:1.4}
.a-h2{font-size:clamp(28px,5vw,60px)}
.a-colorname{animation:aSwap 500ms var(--ease-out)}
.a-frame{position:relative;width:min(86vw,760px);aspect-ratio:16/10;margin-top:12vh;will-change:transform}
.a-img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
.a-swap{animation:aSwap 520ms var(--ease-out)}
@keyframes aSwap{from{opacity:0;filter:blur(6px);transform:scale(.98)}to{opacity:1;filter:blur(0);transform:none}}
.a-discs{position:absolute;right:6vw;top:50%;transform:translateY(-30%);display:flex;flex-direction:column;gap:14px;width:320px}
.a-disc{display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;padding:14px 16px;box-shadow:0 1px 2px rgba(16,24,40,.04),0 8px 24px -12px rgba(16,24,40,.18)}
.a-disc b{display:block;font-size:15px}.a-disc span{font-size:13px;color:#6B7280}
.disc{width:44px;height:44px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
.disc-clear{background:radial-gradient(circle at 35% 30%,#fff,#EEF2F6 60%,#DCE3EA)}
.disc-ar{background:conic-gradient(from 200deg,#E9FFF6,#B9A7FF,#7FE3C9,#E9FFF6)}
.disc-foto{background:radial-gradient(circle at 35% 30%,#9CA3AF,#4B5563 60%,#1F2937)}
.a-cta{position:absolute;bottom:14vh;left:0;right:0;text-align:center}
.a-cta-n{font-size:22px;font-weight:700;margin:0}
.a-cta-p{font-size:17px;margin:4px 0 16px;color:var(--navy);font-weight:600}.a-cta-p s{color:#9CA3AF;font-weight:400;margin-left:6px}
.a-hint{position:absolute;bottom:calc(84px + env(safe-area-inset-bottom));left:0;right:0;text-align:center;font-size:12px;color:#9CA3AF;letter-spacing:.08em}
@media (max-width:767px){
  .a-copy{top:9vh}
  .a-frame{margin-top:4vh}
  .a-discs{left:20px;right:20px;width:auto;top:auto;bottom:calc(92px + env(safe-area-inset-bottom));transform:none;gap:8px}
  .a-disc{padding:10px 12px;border-radius:14px}.disc{width:34px;height:34px}
}

/* B */
.b-sec{height:520vh;position:relative;background:#0B1220;color:#fff}
.b-sticky{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:2vh;padding:64px 20px 110px;overflow:hidden}
.b-head{text-align:center}
.b-kicker{margin:0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--teal)}
.b-h{margin:8px 0 0;font-size:clamp(30px,5.2vw,64px);line-height:1.03;letter-spacing:-.035em;font-weight:700}
.b-stage{width:min(100%,980px);margin:0 auto;border-radius:24px;overflow:hidden;box-shadow:0 30px 80px -30px rgba(0,0,0,.6)}
.b-svg{display:block;width:100%;height:auto}
.b-info{text-align:center}
.b-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}
.pill{height:36px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:transparent;color:rgba(255,255,255,.75);font-size:13px;cursor:pointer;touch-action:manipulation;user-select:none;transition:background 200ms ease,color 200ms ease,border-color 200ms ease}
.pill.on{background:#fff;color:#0B1220;border-color:#fff}
.b-desc{margin:14px auto 6px;max-width:520px;font-size:16px;line-height:1.5;color:rgba(255,255,255,.82);animation:aSwap 450ms var(--ease-out)}
.b-link{font-size:14px;color:var(--teal);text-decoration:none}

/* C */
.c-sec{padding-bottom:140px}
.c-hero{padding:9vh 24px 4vh;text-align:center}
.c-h{margin:0;font-size:clamp(36px,7vw,88px);line-height:1;letter-spacing:-.04em;font-weight:700;animation:cIn 700ms var(--ease-out) both}
.c-sub{margin:14px auto 0;max-width:520px;color:#6B7280;font-size:16px;animation:cIn 700ms 80ms var(--ease-out) both}
@keyframes cIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.c-riel{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:10px 12vw 30px;scrollbar-width:none;overscroll-behavior-x:contain}
.c-riel::-webkit-scrollbar{display:none}
.c-slot{flex:0 0 min(76vw,380px);scroll-snap-align:center;will-change:transform;transition:opacity 200ms ease}
.c-card{--rx:0deg;--ry:0deg;background:#fff;border-radius:24px;overflow:hidden;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform 400ms var(--ease-out),box-shadow 300ms ease;box-shadow:0 1px 2px rgba(16,24,40,.04)}
@media (hover:hover) and (pointer:fine){.c-card:hover{box-shadow:0 20px 50px -24px rgba(16,24,40,.35)}}
.c-foto{display:block;aspect-ratio:4/3;background:#F1F3F6;position:relative}
.c-img{position:absolute;inset:8%;width:84%;height:84%;object-fit:contain;mix-blend-mode:multiply;animation:aSwap 450ms var(--ease-out)}
.c-meta{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding:14px 16px 16px}
.c-n{margin:0;font-weight:600;font-size:15px}
.c-p{margin:2px 0 0;font-size:14px;color:var(--navy);font-weight:600}.c-p s{color:#9CA3AF;font-weight:400;margin-left:4px}
.c-dots{display:flex;gap:6px}
.c-dots button{width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.12);cursor:pointer;padding:0;touch-action:manipulation;transition:transform 160ms var(--ease-out)}
.c-dots button.on{box-shadow:0 0 0 1.5px var(--navy)}
.c-dots button:active{transform:scale(.9)}
.c-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:24px 16px 0;max-width:1100px;margin:0 auto}
@media (min-width:900px){.c-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}}
.c-rev{opacity:0;transform:translateY(16px);transition:opacity 500ms var(--ease-out),transform 500ms var(--ease-out)}
.c-rev.in{opacity:1;transform:none}
.c-more{text-align:center;padding-top:36px}

@media (prefers-reduced-motion:reduce){
  .a-swap,.a-colorname,.b-desc,.c-h,.c-sub,.c-img{animation:none}
  .c-rev{opacity:1;transform:none;transition:none}
  .c-card{transition:none}
}
`;
