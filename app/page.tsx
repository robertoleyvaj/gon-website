// app/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { supabase } from './lib/supabase';
import { usePrecios, redondearMXN } from './hooks/usePrecios';

type Armazon = {
  id: number;
  nombre: string;
  forma: string;
  precio: number;
  color: string;
  imagen_url?: string;
  badge?: string;
};

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'none' }) {
  const { ref, visible } = useScrollReveal();
  const transforms: Record<string, string> = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)', none: 'none' };
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : transforms[direction], transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  const [armazones, setArmazones] = useState<Armazon[]>([]);
  const [esMobil, setEsMobil] = useState(false);
  const { tipoCambio } = usePrecios();

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('armazones').select('*').eq('activo', true).order('id').limit(8);
      setArmazones(data || []);
    }
    cargar();
  }, []);

  return (
    <main style={{ fontFamily: 'var(--font-sans)', margin: 0, padding: 0, background: 'var(--cream)', color: 'var(--charcoal)', overflowX: 'hidden' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img src="/hero-man.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(244,247,250,0.97) 0%, rgba(244,247,250,0.88) 38%, rgba(244,247,250,0.0) 65%)' }}/>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1180px', margin: '0 auto', padding: esMobil ? '80px 1.5rem 2rem' : '0 2rem' }}>
          {!esMobil && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.25rem' }}>
            Grupo Óptico del Noroeste — Est. 2012
          </p>}
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2.2rem' : 'clamp(2.8rem, 4.5vw, 4rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--charcoal)', marginBottom: '1rem', maxWidth: '580px' }}>
            Tu visión.<br />Nuestra prioridad.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Siempre cerca de ti.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: esMobil ? '13px' : '15px', color: 'var(--warm-gray)', lineHeight: 1.8, marginBottom: esMobil ? '1.5rem' : '2.5rem', maxWidth: '400px', fontWeight: 400 }}>
            Armazones modernos, lentes de calidad y examen de la vista profesional en Rosarito.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/Tienda" style={{ background: 'var(--sage)', color: 'white', padding: '15px 36px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
              Ver armazones
            </Link>
            <Link href="/lenses" style={{ background: 'rgba(255,255,255,0.85)', color: 'var(--charcoal)', padding: '14px 28px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid var(--border)', display: 'inline-block', backdropFilter: 'blur(8px)' }}>
              Ver lentes
            </Link>
          </div>
        </div>

        {/* Tarjeta flotante */}
        {!esMobil && <div style={{ position: 'absolute', bottom: '3rem', right: '3rem', background: 'white', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 8px 40px rgba(27,58,107,0.12)', maxWidth: '260px', border: '1px solid var(--border)', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)' }}>Recoge en óptica</span>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--warm-gray)', lineHeight: 1.6, margin: 0 }}>
            Compra en línea y recoge en cualquiera de nuestras ópticas en Rosarito.
          </p>
        </div>}

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.3, zIndex: 2 }}>
          <div style={{ width: '1px', height: '48px', background: 'var(--charcoal)' }}/>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="var(--charcoal)" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <Reveal>
        <section style={{ background: 'white', padding: '6rem 2rem' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>Cómo funciona</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 400, color: 'var(--charcoal)', margin: 0, lineHeight: 1.05 }}>
                Cuatro pasos simples.<br/>Mejor visión.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: esMobil ? '1rem' : '2rem' }}>
              {[
                { num: '1', icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg>), label: 'Elige tus lentes', desc: 'Explora nuestra colección de armazones.' },
                { num: '2', icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>), label: 'Personaliza', desc: 'Selecciona el tipo de visión, material y filtros.' },
                { num: '3', icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>), label: 'Paga seguro', desc: 'Paga en línea con total seguridad a través de Stripe.' },
                { num: '4', icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>), label: 'Recoge en óptica', desc: 'Te avisamos cuando tu pedido esté listo para recoger.' },
              ].map((paso, i) => (
                <Reveal key={i} delay={i * 100} direction="up">
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--cream)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                      {paso.icon}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                      {paso.num}. {paso.label}
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--warm-gray)', lineHeight: 1.7, margin: 0 }}>{paso.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ARMAZONES DESTACADOS */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1180px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 6px' }}>Catálogo</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: 'var(--charcoal)', margin: 0 }}>Armazones destacados</h2>
            </div>
            <Link href="/Tienda" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--warm-gray)', textDecoration: 'none', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Ver todos <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: esMobil ? '10px' : '1.25rem' }}>
          {armazones.slice(0, 4).map((a, i) => (
            <Reveal key={a.id} delay={i * 80} direction="up">
              <Link href={`/armazon/${a.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.35s ease', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(27,58,107,0.10)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ aspectRatio: '4/3', background: 'var(--cream)', overflow: 'hidden', position: 'relative' }}>
                    {a.imagen_url
                      ? <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', boxSizing: 'border-box' }}/>
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="70" height="38" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.12 }}>
                            <rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                            <rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                            <path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                          </svg>
                        </div>}
                    {a.badge && <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '3px', background: 'var(--sage)', color: 'white' }}>{a.badge}</div>}
                  </div>
                  <div style={{ padding: '1rem 1.1rem 1.1rem' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '6px' }}>{a.nombre}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)' }}>${redondearMXN(a.precio, tipoCambio)} <span style={{ fontWeight: 400, color: 'var(--warm-gray)', fontSize: '0.75rem' }}>MXN</span></div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>Ver</div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BANNER AZUL */}
      <Reveal>
        <section style={{ background: 'var(--sage)', padding: esMobil ? '3rem 1.5rem' : '5rem 2rem' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: esMobil ? '1.5rem' : '2rem' }}>
            {[
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg>), label: 'Examen de la vista', desc: 'Agenda tu cita con nuestros optometristas certificados.', link: '/examen', cta: 'Agendar examen →' },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>), label: 'Marcas que amas', desc: 'Trabajamos con las mejores marcas del mundo.', link: '/Tienda', cta: 'Ver marcas →' },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>), label: 'Promociones', desc: 'Descubre nuestras promociones y descuentos exclusivos.', link: '/Tienda', cta: 'Ver promociones →' },
              { icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.07 6.07l.82-.82a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2.04z"/></svg>), label: '¿Necesitas ayuda?', desc: 'Estamos aquí para ayudarte por WhatsApp o en tienda.', link: 'https://wa.me/526648343018', cta: 'Contactar →' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div style={{ color: 'white' }}>
                  <div style={{ marginBottom: '1rem' }}>{item.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'white', marginBottom: '0.6rem' }}>{item.label}</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '1rem' }}>{item.desc}</p>
                  <Link href={item.link} style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--accent)', textDecoration: 'none' }}>{item.cta}</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* COLECCIONES */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          {[
            { img: '/hero-hombre.jpg', titulo: 'Para él', href: '/Tienda?tipo=optico&genero=hombre' },
            { img: '/hero-mujer.jpg', titulo: 'Para ella', href: '/Tienda?tipo=optico&genero=mujer' },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 150} direction={i === 0 ? 'left' : 'right'}>
              <Link href={c.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', height: '420px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget.querySelector('img') as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { (e.currentTarget.querySelector('img') as HTMLImageElement).style.transform = 'scale(1)'; }}
                >
                  <img src={c.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', transition: 'transform 0.7s ease' }}/>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,58,107,0.7) 0%, rgba(27,58,107,0.0) 55%)' }}/>
                  <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 400, color: 'white', lineHeight: 1, marginBottom: '0.6rem' }}>{c.titulo}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>Explorar</span>
                      <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.5)' }}/>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '6rem 2rem', maxWidth: '640px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>FAQ</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: 'var(--charcoal)', margin: 0 }}>Preguntas frecuentes</h2>
          </div>
        </Reveal>
        {[
          { q: '¿Necesito cita para el examen de la vista?', a: 'Puedes agendar en línea o llegar directamente a cualquiera de nuestras ópticas en Rosarito.' },
          { q: '¿Cuánto tiempo tardan mis lentes?', a: 'Los lentes con graduación están listos en 3 a 7 días hábiles según el tratamiento.' },
          { q: '¿Cómo ingreso mi graduación?', a: 'Puedes escribir los números manualmente o subir una foto de tu receta al hacer el pedido.' },
          { q: '¿Puedo pagar en pesos?', a: 'Sí, todos nuestros precios están en pesos mexicanos y aceptamos todas las tarjetas.' },
          { q: '¿Tienen opciones para niños?', a: 'Sí, contamos con armazones especiales para niños con materiales resistentes y seguros.' },
        ].map((f, i) => (
          <Reveal key={i} delay={i * 60}>
            <details style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
              <summary style={{ padding: '1.25rem 0', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {f.q}
                <span style={{ color: 'var(--accent)', fontSize: '20px', fontWeight: 300, flexShrink: 0, marginLeft: '1rem', lineHeight: 1 }}>+</span>
              </summary>
              <div style={{ padding: '0 0 1.25rem', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--warm-gray)', lineHeight: 1.8 }}>
                {f.a}
              </div>
            </details>
          </Reveal>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--sage)', color: 'rgba(255,255,255,0.35)', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto 3rem' }}>
          <div>
            <img src="/logo-gon.png" alt="GON" style={{ height: '48px', width: 'auto', marginBottom: '1rem' }}/>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.8, maxWidth: '200px', color: 'rgba(255,255,255,0.45)' }}>Lentes accesibles para toda la familia. Rosarito, B.C.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Tienda</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ href: '/Tienda', label: 'Armazones' }, { href: '/sunglasses', label: 'Lentes de sol' }, { href: '/lenses', label: 'Tipos de lente' }].map((l, i) => (
                <a key={i} href={l.href} style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Ayuda</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '#faq', label: 'FAQ' },
                { href: 'https://wa.me/526648343018', label: 'WhatsApp' },
                { href: 'mailto:gonmx.empresas@gmail.com', label: 'Contacto' },
              ].map((l, i) => (
                <a key={i} href={l.href} style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Ubicaciones</h4>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
              Playas de Rosarito<br/>Baja California, México<br/>Tel: 664-834-3018
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '12px', maxWidth: '1100px', margin: '0 auto', color: 'rgba(255,255,255,0.2)' }}>
          2026 Grupo Óptico del Noroeste
        </div>
      </footer>

      {/* WHATSAPP FLOTANTE */}
      <a href="https://wa.me/526648343018" target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '52px', height: '52px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', zIndex: 100, transition: 'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
      </a>
    </main>
  );
}