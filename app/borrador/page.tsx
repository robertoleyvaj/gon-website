// /borrador — Home nuevo de GON, versión de trabajo (estilo Meta: imágenes grandes, menú desplegable).
// Se va esculpiendo aquí; cuando Rob lo apruebe, reemplaza a la portada.
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { precioGon, mxn } from '../lib/precio-gon';

type Arm = { id: number; nombre: string; genero: string; precio: number; optica: number; foto: string };

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

function useArmazones() {
  const [arms, setArms] = useState<Arm[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('armazones').select('*')
        .eq('activo', true).eq('publicar_gon', true).eq('tipo', 'optico').order('id', { ascending: false }).limit(200);
      const lista = (data || []) as any[];
      if (!lista.length) return;
      const { data: cols } = await supabase.from('armazon_colores').select('armazon_id, imagen_url, orden')
        .in('armazon_id', lista.map(a => a.id)).eq('publicar_gon', true).order('orden');
      const foto: Record<number, string> = {};
      for (const c of cols || []) if (c.imagen_url && !foto[c.armazon_id]) foto[c.armazon_id] = c.imagen_url;
      setArms(lista
        .map(a => ({ id: a.id, nombre: a.nombre || a.modelo, genero: a.genero || '', precio: precioGon(a), optica: Number(a.precio_gon) || 0, foto: foto[a.id] || a.imagen_url }))
        .filter(a => a.foto));
    })();
  }, []);
  return arms;
}

const EXPLORAR = [
  { t: 'Hombre', href: '/Tienda?genero=hombre' },
  { t: 'Mujer', href: '/Tienda?genero=mujer' },
  { t: 'Unisex', href: '/Tienda?genero=unisex' },
  { t: 'Niños', href: '/Tienda?genero=nino' },
  { t: 'Micas', href: '/lenses' },
];
const COMPRAR = [
  { t: 'Todos los armazones', href: '/Tienda' },
  { t: 'Examen de la vista', href: '/examen' },
  { t: 'Ubicaciones', href: '/ubicaciones' },
];

function MiniArm({ a }: { a: Arm }) {
  return (
    <Link href={`/armazon/${a.id}`} className="mm-arm">
      <span className="mm-arm-img"><img src={a.foto} alt={a.nombre} /></span>
      <span className="mm-arm-n">{a.nombre}</span>
      <span className="mm-arm-p">{mxn(a.precio)}</span>
    </Link>
  );
}

function Header({ destacados }: { destacados: Arm[] }) {
  const [abierto, setAbierto] = useState(false);
  const [movil, setMovil] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Abrir con un pequeño retraso (para no abrir al pasar de largo) y cerrar casi al instante
  const entrar = () => { if (t.current) clearTimeout(t.current); t.current = setTimeout(() => setAbierto(true), 90); };
  const salir = () => { if (t.current) clearTimeout(t.current); t.current = setTimeout(() => setAbierto(false), 120); };
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAbierto(false); setMovil(false); } };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);
  useEffect(() => { document.body.style.overflow = movil ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [movil]);

  return (
    <>
      <header className={`hd ${abierto ? 'abierto' : ''}`} onMouseLeave={salir}>
        <div className="hd-in">
          <Link href="/" className="hd-logo" aria-label="GON Ópticas"><img src="/logo-gon.png" alt="GON" /></Link>
          <nav className="hd-nav">
            <button className={`hd-link ${abierto ? 'on' : ''}`} onMouseEnter={entrar} onFocus={entrar} onClick={() => setAbierto(a => !a)} aria-expanded={abierto}>Armazones</button>
            <Link href="/lenses" className="hd-link" onMouseEnter={salir}>Micas</Link>
            <Link href="/ubicaciones" className="hd-link" onMouseEnter={salir}>Ópticas</Link>
          </nav>
          <div className="hd-der">
            <Link href="/examen" className="hd-cta">Agenda tu examen</Link>
            <button className="hd-burger" aria-label="Menú" onClick={() => setMovil(true)}><span /><span /></button>
          </div>
        </div>

        {/* Menú desplegable (escritorio) */}
        <div className="mm" onMouseEnter={entrar} aria-hidden={!abierto}>
          <div className="mm-in">
            <div className="mm-col">
              <p className="mm-k">Explorar</p>
              {EXPLORAR.map(x => <Link key={x.t} href={x.href} className="mm-l" onClick={() => setAbierto(false)}>{x.t}</Link>)}
            </div>
            <div className="mm-col">
              <p className="mm-k">Comprar</p>
              {COMPRAR.map(x => <Link key={x.t} href={x.href} className="mm-l mm-l2" onClick={() => setAbierto(false)}>{x.t}</Link>)}
            </div>
            <div className="mm-arms">{destacados.slice(0, 3).map(a => <MiniArm key={a.id} a={a} />)}</div>
          </div>
        </div>
      </header>
      <div className={`velo ${abierto ? 'on' : ''}`} onMouseEnter={salir} aria-hidden="true" />

      {/* Menú en celular: hoja a pantalla completa */}
      <div className={`sheet ${movil ? 'on' : ''}`} aria-hidden={!movil}>
        <div className="sheet-top">
          <img src="/logo-gon.png" alt="GON" className="sheet-logo" />
          <button className="sheet-x" aria-label="Cerrar" onClick={() => setMovil(false)}>×</button>
        </div>
        <div className="sheet-body">
          <p className="mm-k">Explorar</p>
          {EXPLORAR.map((x, i) => <Link key={x.t} href={x.href} className="sheet-l" style={{ transitionDelay: movil ? `${60 + i * 35}ms` : '0ms' }} onClick={() => setMovil(false)}>{x.t}</Link>)}
          <p className="mm-k" style={{ marginTop: 28 }}>Comprar</p>
          {COMPRAR.map(x => <Link key={x.t} href={x.href} className="sheet-l2" onClick={() => setMovil(false)}>{x.t}</Link>)}
          <div className="sheet-arms">{destacados.slice(0, 6).map(a => <MiniArm key={a.id} a={a} />)}</div>
        </div>
      </div>
    </>
  );
}

export default function Borrador() {
  const arms = useArmazones();
  const deGenero = (g: string) => arms.find(a => a.genero === g);
  const categorias = [
    { t: 'Hombre', g: 'hombre', href: '/Tienda?genero=hombre', bg: '#E9EDF3' },
    { t: 'Mujer', g: 'mujer', href: '/Tienda?genero=mujer', bg: '#F4ECEA' },
    { t: 'Unisex', g: 'unisex', href: '/Tienda?genero=unisex', bg: '#ECEFEA' },
  ];
  const usados = new Set(categorias.map(c => deGenero(c.g)?.id));
  const destacados = arms.filter(a => !usados.has(a.id));

  return (
    <main className="bd">
      <style>{CSS}</style>
      <Header destacados={destacados} />

      {/* Hero: aquí irá el video. Mientras, un armazón real grande. */}
      <section className="hero">
        <div className="hero-media">
          {arms[0] && <img src={arms[0].foto} alt="" className="hero-img" />}
          <span className="hero-nota">Aquí va el video</span>
        </div>
        <div className="hero-copy">
          <h1>Encuentra tus lentes.</h1>
          <p>Examen de la vista gratis en nuestras ópticas de Rosarito.</p>
          <div className="hero-btns">
            <Link href="/Tienda" className="btn">Ver armazones</Link>
            <Link href="/examen" className="btn btn-2">Agenda tu examen</Link>
          </div>
        </div>
      </section>

      {/* Tres categorías */}
      <section className="sec">
        <div className="cats">
          {categorias.map(c => {
            const a = deGenero(c.g);
            return (
              <Link key={c.g} href={c.href} className="cat" style={{ background: c.bg }}>
                {a && <img src={a.foto} alt="" className="cat-img" />}
                <span className="cat-t">{c.t}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Armazones destacados */}
      <section className="sec">
        <div className="sec-h"><h2>Lo más nuevo</h2><Link href="/Tienda" className="sec-a">Ver todo</Link></div>
        <div className="prods">
          {destacados.slice(3, 11).map(a => (
            <Link key={a.id} href={`/armazon/${a.id}`} className="prod">
              <span className="prod-img"><img src={a.foto} alt={a.nombre} loading="lazy" /></span>
              <span className="prod-n">{a.nombre}</span>
              <span className="prod-p">{mxn(a.precio)} {a.optica > a.precio && <s>{mxn(a.optica)}</s>}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section className="sec">
        <div className="tiles">
          <Link href="/examen" className="tile"><b>Examen de la vista</b><span>Gratis, en cualquiera de nuestras ópticas.</span></Link>
          <Link href="/ubicaciones" className="tile"><b>3 ópticas en Rosarito</b><span>Baja Visión, 5 de Mayo y Plaza Laureles.</span></Link>
          <Link href="/Tienda" className="tile"><b>Aparta en línea</b><span>Desde $100 y recoge en tu óptica.</span></Link>
        </div>
      </section>

      <footer className="ft">GON Ópticas · Playas de Rosarito, B.C.</footer>
    </main>
  );
}

const CSS = `
.bd{--ink:#0B1220;--navy:#1B2F5E;--gray:#6B7280;--line:rgba(11,18,32,.08);--ease:${EASE};background:#fff;color:var(--ink);font-family:Inter,system-ui,sans-serif;min-height:100svh}
.bd a{color:inherit;text-decoration:none}
.bd img{-webkit-user-drag:none}
.btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 24px;border-radius:999px;background:var(--navy);color:#fff!important;font-weight:600;font-size:15px;transition:transform 160ms var(--ease),background 200ms ease;touch-action:manipulation;user-select:none}
.btn:active{transform:scale(.97)}
.btn-2{background:transparent;color:var(--ink)!important;box-shadow:inset 0 0 0 1px rgba(11,18,32,.18)}

/* Header + menú desplegable */
.hd{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.86);backdrop-filter:saturate(1.6) blur(14px);-webkit-backdrop-filter:saturate(1.6) blur(14px)}
.hd-in{max-width:1280px;margin:0 auto;height:64px;padding:0 24px;display:flex;align-items:center;gap:32px}
.hd-logo img{height:26px;width:auto;display:block}
.hd-nav{display:flex;gap:6px;flex:1}
.hd-link{height:36px;padding:0 14px;border-radius:999px;border:0;background:transparent;font:inherit;font-size:15px;color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;transition:background 200ms ease}
.hd-link.on{background:rgba(11,18,32,.06)}
@media (hover:hover) and (pointer:fine){.hd-link:hover{background:rgba(11,18,32,.06)}}
.hd-der{display:flex;align-items:center;gap:10px}
.hd-cta{height:38px;padding:0 18px;border-radius:999px;background:var(--navy);color:#fff!important;font-size:14px;font-weight:600;display:inline-flex;align-items:center;transition:transform 160ms var(--ease)}
.hd-cta:active{transform:scale(.97)}
.hd-burger{display:none;width:40px;height:40px;border:0;background:transparent;flex-direction:column;justify-content:center;gap:6px;align-items:center;cursor:pointer}
.hd-burger span{width:20px;height:1.5px;background:var(--ink);display:block}
.mm{position:absolute;left:0;right:0;top:64px;background:#fff;border-bottom:1px solid var(--line);clip-path:inset(0 0 100% 0);opacity:0;pointer-events:none;transition:clip-path 320ms var(--ease),opacity 200ms ease}
.hd.abierto .mm{clip-path:inset(0 0 0 0);opacity:1;pointer-events:auto}
.mm-in{max-width:1280px;margin:0 auto;padding:36px 24px 44px;display:grid;grid-template-columns:220px 220px 1fr;gap:40px}
.mm-k{font-size:13px;color:var(--gray);margin:0 0 14px}
.mm-l{display:block;font-size:22px;letter-spacing:-.01em;padding:5px 0;transition:color 150ms ease}
.mm-l2{font-size:17px;padding:7px 0}
@media (hover:hover) and (pointer:fine){.mm-l:hover{color:var(--navy)}}
.mm-col>*{opacity:0;transform:translateY(6px);transition:opacity 260ms ease,transform 320ms var(--ease)}
.hd.abierto .mm-col>*{opacity:1;transform:none}
.hd.abierto .mm-col>*:nth-child(2){transition-delay:30ms}.hd.abierto .mm-col>*:nth-child(3){transition-delay:60ms}.hd.abierto .mm-col>*:nth-child(4){transition-delay:90ms}.hd.abierto .mm-col>*:nth-child(5){transition-delay:120ms}.hd.abierto .mm-col>*:nth-child(6){transition-delay:150ms}
.mm-arms{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.mm-arm{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px}
.mm-arm-img{width:100%;aspect-ratio:16/10;display:grid;place-items:center;transition:transform 380ms var(--ease)}
.mm-arm-img img{max-width:88%;max-height:88%;object-fit:contain;mix-blend-mode:multiply}
@media (hover:hover) and (pointer:fine){.mm-arm:hover .mm-arm-img{transform:translateY(-8px)}}
.mm-arm-n{font-size:15px;font-weight:600}
.mm-arm-p{font-size:14px;color:var(--gray)}
.velo{position:fixed;inset:0;z-index:30;background:rgba(255,255,255,.4);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);opacity:0;pointer-events:none;transition:opacity 260ms ease}
.velo.on{opacity:1;pointer-events:auto}

.sheet{position:fixed;inset:0;z-index:60;background:#fff;transform:translateY(-100%);transition:transform 420ms cubic-bezier(0.32,0.72,0,1);display:flex;flex-direction:column}
.sheet.on{transform:none}
.sheet-top{height:64px;padding:0 20px;display:flex;align-items:center;justify-content:space-between}
.sheet-logo{height:24px}
.sheet-x{width:44px;height:44px;border:0;background:transparent;font-size:32px;line-height:1;color:var(--ink)}
.sheet-body{padding:12px 24px calc(32px + env(safe-area-inset-bottom));overflow-y:auto;overscroll-behavior:contain}
.sheet-l{display:block;font-size:34px;letter-spacing:-.02em;font-weight:600;padding:6px 0;opacity:0;transform:translateY(10px);transition:opacity 300ms ease,transform 400ms var(--ease)}
.sheet.on .sheet-l{opacity:1;transform:none}
.sheet-l2{display:block;font-size:19px;padding:8px 0}
.sheet-arms{display:flex;gap:16px;overflow-x:auto;margin:28px -24px 0;padding:0 24px;scroll-snap-type:x mandatory;scrollbar-width:none}
.sheet-arms::-webkit-scrollbar{display:none}
.sheet-arms .mm-arm{flex:0 0 46%;scroll-snap-align:start;background:#F5F6F8;border-radius:18px;padding:12px}

/* Hero */
.hero{max-width:1280px;margin:0 auto;padding:12px 24px 0}
.hero-media{position:relative;height:min(68vh,640px);border-radius:28px;background:#EEF0F3;overflow:hidden;display:grid;place-items:center}
.hero-img{width:min(78%,820px);mix-blend-mode:multiply;animation:heroIn 900ms var(--ease) both}
.hero-nota{position:absolute;top:16px;left:16px;font-size:12px;color:var(--gray);background:#fff;border-radius:999px;padding:5px 10px}
@keyframes heroIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
.hero-copy{text-align:center;padding:40px 0 8px}
.hero-copy h1{margin:0;font-size:clamp(36px,6vw,72px);letter-spacing:-.04em;line-height:1.02;font-weight:700}
.hero-copy p{margin:12px 0 0;color:var(--gray);font-size:17px}
.hero-btns{display:flex;gap:10px;justify-content:center;margin-top:24px;flex-wrap:wrap}

/* Secciones */
.sec{max-width:1280px;margin:0 auto;padding:72px 24px 0}
.sec-h{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:22px}
.sec-h h2{margin:0;font-size:clamp(26px,3.4vw,40px);letter-spacing:-.03em;font-weight:700}
.sec-a{font-size:15px;color:var(--navy)!important;font-weight:600}
.cats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.cat{position:relative;aspect-ratio:4/5;border-radius:24px;overflow:hidden;display:grid;place-items:center}
.cat-img{width:84%;mix-blend-mode:multiply;transition:transform 500ms var(--ease)}
@media (hover:hover) and (pointer:fine){.cat:hover .cat-img{transform:translateY(-10px) scale(1.03)}}
.cat-t{position:absolute;left:22px;bottom:20px;font-size:26px;font-weight:700;letter-spacing:-.02em}
.prods{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.prod{display:flex;flex-direction:column;gap:4px}
.prod-img{aspect-ratio:4/3;background:#F5F6F8;border-radius:20px;display:grid;place-items:center;transition:transform 380ms var(--ease)}
.prod-img img{max-width:84%;max-height:84%;object-fit:contain;mix-blend-mode:multiply}
@media (hover:hover) and (pointer:fine){.prod:hover .prod-img{transform:translateY(-6px)}}
.prod-n{margin-top:8px;font-size:15px;font-weight:600}
.prod-p{font-size:14px;color:var(--navy);font-weight:600}.prod-p s{color:#9CA3AF;font-weight:400;margin-left:4px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.tile{background:#F5F6F8;border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:6px;min-height:150px;transition:transform 200ms var(--ease)}
.tile:active{transform:scale(.98)}
.tile b{font-size:20px;letter-spacing:-.01em}.tile span{color:var(--gray);font-size:15px}
.ft{padding:72px 24px 48px;text-align:center;color:#9CA3AF;font-size:13px}

@media (max-width:860px){
  .hd-nav,.hd-cta{display:none}
  .hd-in{justify-content:space-between;padding:0 16px}
  .hd-burger{display:flex}
  .mm,.velo{display:none}
  .hero{padding:8px 12px 0}
  .hero-media{height:52svh;border-radius:22px}
  .sec{padding:56px 16px 0}
  .cats{grid-template-columns:1fr;gap:12px}
  .cat{aspect-ratio:16/11}
  .prods{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .tiles{grid-template-columns:1fr;gap:12px}
}
@media (prefers-reduced-motion:reduce){
  .hero-img{animation:none}
  .mm,.sheet,.sheet-l,.mm-col>*{transition:none}
}
`;
