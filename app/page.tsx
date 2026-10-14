// app/page.tsx — Portada de GON (mismo diseño editorial que Verly, colores de GON, precios en pesos)
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useLang } from './components/LanguageContext';
import { supabase } from './lib/supabase';
import { swatchColor, nombreColor } from './lib/colores';
import { precioGon, mxn, waGon } from './lib/precio-gon';
import { normForma } from './lib/armazon-web';
import { claveMaterial } from './lib/textos';

type Destacado = { id: number; nombre: string; precio: number; foto: string; colores: { color: string; hex?: string | null }[] };

const Flecha = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default function Home() {
  const { t, lang } = useLang() as any;
  const [destacados, setDestacados] = useState<Destacado[]>([]);
  // Foto real (de OptiOS) para cada forma: un armazón que tengamos de esa forma
  const [fotoForma, setFotoForma] = useState<Record<string, string>>({});

  // Armazones reales de OptiOS: los primeros 4 publicados que ya tienen foto
  useEffect(() => {
    (async () => {
      const { data: arms } = await supabase.from('armazones').select('*')
        .eq('activo', true).eq('publicar_gon', true).eq('tipo', 'optico').order('id', { ascending: false }).limit(200);
      const lista = arms || [];
      if (!lista.length) return;
      const { data: cols } = await supabase.from('armazon_colores').select('armazon_id, color, hex, imagen_url, orden')
        .in('armazon_id', lista.map((a: any) => a.id)).eq('publicar_gon', true).order('orden');
      const porModelo: Record<number, any[]> = {};
      for (const c of cols || []) (porModelo[c.armazon_id] ||= []).push(c);
      const out: Destacado[] = [];
      for (const a of lista as any[]) {
        const cs = porModelo[a.id] || [];
        const foto = a.imagen_url || cs.find(c => c.imagen_url)?.imagen_url;
        if (!foto) continue;
        out.push({ id: a.id, nombre: a.nombre, precio: precioGon(a), foto, colores: cs.length ? cs : [{ color: a.color || '' }] });
        if (out.length === 4) break;
      }
      setDestacados(out);
      // Formas: el primer armazón con foto de cada forma (y uno de metal)
      const ff: Record<string, string> = {};
      for (const a of lista as any[]) {
        const cs = porModelo[a.id] || [];
        const foto = cs.find(c => c.imagen_url)?.imagen_url || a.imagen_url;
        if (!foto) continue;
        const fk = normForma(a.forma);
        const k = fk === 'round' || fk === 'oval' ? 'red' : fk === 'rectangle' || fk === 'square' ? 'rect' : fk === 'cat-eye' ? 'cat' : '';
        if (k && !ff[k]) ff[k] = foto;
        if (!ff.metal && claveMaterial(a.material) === 'METAL') ff.metal = foto;
      }
      setFotoForma(ff);
    })();
  }, []);

  // Armazones reales sobre un fondo de color liso (un tono distinto por forma)
  const formas = [
    { k: 'red', img: '/home/gon-forma-redondo.jpg', bg: '#EEF2F8', es: 'Redondos', en: 'Round', href: '/Tienda?forma=round,oval' },
    { k: 'rect', img: '/home/gon-forma-cuadrado.jpg', bg: '#F3F0EB', es: 'Rectangulares', en: 'Rectangular', href: '/Tienda?forma=rectangle,square' },
    { k: 'cat', img: '/home/gon-forma-cat.jpg', bg: '#F6EEF0', es: 'Cat-eye', en: 'Cat-eye', href: '/Tienda?forma=cat-eye' },
    { k: 'metal', img: '/home/gon-forma-metal.jpg', bg: '#EAF5F4', es: 'De metal', en: 'Metal', href: '/Tienda?material=METAL' },
  ];

  const pasos = [
    { es: 'Elige tu armazón', en: 'Choose your frame', des: 'Filtra por forma, color y talla. Todos los modelos están en nuestras ópticas.', den: 'Filter by shape, color and size. Every model is in our stores.' },
    { es: 'Apártalo o cómpralo', en: 'Reserve or buy it', des: 'Apártalo por WhatsApp o cómpralo en línea con tus micas.', den: 'Reserve it on WhatsApp or buy it online with your lenses.' },
    { es: 'Examen de la vista gratis', en: 'Free eye exam', des: 'Te revisamos la vista sin costo en cualquiera de nuestras ópticas.', den: 'We check your eyes for free at any of our stores.' },
    { es: 'Recoge tus lentes', en: 'Pick up your glasses', des: 'Te avisamos cuando estén listos para que pases por ellos.', den: 'We let you know when they are ready to pick up.' },
  ];

  const faqs = [
    { q: ['¿El examen de la vista es gratis?', 'Is the eye exam free?'], a: ['Sí. Te hacemos el examen sin costo en cualquiera de nuestras ópticas en Rosarito.', 'Yes. We give you a free eye exam at any of our stores in Rosarito.'] },
    { q: ['¿Puedo apartar un armazón?', 'Can I reserve a frame?'], a: ['Sí. En cada armazón hay un botón para apartarlo por WhatsApp y lo tenemos listo para cuando vengas.', 'Yes. Every frame has a button to reserve it on WhatsApp and we hold it for your visit.'] },
    { q: ['¿Atienden en inglés?', 'Do you speak English?'], a: ['Sí, te atendemos en español y en inglés.', 'Yes, we help you in English and Spanish.'] },
    { q: ['¿Dónde están sus ópticas?', 'Where are your stores?'], a: ['Tenemos ópticas en Playas de Rosarito, Baja California. Revisa direcciones y horarios en Ubicaciones.', 'We have stores in Playas de Rosarito, Baja California. See addresses and hours under Locations.'] },
  ];

  return (
    <main className="vh">
      <Navbar />

      {/* Portada */}
      <section className="vh-hero">
        <picture>
          <img src="/hero-man.jpg" alt={t('Óptica GON en Rosarito', 'GON optical store in Rosarito')} />
        </picture>
        <div className="vh-hero-tx">
          <h1>{lang === 'es' ? <>Tus lentes nuevos,<br />en Rosarito.</> : <>Your new glasses,<br />in Rosarito.</>}</h1>
          <p>{t('Examen de la vista gratis, atención bilingüe y armazones para toda la familia.', 'Free eye exam, bilingual service and frames for the whole family.')}</p>
          <div className="vh-btns">
            <Link href="/Tienda" className="vh-btn">{t('Ver armazones', 'Shop frames')} <Flecha /></Link>
            <Link href="/examen" className="vh-btn vh-btn-2">{t('Examen gratis', 'Free eye exam')}</Link>
          </div>
        </div>
      </section>

      {/* Formas */}
      <section className="vh-sec">
        <div className="vh-head">
          <div>
            <p className="vh-eye">{t('Nuestra colección', 'Our collection')}</p>
            <h2>{t('Encuentra tu forma', 'Find your shape')}</h2>
          </div>
          <p className="vh-side">{t('Todos estos modelos los tenemos en nuestras ópticas de Rosarito.', 'All these models are available at our Rosarito stores.')}</p>
        </div>
        <div className="vh-formas">
          {formas.map(f => (
            <Link key={f.href} href={f.href} className="vh-forma">
              <img src={f.img} alt={t(f.es, f.en)} loading="lazy" />
              <span>{t(f.es, f.en)} <Flecha /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados (productos reales) */}
      {destacados.length > 0 && (
        <section className="vh-sec">
          <div className="vh-head">
            <div>
              <p className="vh-eye">{t('Destacados', 'Featured')}</p>
              <h2>{t('Armazones destacados', 'Featured frames')}</h2>
            </div>
            <Link href="/Tienda" className="vh-link">{t('Ver todos los armazones', 'View all frames')} <Flecha /></Link>
          </div>
          <div className="vh-prods">
            {destacados.map(d => (
              <Link key={d.id} href={`/armazon/${d.id}`} className="vh-prod">
                <div className="vh-prod-img"><img src={d.foto} alt={d.nombre} loading="lazy" /></div>
                <b>{d.nombre}</b>
                <span>{mxn(d.precio)}</span>
                <div className="vh-sws">
                  {d.colores.slice(0, 5).map((c, i) => <i key={i} title={nombreColor(c.color, lang)} style={{ background: swatchColor(c.color, c.hex) }} />)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Dos colecciones */}
      <section className="vh-mitades">
        <Link href="/Tienda?material=ACETATE" className="vh-mitad">
          <img src="/home/acetato.jpg" alt={t('Armazón de acetato carey', 'Tortoise acetate frame')} loading="lazy" />
          <div>
            <h3>{t('Acetato clásico', 'Classic acetate')}</h3>
            <p>{t('Armazones de acetato en carey, negro y colores.', 'Acetate frames in tortoise, black and colors.')}</p>
            <span className="vh-link">{t('Ver colección', 'Shop the collection')} <Flecha /></span>
          </div>
        </Link>
        <Link href="/Tienda?color=transparente" className="vh-mitad">
          <img src="/home/transparentes.jpg" alt={t('Armazón transparente', 'Clear frame')} loading="lazy" />
          <div>
            <h3>{t('Transparentes', 'Clear frames')}</h3>
            <p>{t('Ligeros y fáciles de combinar con todo.', 'Light and easy to wear with anything.')}</p>
            <span className="vh-link">{t('Ver colección', 'Shop the collection')} <Flecha /></span>
          </div>
        </Link>
      </section>

      {/* Banner ancho */}
      <Link href="/Tienda?material=METAL" className="vh-banner">
        <img src="/home/metal-banner.jpg" alt={t('Armazón de metal dorado', 'Gold metal frame')} loading="lazy" />
        <div>
          <h3>{t('Armazones de metal', 'Metal frames')}</h3>
          <p>{t('Delgados y ligeros, en dorado y plateado.', 'Thin and light, in gold and silver.')}</p>
          <span className="vh-link">{t('Ver colección', 'Shop the collection')} <Flecha /></span>
        </div>
      </Link>

      {/* Cómo funciona */}
      <section className="vh-sec" id="como-funciona">
        <p className="vh-eye">{t('Cómo funciona', 'How it works')}</p>
        <h2>{t('Tus lentes en 4 pasos', 'Your glasses in 4 steps')}</h2>
        <div className="vh-pasos">
          {pasos.map((p, i) => (
            <div key={i} className="vh-paso">
              <span className="vh-num">{String(i + 1).padStart(2, '0')}</span>
              <b>{t(p.es, p.en)}</b>
              <span>{t(p.des, p.den)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Nuestro compromiso: texto, sin íconos */}
      <section className="vh-sec">
        <p className="vh-eye">{t('Por qué GON', 'Why GON')}</p>
        <h2>{t('Ópticas de confianza en Rosarito', 'Trusted optical stores in Rosarito')}</h2>
        <div className="vh-comp">
          {[
            { n: t('Gratis', 'Free'), u: '', h: t('Examen de la vista', 'Eye exam'), p: t('En cualquiera de nuestras ópticas, sin cita.', 'At any of our stores.'), href: '/examen' },
            { n: 'ES · EN', u: '', h: t('Atención bilingüe', 'Bilingual service'), p: t('Te atendemos en español y en inglés.', 'We help you in English and Spanish.'), href: '/ubicaciones' },
            { n: t('Apártalo', 'Reserve'), u: '', h: t('Por WhatsApp', 'On WhatsApp'), p: t('Apartamos tu armazón para cuando vengas.', 'We hold your frame for your visit.'), href: waGon(t('Hola, quiero apartar un armazón', 'Hi, I want to reserve a frame')) },
          ].map(c => (
            <Link key={c.href} href={c.href} className="vh-comp-i">
              <span className="vh-comp-n">{c.n}<small>{c.u}</small></span>
              <b>{c.h}</b>
              <span>{c.p}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Preguntas frecuentes para Google (schema.org FAQPage, en inglés) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q[1], acceptedAnswer: { '@type': 'Answer', text: f.a[1] } })),
      }) }} />

      {/* Preguntas */}
      <section className="vh-sec vh-faq" id="faq">
        <p className="vh-eye">{t('Preguntas frecuentes', 'FAQ')}</p>
        <h2>{t('Antes de comprar', 'Before you buy')}</h2>
        <div>
          {faqs.map((f, i) => (
            <details key={i}>
              <summary>{t(f.q[0], f.q[1])}<span aria-hidden="true">+</span></summary>
              <p>{t(f.a[0], f.a[1])}</p>
            </details>
          ))}
        </div>
      </section>

      <style>{`
        .vh{background:var(--cream);color:var(--charcoal);overflow-x:hidden;padding-top:64px}
        .vh h2{font-size:clamp(1.9rem,3.4vw,2.9rem);font-weight:500;letter-spacing:-.03em;line-height:1.05;margin:0}
        .vh-eye{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 10px}
        .vh-link{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--charcoal);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px;white-space:nowrap}
        .vh-btn{display:inline-flex;align-items:center;gap:10px;background:var(--sage);color:#fff;padding:15px 28px;border-radius:999px;font-size:14px;font-weight:500;text-decoration:none;border:0;cursor:pointer;font-family:var(--font-sans);transition:background .2s}
        .vh-btn:hover{background:var(--sage-light)}
        .vh-btn-2{background:transparent;color:var(--charcoal);border:1px solid var(--charcoal)}
        .vh-btn-2:hover{background:rgba(0,0,0,.04)}

        .vh-hero{position:relative;overflow:hidden;background:var(--cream-dark)}
        .vh-hero img{display:block;width:100%;height:clamp(460px,46vw,760px);object-fit:cover;object-position:right center}
        .vh-hero::before{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(255,255,255,.9) 0%,rgba(255,255,255,.75) 30%,rgba(255,255,255,0) 55%);pointer-events:none}
        .vh-hero-tx{z-index:1}
        .vh-hero-tx{position:absolute;inset:0;max-width:1280px;margin:0 auto;padding:0 2.5rem;display:flex;flex-direction:column;justify-content:center}
        .vh-hero h1{font-size:clamp(2.6rem,4.6vw,4.4rem);font-weight:500;letter-spacing:-.035em;line-height:1.02;margin:0 0 18px;max-width:560px}
        .vh-hero p{font-size:16px;line-height:1.65;color:#4a463f;max-width:400px;margin:0 0 30px}
        .vh-btns{display:flex;gap:12px;flex-wrap:wrap}

        .vh-sec{max-width:1280px;margin:0 auto;padding:96px 2.5rem 0}
        .vh-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:32px}
        .vh-side{max-width:300px;font-size:14px;line-height:1.6;color:var(--warm-gray);margin:0}

        .vh-formas{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .vh-forma{position:relative;display:block;aspect-ratio:8/9;overflow:hidden;border-radius:4px;text-decoration:none;color:var(--charcoal)}
        .vh-forma img{width:100%;height:100%;object-fit:cover;transition:transform .8s ease}
        .vh-forma-real img{object-fit:contain;padding:14% 8% 22%;mix-blend-mode:multiply}
        .vh-forma-real span{background:none}
        .vh-forma:hover img{transform:scale(1.04)}
        .vh-forma span{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:center;padding:16px 18px;font-size:16px;font-weight:500;background:linear-gradient(to top,rgba(247,244,239,.9),rgba(247,244,239,0))}

        .vh-prods{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .vh-prod{text-decoration:none;color:var(--charcoal);display:flex;flex-direction:column;gap:4px}
        .vh-prod-img{aspect-ratio:4/3;background:var(--foto-bg);border-radius:4px;overflow:hidden;margin-bottom:12px}
        .vh-prod-img img{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;transform:scale(1.08);transition:transform .5s ease}
        .vh-prod:hover .vh-prod-img img{transform:scale(1.13)}
        .vh-prod b{font-size:15px;font-weight:500}
        .vh-prod > span{font-size:13px;color:var(--warm-gray)}
        .vh-sws{display:flex;gap:6px;margin-top:6px}
        .vh-sws i{width:14px;height:14px;border-radius:50%;border:1px solid rgba(0,0,0,.12)}

        .vh-mitades{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:96px}
        .vh-mitad{position:relative;display:block;overflow:hidden;text-decoration:none;color:var(--charcoal)}
        .vh-mitad img{display:block;width:100%;height:clamp(380px,40vw,620px);object-fit:cover;transition:transform .8s ease}
        .vh-mitad:hover img{transform:scale(1.03)}
        .vh-mitad > div{position:absolute;left:clamp(24px,4vw,56px);bottom:clamp(28px,4vw,56px);max-width:320px}
        .vh-mitad h3,.vh-banner h3{font-size:clamp(1.7rem,2.8vw,2.5rem);font-weight:500;letter-spacing:-.03em;line-height:1.05;margin:0 0 10px}
        .vh-mitad p,.vh-banner p{font-size:14px;line-height:1.55;margin:0 0 18px;color:#3f3b35}

        .vh-promo{margin-top:96px}
        .vh-banner{position:relative;display:block;overflow:hidden;margin-top:6px;text-decoration:none;color:#fff;background:#1d2a20}
        .vh-banner img{display:block;width:100%;height:clamp(340px,34vw,560px);object-fit:cover;object-position:right center}
        .vh-banner > div{position:absolute;top:50%;transform:translateY(-50%);left:max(2.5rem,calc((100vw - 1280px)/2 + 2.5rem));max-width:360px}
        .vh-banner p{color:rgba(255,255,255,.8)}
        .vh-banner .vh-link{color:#fff}

        .vh-pasos{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:36px}
        .vh-paso{display:flex;flex-direction:column;gap:6px;color:var(--charcoal);background:var(--cream-dark);border-radius:6px;padding:24px 22px 26px}
        .vh-paso .vh-num{font-size:2.2rem;font-weight:500;letter-spacing:-.03em;color:var(--sage);margin-bottom:6px}
        .vh-paso-img{aspect-ratio:4/3;overflow:hidden;border-radius:4px;margin-bottom:12px;background:var(--cream-dark)}
        .vh-paso-img img{width:100%;height:100%;object-fit:cover}
                .vh-num{font-size:12px;font-weight:600;letter-spacing:.12em;color:var(--sage)}
        .vh-paso b{font-size:15px;font-weight:600}
        .vh-paso > span:last-child{font-size:13.5px;line-height:1.55;color:var(--warm-gray)}

        .vh-comp{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:36px;border-top:1px solid var(--border);padding-top:32px}
        .vh-comp-i{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--charcoal)}
        .vh-comp-i + .vh-comp-i{border-left:1px solid var(--border);padding-left:24px}
        .vh-comp-n{font-size:clamp(2.4rem,4vw,3.4rem);font-weight:500;letter-spacing:-.04em;line-height:1;color:var(--sage);margin-bottom:8px}
        .vh-comp-n small{font-size:.38em;letter-spacing:0;margin-left:6px;color:var(--warm-gray);font-weight:500}
        .vh-comp-i b{font-size:15px;font-weight:600}
        .vh-comp-i > span:last-child{font-size:13.5px;line-height:1.55;color:var(--warm-gray)}
        .vh-faq{padding-bottom:110px}
        .vh-faq > div{margin-top:28px;border-top:1px solid var(--border)}
        .vh-faq details{border-bottom:1px solid var(--border)}
        .vh-faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0;font-size:15.5px;font-weight:500}
        .vh-faq summary::-webkit-details-marker{display:none}
        .vh-faq summary span{font-size:22px;font-weight:300;color:var(--sage);transition:transform .2s}
        .vh-faq details[open] summary span{transform:rotate(45deg)}
        .vh-faq details p{margin:0 0 20px;font-size:14px;line-height:1.7;color:var(--warm-gray);max-width:680px}

        @media (max-width:900px){
          .vh-formas,.vh-prods{grid-template-columns:1fr 1fr;gap:12px}
          .vh-pasos{grid-template-columns:1fr 1fr;gap:24px 12px}
          .vh-comp{grid-template-columns:1fr}
          .vh-comp-i + .vh-comp-i{border-left:0;padding-left:0;border-top:1px solid var(--border);padding-top:24px}
        }
        @media (max-width:768px){
          .vh{padding-top:64px}
          /* Celular: todo sobre la foto. Título arriba (pared clara), botones abajo (piedra clara) */
          .vh-hero img{height:auto;aspect-ratio:4/5;object-position:72% center}
          .vh-hero::before{background:linear-gradient(to bottom,rgba(255,255,255,.92) 0%,rgba(255,255,255,0) 34%)}
          .vh-hero::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,rgba(253,252,250,.85) 0%,rgba(253,252,250,0) 26%,rgba(253,252,250,0) 78%,rgba(253,252,250,.7) 100%)}
          .vh-hero-tx{inset:0;justify-content:space-between;padding:44px 1.5rem 24px;z-index:1}
          .vh-hero-tx > p{display:none}
          .vh-hero h1{font-size:2.4rem;line-height:1.02;margin:0}
          .vh-hero .vh-btn-2{background:rgba(253,252,250,.9);border-color:rgba(28,28,26,.25)}
          .vh-hero p{font-size:14px;margin-bottom:18px;max-width:300px}
          .vh-btn{padding:12px 20px;font-size:13px}
          .vh-sec{padding:64px 1.25rem 0}
          .vh-head{flex-direction:column;align-items:flex-start;margin-bottom:22px}
          .vh-mitades{grid-template-columns:1fr;margin-top:64px}
          .vh-promo{margin-top:64px}
          .vh-mitad img{height:420px}
          .vh-banner img{height:420px;object-position:72% center}
          .vh-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(20,30,22,.75),rgba(20,30,22,0) 75%)}
          .vh-banner > div{left:1.25rem;right:1.25rem;z-index:1}
          .vh-faq{padding-bottom:80px}
        }
      `}</style>
    </main>
  );
}
