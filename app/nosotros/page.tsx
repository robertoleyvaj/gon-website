// app/nosotros/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../components/LanguageContext';

export default function NosotrosPage() {
  const { lang } = useLang() as any;
  const [esMobil, setEsMobil] = useState(false);

  useEffect(() => {
    const check = () => setEsMobil(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const t = (es: string, en: string) => lang === 'es' ? es : en;

  const hitos = [
    { año: '2012', titulo: t('Óptica Rosarito abre sus puertas', 'Óptica Rosarito opens its doors'), desc: t('Comenzamos como un negocio familiar en el corazón de Rosarito, con la misión de ofrecer atención visual de calidad a precios accesibles.', 'We started as a family business in the heart of Rosarito, with a mission to offer quality eye care at accessible prices.') },
    { año: '2015', titulo: t('Baja Visión se une a la familia', 'Baja Visión joins the family'), desc: t('Expandimos nuestra presencia con una segunda ubicación sobre el Blvd. Benito Juárez, atendiendo a más familias rosaritenses y a visitantes internacionales.', 'We expanded our presence with a second location on Blvd. Benito Juárez, serving more families from Rosarito and international visitors.') },
    { año: '2018', titulo: t('Plaza Laureles: nuestra tercera sucursal', 'Plaza Laureles: our third location'), desc: t('Abrimos en Plaza Laureles para llegar a más rincones de la ciudad y seguir creciendo junto a nuestra comunidad.', 'We opened at Plaza Laureles to reach more parts of the city and continue growing alongside our community.') },
    { año: 'Hoy', titulo: t('La óptica más importante de Rosarito', 'The most important optical group in Rosarito'), desc: t('Tres sucursales, miles de pacientes atendidos y un equipo de licenciados en optometría comprometidos con tu salud visual.', 'Three locations, thousands of patients served, and a team of licensed optometrists committed to your vision health.') },
  ];

  const valores = [
    { icono: '◎', titulo: t('Experiencia', 'Experience'), desc: t('Más de 12 años atendiendo a pacientes de Rosarito, Tijuana y visitantes internacionales.', 'Over 12 years serving patients from Rosarito, Tijuana, and international visitors.') },
    { icono: '◈', titulo: t('Bilingüe', 'Bilingual'), desc: t('Nuestro equipo atiende en español e inglés. Todos son bienvenidos.', 'Our team serves in Spanish and English. Everyone is welcome.') },
    { icono: '◉', titulo: t('Optometristas certificados', 'Certified optometrists'), desc: t('Licenciados en Optometría por la Universidad Xochicalco. Ciencia, no intuición.', 'Licensed Optometrists from Universidad Xochicalco. Science, not guesswork.') },
    { icono: '◌', titulo: t('Para todas las edades', 'For all ages'), desc: t('Atendemos niños, adultos, adultos mayores y personas con discapacidades. Sin excepción.', 'We serve children, adults, seniors, and people with disabilities. No exceptions.') },
    { icono: '◎', titulo: t('Entrega el mismo día', 'Same-day delivery'), desc: t('Para casos urgentes, fabricamos tus lentes y te los entregamos el mismo día.', 'For urgent cases, we manufacture your lenses and deliver them the same day.') },
    { icono: '◈', titulo: t('Las mejores marcas', 'Best brands'), desc: t('Essilor, Zeiss y más. Desde opciones económicas hasta lo más avanzado del mercado.', 'Essilor, Zeiss and more. From budget-friendly options to the most advanced on the market.') },
  ];

  const servicios = [
    t('Examen de la vista gratuito', 'Free eye exam'),
    t('Lentes de contacto', 'Contact lenses'),
    t('Lentes bifocales y progresivos', 'Bifocal and progressive lenses'),
    t('Tratamientos: luz azul, fotocromático, polarizado', 'Treatments: blue light, photochromic, polarized'),
    t('Micas con y sin graduación', 'Prescription and non-prescription lenses'),
    t('Marcas premium: Essilor, Zeiss y más', 'Premium brands: Essilor, Zeiss and more'),
    t('Armazones para niños y adultos', 'Frames for children and adults'),
    t('Urgencias: entrega el mismo día', 'Urgent orders: same-day delivery'),
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--charcoal)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ paddingTop: esMobil ? '100px' : '120px', paddingBottom: esMobil ? '3rem' : '5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: esMobil ? '0 1.5rem' : '0 5rem' }}>
          <p style={{ fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 1rem' }}>
            {t('GON ÓPTICA — NUESTRA HISTORIA', 'GON ÓPTICA — OUR STORY')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '3rem' : '5rem', fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 1.5rem', lineHeight: 1.0, color: 'var(--charcoal)', maxWidth: '780px' }}>
            {t('Empezamos como familia.\nSeguimos siéndolo.', 'We started as a family.\nWe still are.')}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--warm-gray)', lineHeight: 1.8, maxWidth: '560px', margin: 0 }}>
            {t('Tres ópticas, más de 12 años de historia y miles de pacientes atendidos. Somos el grupo óptico más importante de Rosarito, B.C.', 'Three optical stores, over 12 years of history, and thousands of patients served. We are the most important optical group in Rosarito, B.C.')}
          </p>
        </div>
      </div>

      {/* NÚMEROS */}
      <div style={{ background: 'var(--sage)', padding: esMobil ? '3rem 1.5rem' : '4rem 5rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: esMobil ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { num: '+12', label: t('años de experiencia', 'years of experience') },
            { num: '3', label: t('sucursales en Rosarito', 'locations in Rosarito') },
            { num: t('Miles', 'Thousands'), label: t('de pacientes atendidos', 'of patients served') },
            { num: '100%', label: t('optometristas certificados', 'certified optometrists') },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2.5rem' : '3.5rem', fontWeight: 300, color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>{s.num}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORIA / TIMELINE */}
      <div style={{ padding: esMobil ? '3rem 1.5rem' : '5rem 5rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.75rem' }}>
            {t('NUESTRA HISTORIA', 'OUR STORY')}
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 3rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {t('De un local familiar a tres sucursales', 'From a family shop to three locations')}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(4, 1fr)', gap: '2rem' }}>
            {hitos.map((h, i) => (
              <div key={i} style={{ borderTop: '2px solid var(--accent)', paddingTop: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--sage)', marginBottom: '0.75rem' }}>{h.año}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)', margin: '0 0 0.5rem', lineHeight: 1.4 }}>{h.titulo}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', lineHeight: 1.7, margin: 0 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VALORES / POR QUÉ NOSOTROS */}
      <div style={{ background: 'var(--cream-dark)', padding: esMobil ? '3rem 1.5rem' : '5rem 5rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.75rem' }}>
            {t('¿POR QUÉ ELEGIRNOS?', 'WHY CHOOSE US?')}
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 3rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {t('Lo que nos hace diferentes', 'What makes us different')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: esMobil ? '1fr' : 'repeat(3, 1fr)', gap: '2rem' }}>
            {valores.map((v, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '4px', padding: '1.75rem', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '1rem' }}>{v.icono}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--charcoal)', margin: '0 0 0.5rem' }}>{v.titulo}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICIOS */}
      <div style={{ padding: esMobil ? '3rem 1.5rem' : '5rem 5rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: esMobil ? '1fr' : '1fr 1fr', gap: esMobil ? '2rem' : '6rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: '0 0 0.75rem' }}>
              {t('LO QUE OFRECEMOS', 'WHAT WE OFFER')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, color: 'var(--charcoal)', margin: '0 0 1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {t('Todo lo que tu vista necesita', 'Everything your eyes need')}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--warm-gray)', lineHeight: 1.8, margin: '0 0 2rem' }}>
              {t('Desde un examen preventivo hasta los lentes más avanzados del mercado. Atendemos cualquier necesidad visual, a cualquier edad.', 'From a preventive exam to the most advanced lenses on the market. We handle any visual need, at any age.')}
            </p>
            <Link href="/examen" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--sage)', color: 'white', padding: '14px 28px', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              {t('Agendar examen gratis', 'Schedule free exam')}
            </Link>
          </div>
          <div>
            {servicios.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--charcoal)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ background: 'var(--sage)', padding: esMobil ? '3rem 1.5rem' : '5rem 5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: esMobil ? '2rem' : '3rem', fontWeight: 300, color: 'white', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
          {t('Ven a conocernos', 'Come visit us')}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 2rem', lineHeight: 1.7, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
          {t('Tres sucursales en Rosarito esperándote. Agenda tu cita o pasa directo — siempre habrá alguien listo para atenderte.', 'Three locations in Rosarito waiting for you. Schedule an appointment or just walk in — there will always be someone ready to help.')}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/examen" style={{ display: 'inline-flex', alignItems: 'center', background: 'white', color: 'var(--sage)', border: 'none', borderRadius: '3px', padding: '14px 28px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
            {t('Agendar cita', 'Book appointment')}
          </Link>
          <Link href="/ubicaciones" style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '3px', padding: '14px 28px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
            {t('Ver ubicaciones', 'See locations')}
          </Link>
        </div>
      </div>

    </div>
  );
}
