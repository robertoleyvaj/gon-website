'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from './LanguageContext';

type Expresion = 'neutral' | 'feliz' | 'pensando' | 'recomendando' | 'sorprendida';
type TipoCara = 'ovalada' | 'cuadrada' | 'corazon' | 'redonda' | '';
type Mensaje = { de: 'verly' | 'px'; texto: string; paquete?: Paquete };

interface Receta {
  sph_od: number; cyl_od: number; axis_od: number; add_od: number;
  sph_oi: number; cyl_oi: number; axis_oi: number; add_oi: number;
}

interface Paquete {
  nombre: string;
  material: string; precioMaterial: number;
  filtros: { nombre: string; precio: number }[];
  precioOriginal: number;
  precioFinal: number;
  descuento: number;
  condicion: string;
  explicacion: string;
}

interface SesionPx {
  nombre: string;
  tipoCara: TipoCara;
  receta: Receta | null;
  primeraVez: boolean | null;
  estiloVida: Record<string, boolean>;
  paqueteRecomendado: Paquete | null;
}

const PRECIOS_MATERIAL: Record<string, number> = {
  'CR-39': 0, 'PolyPlus': 29, 'HD Vision': 39, 'Hi-Index 1.67': 59, 'Súper Hi-Index 1.74': 89,
};
const PRECIOS_FILTRO: Record<string, number> = {
  'AR Normal': 9, 'Blue Light': 17, 'Fotocromático': 39, 'Antiempañante': 15,
  'AR Premium': 39, 'Polarizado': 89, 'Tinte estético': 28,
};
const PRECIO_ARMAZON = 43;

function armarPaquete(receta: Receta, estiloVida: Record<string, boolean>, lang: 'es' | 'en'): Paquete {
  const sph = Math.max(Math.abs(receta.sph_od), Math.abs(receta.sph_oi));
  const cyl = Math.max(Math.abs(receta.cyl_od), Math.abs(receta.cyl_oi));
  const add = Math.max(receta.add_od, receta.add_oi);
  const tieneAstigmatismo = cyl >= 0.75;
  const tienePresbicia = add > 0;

  let material = 'CR-39';
  let condicion = '';
  let explicacion = '';

  if (sph > 5) {
    material = 'Súper Hi-Index 1.74';
    condicion = lang === 'es' ? 'Graduación muy alta' : 'Very high prescription';
    explicacion = lang === 'es'
      ? `Con tu graduación tan alta (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}), los lentes convencionales quedarían muy gruesos — casi como "fondos de botella". El Súper Hi-Index 1.74 es el material más delgado del mercado, tus lentes se verán elegantes y ligeros.`
      : `With your very high prescription (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}), regular lenses would be very thick. Super Hi-Index 1.74 is the thinnest material available — your lenses will look elegant and light.`;
  } else if (sph > 3) {
    material = 'Hi-Index 1.67';
    condicion = lang === 'es' ? 'Graduación alta' : 'High prescription';
    explicacion = lang === 'es'
      ? `Tu graduación (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}) requiere un material más delgado. El Hi-Index 1.67 reduce el grosor de tus lentes hasta un 30% — más cómodos y estéticos.`
      : `Your prescription (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}) needs a thinner material. Hi-Index 1.67 reduces lens thickness up to 30% — more comfortable and attractive.`;
  } else if (sph > 1.5 || tieneAstigmatismo) {
    material = 'PolyPlus';
    condicion = tieneAstigmatismo
      ? (lang === 'es' ? 'Astigmatismo' : 'Astigmatism')
      : (lang === 'es' ? 'Miopía/Hipermetropía leve' : 'Mild Myopia/Hyperopia');
    explicacion = tieneAstigmatismo
      ? (lang === 'es'
        ? `Tienes astigmatismo (CYL ${receta.cyl_od < 0 ? '' : '+'}${receta.cyl_od}). Esto significa que tu córnea tiene una curvatura irregular — como un balón de fútbol americano en lugar de una esfera. Por eso ves borroso y los faroles o pantallas se ven con halos de noche. El PolyPlus mantiene mejor la corrección cilíndrica y es más resistente para uso diario.`
        : `You have astigmatism (CYL ${receta.cyl_od < 0 ? '' : '+'}${receta.cyl_od}). Your cornea has an irregular shape — like a football instead of a sphere. That's why you see blurry and lights look like halos at night. PolyPlus maintains cylindrical correction better and is more durable for daily use.`)
      : (lang === 'es'
        ? `Con tu graduación, el PolyPlus es el punto perfecto entre calidad y precio — más resistente que el básico sin el costo de los premium.`
        : `With your prescription, PolyPlus hits the sweet spot between quality and price — more durable than basic without the premium cost.`);
  } else {
    material = 'CR-39';
    condicion = lang === 'es' ? 'Graduación baja' : 'Low prescription';
    explicacion = lang === 'es'
      ? `Tu graduación es baja (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}), así que el CR-39 es perfecto — económico, ligero y de excelente calidad óptica.`
      : `Your prescription is low (SPH ${receta.sph_od > 0 ? '+' : ''}${receta.sph_od}), so CR-39 is perfect — affordable, light and excellent optical quality.`;
  }

  const filtrosRec: { nombre: string; precio: number }[] = [];

  if (tieneAstigmatismo) {
    filtrosRec.push({ nombre: 'AR Premium', precio: PRECIOS_FILTRO['AR Premium'] });
  } else {
    filtrosRec.push({ nombre: 'AR Normal', precio: PRECIOS_FILTRO['AR Normal'] });
  }
  if (estiloVida.computadora) filtrosRec.push({ nombre: 'Blue Light', precio: PRECIOS_FILTRO['Blue Light'] });
  if (estiloVida.manejo && !filtrosRec.find(f => f.nombre === 'AR Premium')) {
    filtrosRec.push({ nombre: 'AR Premium', precio: PRECIOS_FILTRO['AR Premium'] });
  }
  if (estiloVida.sol) filtrosRec.push({ nombre: 'Fotocromático', precio: PRECIOS_FILTRO['Fotocromático'] });
  if (estiloVida.exterior && !estiloVida.sol) filtrosRec.push({ nombre: 'Polarizado', precio: PRECIOS_FILTRO['Polarizado'] });
  if (tienePresbicia) filtrosRec.push({ nombre: 'Antiempañante', precio: PRECIOS_FILTRO['Antiempañante'] });

  const precioMaterial = PRECIOS_MATERIAL[material];
  const precioFiltrosTot = filtrosRec.reduce((a, f) => a + f.precio, 0);
  const precioOriginal = PRECIO_ARMAZON + precioMaterial + precioFiltrosTot;
  const descuento = Math.round(precioOriginal * 0.10);
  const precioFinal = precioOriginal - descuento;

  return { nombre: lang === 'es' ? `Paquete ${condicion}` : `${condicion} Package`, material, precioMaterial, filtros: filtrosRec, precioOriginal, precioFinal, descuento, condicion, explicacion };
}

function VerlyAvatar({ expresion, size = 56 }: { expresion: Expresion; size?: number }) {
  const ojosAbiertos = expresion !== 'pensando';
  const sonrisa = expresion === 'feliz' || expresion === 'recomendando';
  const cejas = expresion === 'sorprendida' ? -4 : expresion === 'pensando' ? 2 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <ellipse cx="40" cy="70" rx="20" ry="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
      <rect x="34" y="60" width="12" height="16" rx="2" fill="white" stroke="#E2E8F0" strokeWidth="1"/>
      <path d="M34 62 L30 74" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M46 62 L50 74" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="40" cy="66" r="1.5" fill="#2BBFB3"/>
      <circle cx="40" cy="71" r="1.5" fill="#2BBFB3"/>
      <ellipse cx="40" cy="36" rx="26" ry="28" fill="white" stroke="#2BBFB3" strokeWidth="2.5"/>
      <ellipse cx="32" cy="22" rx="6" ry="3.5" fill="#E0F7F4" opacity="0.6"/>
      <path d={`M25 ${26 + cejas} Q29 ${23 + cejas} 33 ${26 + cejas}`} stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
      <path d={`M47 ${26 + cejas} Q51 ${23 + cejas} 55 ${26 + cejas}`} stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"/>
      <rect x="21" y="29" width="17" height="11" rx="5" fill="white" stroke="#2BBFB3" strokeWidth="2" opacity="0.9"/>
      <rect x="42" y="29" width="17" height="11" rx="5" fill="white" stroke="#2BBFB3" strokeWidth="2" opacity="0.9"/>
      <line x1="38" y1="34.5" x2="42" y2="34.5" stroke="#2BBFB3" strokeWidth="1.5"/>
      <line x1="21" y1="34.5" x2="17" y2="32" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="59" y1="34.5" x2="63" y2="32" stroke="#2BBFB3" strokeWidth="1.5" strokeLinecap="round"/>
      {ojosAbiertos ? (
        <>
          <ellipse cx="29.5" cy="34.5" rx="3.5" ry="3.5" fill="#1A1A2E"/>
          <ellipse cx="50.5" cy="34.5" rx="3.5" ry="3.5" fill="#1A1A2E"/>
          <circle cx="31" cy="33" r="1" fill="white"/>
          <circle cx="52" cy="33" r="1" fill="white"/>
        </>
      ) : (
        <>
          <path d="M26 34.5 Q29.5 31 33 34.5" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M47 34.5 Q50.5 31 54 34.5" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}
      {sonrisa
        ? <path d="M33 46 Q40 52 47 46" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        : expresion === 'sorprendida'
        ? <ellipse cx="40" cy="47" rx="4" ry="5" fill="#1A1A2E"/>
        : <path d="M35 47 Q40 50 45 47" stroke="#1A1A2E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      }
      {(expresion === 'feliz' || expresion === 'recomendando') && (
        <>
          <ellipse cx="23" cy="43" rx="4.5" ry="2.5" fill="#FFB3C6" opacity="0.5"/>
          <ellipse cx="57" cy="43" rx="4.5" ry="2.5" fill="#FFB3C6" opacity="0.5"/>
        </>
      )}
      {expresion === 'pensando' && (
        <>
          <circle cx="36" cy="48" r="1.5" fill="#2BBFB3"/>
          <circle cx="40" cy="46" r="1.5" fill="#2BBFB3"/>
          <circle cx="44" cy="48" r="1.5" fill="#2BBFB3"/>
        </>
      )}
    </svg>
  );
}

function BurbujaPaquete({ paquete, onAceptar, lang }: { paquete: Paquete; onAceptar: () => void; lang: 'es' | 'en' }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #E0F7F4, #F0FBF8)', border: '2px solid #2BBFB3', borderRadius: '12px', padding: '1rem', marginTop: '8px' }}>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#2BBFB3', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
        {paquete.nombre}
      </div>
      <div style={{ fontSize: '12px', color: '#1A5C58', marginBottom: '10px', lineHeight: 1.6 }}>
        {paquete.explicacion}
      </div>
      <div style={{ background: 'white', borderRadius: '8px', padding: '0.75rem', marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid #F0F0F0' }}>
          <span style={{ color: '#5A6478' }}>{lang === 'es' ? 'Armazón' : 'Frame'}</span>
          <span style={{ fontWeight: 600 }}>${PRECIO_ARMAZON}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid #F0F0F0' }}>
          <span style={{ color: '#5A6478' }}>{paquete.material}</span>
          <span style={{ fontWeight: 600 }}>{paquete.precioMaterial === 0 ? (lang === 'es' ? 'Incluido' : 'Included') : `+$${paquete.precioMaterial}`}</span>
        </div>
        {paquete.filtros.map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: i < paquete.filtros.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
            <span style={{ color: '#5A6478' }}>{f.nombre}</span>
            <span style={{ fontWeight: 600 }}>+${f.precio}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7A8494', textDecoration: 'line-through' }}>${paquete.precioOriginal} USD</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#2BBFB3' }}>${paquete.precioFinal} USD</div>
        </div>
        <div style={{ background: '#F5C518', color: '#1A1A2E', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 800 }}>
          -{paquete.descuento}% OFF
        </div>
      </div>
      <button onClick={onAceptar} style={{
        width: '100%', background: '#1A1A2E', color: 'white', border: 'none',
        borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 700,
        cursor: 'pointer', fontFamily: 'var(--font-jakarta), sans-serif',
      }}>
        {lang === 'es' ? 'Quiero este paquete →' : 'I want this package →'}
      </button>
    </div>
  );
}

export default function VerlyBot() {
  const { lang } = useLang() as { lang: 'es' | 'en'; t: (es: string, en: string) => string };
  const [abierto, setAbierto] = useState(false);
  const [expresion, setExpresion] = useState<Expresion>('neutral');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [paso, setPaso] = useState(0);
  const [opciones, setOpciones] = useState<string[]>([]);
  const [sesion, setSesion] = useState<SesionPx>({
    nombre: '', tipoCara: '', receta: null,
    primeraVez: null, estiloVida: {}, paqueteRecomendado: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cargarSesion = (): SesionPx => {
    if (typeof window === 'undefined') return { nombre: '', tipoCara: '', receta: null, primeraVez: null, estiloVida: {}, paqueteRecomendado: null };
    return JSON.parse(sessionStorage.getItem('verly_sesion') || '{}');
  };

  const guardarSesion = (s: SesionPx) => {
    if (typeof window !== 'undefined') sessionStorage.setItem('verly_sesion', JSON.stringify(s));
  };

  const cambiarExpresion = (e: Expresion, ms = 2500) => {
    setExpresion(e);
    setTimeout(() => setExpresion('neutral'), ms);
  };

  const agregarMensaje = (de: 'verly' | 'px', texto: string, paquete?: Paquete) => {
    setMensajes(prev => [...prev, { de, texto, paquete }]);
  };

  // Escuchar cuando se actualiza la receta desde el drawer
  useEffect(() => {
    const onRecetaActualizada = () => {
      const s = cargarSesion();
      if (s.receta) {
        setSesion(s);
        const paquete = armarPaquete(s.receta, s.estiloVida || {}, lang);
        cambiarExpresion('recomendando', 4000);
        agregarMensaje('verly',
          lang === 'es'
            ? `¡Leí tu receta! Basándome en tu graduación, te armé un paquete personalizado con 10% de descuento:`
            : `I read your prescription! Based on your prescription, I put together a personalized package with 10% off:`,
          paquete
        );
        const nuevaSesion = { ...s, paqueteRecomendado: paquete };
        setSesion(nuevaSesion);
        guardarSesion(nuevaSesion);
        if (!abierto) setAbierto(true);
      }
    };
    window.addEventListener('verly_receta_actualizada', onRecetaActualizada);
    return () => window.removeEventListener('verly_receta_actualizada', onRecetaActualizada);
  }, [lang, abierto]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    if (abierto && mensajes.length === 0) {
      setTimeout(() => iniciarConversacion(), 400);
    }
  }, [abierto]);

  const iniciarConversacion = () => {
    const s = cargarSesion();
    setSesion(s);
    const path = window.location.pathname;

    if (s.nombre) {
      agregarMensaje('verly', lang === 'es'
        ? `¡Hola de nuevo, ${s.nombre}! ¿En qué te puedo ayudar?`
        : `Welcome back, ${s.nombre}! How can I help you?`);
      cambiarExpresion('feliz');
      setPaso(10);
      mostrarOpcionesPorPagina(path, s);
    } else {
      agregarMensaje('verly', lang === 'es'
        ? '¡Hola! Soy Verly, tu optometrista virtual. Estoy aquí para ayudarte a encontrar los lentes perfectos para tu graduación y estilo de vida. ¿Cómo te llamas?'
        : "Hi! I'm Verly, your virtual optometrist. I'm here to help you find the perfect lenses for your prescription and lifestyle. What's your name?");
      cambiarExpresion('feliz', 3000);
      setPaso(1);
    }
  };

  const mostrarOpcionesPorPagina = (path: string, s: SesionPx) => {
    setTimeout(() => {
      if (path.includes('/armazon/')) {
        if (s.receta) {
          const paquete = armarPaquete(s.receta, s.estiloVida || {}, lang);
          agregarMensaje('verly',
            lang === 'es'
              ? `Tengo tu receta guardada. Aquí está tu paquete personalizado:`
              : `I have your prescription saved. Here's your personalized package:`,
            paquete
          );
          cambiarExpresion('recomendando', 3000);
        } else {
          agregarMensaje('verly', lang === 'es'
            ? '¡Buen gusto en el armazón! Cuando ingreses tu receta en el formulario de arriba, yo la leo automáticamente y te armo un paquete con 10% de descuento.'
            : 'Great frame choice! When you enter your prescription in the form above, I\'ll read it automatically and build a package with 10% off.');
          setOpciones(lang === 'es'
            ? ['¿Cómo ingreso mi receta?', 'No tengo mi receta', '¿Qué material me recomiendas?']
            : ['How do I enter my prescription?', "I don't have my prescription", 'What material do you recommend?']);
        }
      } else if (path === '/Tienda' || path.includes('/Tienda')) {
        if (!s.tipoCara) {
          agregarMensaje('verly', lang === 'es'
            ? '¿Cuál es la forma de tu cara? Te ayudo a encontrar el armazón ideal.'
            : 'What is your face shape? I\'ll help you find the ideal frame.');
          setOpciones(lang === 'es'
            ? ['Ovalada', 'Cuadrada', 'Corazón', 'Redonda', 'No sé']
            : ['Oval', 'Square', 'Heart', 'Round', "I don't know"]);
          setPaso(3);
        }
      }
    }, 600);
  };

  const darRecomendacionArmazon = (tipoCara: TipoCara) => {
    const recs: Record<string, { es: string; en: string }> = {
      ovalada: { es: 'Tu cara ovalada es muy versátil — casi cualquier armazón te queda. Te recomiendo los cuadrados o rectangulares para dar más estructura. ¡Prueba los de forma cuadrada!', en: 'Your oval face is very versatile — almost any frame suits you. I recommend square or rectangular frames for more structure. Try square shapes!' },
      cuadrada: { es: 'Para cara cuadrada, los armazones ovalados o redondos suavizan los ángulos de tu mandíbula. Evita los muy angulares.', en: 'For a square face, oval or round frames soften your jaw angles. Avoid very angular frames.' },
      corazon: { es: 'Con cara de corazón, los armazones más anchos abajo equilibran tu frente. Los ovalados y aviator son ideales para ti.', en: 'With a heart-shaped face, frames wider at the bottom balance your forehead. Oval and aviator styles are ideal.' },
      redonda: { es: 'Para cara redonda, los armazones rectangulares alargan visualmente el rostro. Evita los redondos que acentúan la forma circular.', en: 'For a round face, rectangular frames visually elongate the face. Avoid round frames that emphasize the circular shape.' },
    };
    const rec = recs[tipoCara as string] || recs['ovalada'];
    agregarMensaje('verly', lang === 'es' ? rec.es : rec.en);
    cambiarExpresion('recomendando', 3000);
    setTimeout(() => {
      agregarMensaje('verly', lang === 'es'
        ? '¿Ya tienes tu receta óptica? Con ella te armo un paquete completo con 10% de descuento.'
        : 'Do you have your optical prescription? With it I\'ll build a complete package with 10% off.');
      setOpciones(lang === 'es'
        ? ['Sí, la tengo', 'No la tengo aún', 'Ver armazones primero']
        : ['Yes, I have it', 'Not yet', 'Browse frames first']);
      setPaso(5);
    }, 1800);
  };

  const procesarRespuesta = (texto: string) => {
    agregarMensaje('px', texto);
    setOpciones([]);
    cambiarExpresion('pensando', 1200);

    setTimeout(() => {
      const s = cargarSesion();
      const tl = texto.toLowerCase();

      if (paso === 1) {
        const nombre = texto.trim().split(' ')[0];
        const nuevaSesion = { ...s, nombre };
        setSesion(nuevaSesion);
        guardarSesion(nuevaSesion);
        agregarMensaje('verly', lang === 'es'
          ? `¡Mucho gusto, ${nombre}! ¿Es tu primera vez comprando lentes en línea?`
          : `Nice to meet you, ${nombre}! Is this your first time buying glasses online?`);
        cambiarExpresion('feliz');
        setOpciones(lang === 'es' ? ['Sí, primera vez', 'Ya he comprado antes', 'Solo explorando'] : ['Yes, first time', "I've bought before", 'Just browsing']);
        setPaso(2);

      } else if (paso === 2) {
        const esPrimera = tl.includes('primera') || tl.includes('first') || tl.includes('sí');
        const nuevaSesion = { ...s, primeraVez: esPrimera };
        setSesion(nuevaSesion);
        guardarSesion(nuevaSesion);
        agregarMensaje('verly', esPrimera
          ? (lang === 'es' ? '¡No te preocupes! Estoy aquí para guiarte. Primero: ¿cuál es la forma de tu cara?' : "Don't worry! I'm here to guide you. First: what is your face shape?")
          : (lang === 'es' ? '¡Perfecto! Cuéntame la forma de tu cara para recomendarte armazones.' : 'Perfect! Tell me your face shape so I can recommend frames.'));
        setOpciones(lang === 'es' ? ['Ovalada', 'Cuadrada', 'Corazón', 'Redonda', 'No sé'] : ['Oval', 'Square', 'Heart', 'Round', "I don't know"]);
        setPaso(3);

      } else if (paso === 3) {
        let tc: TipoCara = 'ovalada';
        if (tl.includes('oval')) tc = 'ovalada';
        else if (tl.includes('cuadrad') || tl.includes('square')) tc = 'cuadrada';
        else if (tl.includes('coraz') || tl.includes('heart')) tc = 'corazon';
        else if (tl.includes('redon') || tl.includes('round')) tc = 'redonda';
        const nuevaSesion = { ...s, tipoCara: tc };
        setSesion(nuevaSesion);
        guardarSesion(nuevaSesion);
        darRecomendacionArmazon(tc);
        setPaso(5);

      } else if (paso === 4) {
        const ev = {
          computadora: tl.includes('computadora') || tl.includes('pantalla') || tl.includes('computer') || tl.includes('screen'),
          manejo: tl.includes('manejo') || tl.includes('noche') || tl.includes('drive') || tl.includes('night'),
          sol: tl.includes('sol') || tl.includes('sun'),
          exterior: tl.includes('exterior') || tl.includes('outdoor'),
        };
        const nuevaSesion = { ...s, estiloVida: ev };
        setSesion(nuevaSesion);
        guardarSesion(nuevaSesion);
        if (s.receta) {
          const paquete = armarPaquete(s.receta, ev, lang);
          agregarMensaje('verly', lang === 'es' ? 'Perfecto. Con tu receta y estilo de vida, aquí está tu paquete:' : 'Perfect. Based on your prescription and lifestyle, here\'s your package:', paquete);
          cambiarExpresion('recomendando', 3000);
          const np = { ...nuevaSesion, paqueteRecomendado: paquete };
          setSesion(np);
          guardarSesion(np);
        } else {
          agregarMensaje('verly', lang === 'es'
            ? 'Guardé tus preferencias. Cuando ingreses tu receta en el drawer, te armo el paquete completo automáticamente.'
            : 'I saved your preferences. When you enter your prescription in the drawer, I\'ll automatically build the complete package.');
          setPaso(10);
        }

      } else if (paso === 5) {
        if (tl.includes('sí') || tl.includes('yes') || tl.includes('tengo') || tl.includes('have')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Perfecto. Ingresa los números en el formulario del drawer (botón "Personalizar mis micas"). En cuanto llenes el SPH, yo lo leo automáticamente y te genero tu paquete con descuento.'
            : 'Perfect. Enter the numbers in the drawer form (button "Customize my lenses"). As soon as you fill in the SPH, I\'ll read it automatically and generate your package with a discount.');
          setPaso(10);
          setOpciones(lang === 'es' ? ['¿Cómo se lee la receta?', 'Ya la ingresé'] : ['How do I read the prescription?', 'I already entered it']);
        } else if (tl.includes('ver') || tl.includes('browse')) {
          agregarMensaje('verly', lang === 'es' ? '¡Claro! Explora los armazones con calma. Cuando encuentres uno que te guste, ábrelo y yo te ayudo con la receta y el paquete.' : 'Of course! Browse the frames at your own pace. When you find one you like, open it and I\'ll help you with the prescription and package.');
          setPaso(10);
        } else {
          agregarMensaje('verly', lang === 'es'
            ? 'No hay problema. Puedes conseguir tu receta con cualquier optometrista o usar la de tus lentes actuales. ¿Te cuento cómo leerla?'
            : 'No problem. You can get your prescription from any optometrist or use the one from your current glasses. Want me to explain how to read it?');
          setOpciones(lang === 'es' ? ['Sí, explícame', 'Lo haré después'] : ['Yes, explain it', "I'll do it later"]);
          setPaso(10);
        }

      } else {
        // Conversación libre
        if (tl.includes('receta') || tl.includes('prescription') || tl.includes('graduac')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Para ingresar tu receta, haz clic en "Personalizar mis micas" en cualquier armazón. Ahí verás los campos SPH, CYL, EJE, ADD y DP para cada ojo. En cuanto los llenes, yo los leo automáticamente.'
            : 'To enter your prescription, click "Customize my lenses" on any frame. There you\'ll see SPH, CYL, AXIS, ADD and PD fields for each eye. As soon as you fill them in, I\'ll read them automatically.');
        } else if (tl.includes('leer') || tl.includes('read') || tl.includes('significa') || tl.includes('sph') || tl.includes('cyl')) {
          agregarMensaje('verly', lang === 'es'
            ? 'En tu receta: **SPH** es la graduación principal (negativo = miopía, positivo = hipermetropía). **CYL** es el astigmatismo. **EJE/AXIS** es la orientación del astigmatismo (0-180°). **ADD** es la adición para presbicia (ver de cerca). **DP** es la distancia pupilar.'
            : 'In your prescription: **SPH** is the main power (negative = myopia, positive = hyperopia). **CYL** is astigmatism. **AXIS** is the astigmatism direction (0-180°). **ADD** is the addition for presbyopia. **PD** is pupillary distance.');
          cambiarExpresion('recomendando', 3000);
        } else if (tl.includes('astigmat')) {
          agregarMensaje('verly', lang === 'es'
            ? 'El astigmatismo ocurre cuando tu córnea tiene forma ovalada en lugar de esférica — como un balón de fútbol americano. Esto hace que la luz se enfoque en múltiples puntos, causando visión borrosa y halos nocturnos. Se corrige con lentes cilíndricos y el AR Premium elimina los reflejos molestos.'
            : 'Astigmatism occurs when your cornea is oval instead of spherical — like a football. This causes light to focus at multiple points, resulting in blurry vision and night halos. It\'s corrected with cylindrical lenses and AR Premium eliminates annoying reflections.');
          cambiarExpresion('recomendando', 3000);
        } else if (tl.includes('precio') || tl.includes('costo') || tl.includes('price') || tl.includes('cost')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Los armazones arrancan en $43 USD. Las micas se personalizan desde +$5 hasta +$186 según material y filtros. El precio promedio es ~$67 USD. Con mi paquete recomendado obtienes 10% de descuento automático.'
            : 'Frames start at $43 USD. Lenses are customized from +$5 to +$186 depending on material and filters. Average price is ~$67 USD. With my recommended package you get 10% off automatically.');
        } else if (tl.includes('entrega') || tl.includes('shipping') || tl.includes('delivery')) {
          agregarMensaje('verly', lang === 'es'
            ? 'Entregamos en 3-5 días hábiles a California. Envío gratuito en todos los pedidos. Tienes 30 días para devolverlos sin preguntas.'
            : 'We deliver in 3-5 business days to California. Free shipping on all orders. You have 30 days to return them no questions asked.');
        } else if (tl.includes('ya la ingresé') || tl.includes('already entered') || tl.includes('ya llené')) {
          const sf = cargarSesion();
          if (sf.receta) {
            const paquete = armarPaquete(sf.receta, sf.estiloVida || {}, lang);
            agregarMensaje('verly', lang === 'es' ? '¡La tengo! Aquí está tu paquete personalizado:' : 'Got it! Here\'s your personalized package:', paquete);
            cambiarExpresion('recomendando', 3000);
          } else {
            agregarMensaje('verly', lang === 'es'
              ? 'Hmm, aún no veo tu receta. Asegúrate de ingresar al menos el SPH en el formulario del drawer y yo la capturo automáticamente.'
              : 'Hmm, I don\'t see your prescription yet. Make sure to enter at least the SPH in the drawer form and I\'ll capture it automatically.');
          }
        } else {
          const resp = lang === 'es'
            ? ['¿Hay algo más en lo que te pueda ayudar?', '¿Tienes preguntas sobre materiales o filtros?', '¿Quieres que te explique cómo leer tu receta?']
            : ['Is there anything else I can help you with?', 'Do you have questions about materials or filters?', 'Want me to explain how to read your prescription?'];
          agregarMensaje('verly', resp[Math.floor(Math.random() * resp.length)]);
        }
      }
    }, 900);
  };

  const manejarEnvio = () => {
    if (!input.trim()) return;
    procesarRespuesta(input.trim());
    setInput('');
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <div
        onClick={() => setAbierto(!abierto)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 999,
          cursor: 'pointer',
          animation: 'verlyFloat 3s ease-in-out infinite',
          filter: 'drop-shadow(0 8px 28px rgba(43,191,179,0.45))',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <VerlyAvatar expresion={abierto ? 'feliz' : expresion} size={72}/>
        {!abierto && (
          <div style={{
            position: 'absolute', top: '-2px', right: '-2px',
            background: '#F5C518', borderRadius: '50%', width: '20px', height: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 800, color: '#1A1A2E', border: '2px solid white',
          }}>!</div>
        )}
      </div>

      {/* VENTANA DE CHAT */}
      {abierto && (
        <div style={{
          position: 'fixed', bottom: '116px', right: '28px', zIndex: 998,
          width: '380px', maxWidth: 'calc(100vw - 56px)',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', maxHeight: '560px',
          animation: 'verlySlideUp 0.3s ease-out',
          fontFamily: 'var(--font-jakarta), sans-serif',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #2BBFB3, #1a9990)',
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '12px',
            flexShrink: 0,
          }}>
            <VerlyAvatar expresion={expresion} size={48}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>Verly</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                {lang === 'es' ? 'Tu optometrista virtual' : 'Your virtual optometrist'}
              </div>
            </div>
            <button onClick={() => setAbierto(false)} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              width: '30px', height: '30px', color: 'white', cursor: 'pointer',
              fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'inherit',
            }}>×</button>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.de === 'verly' ? 'row' : 'row-reverse', gap: '8px', alignItems: 'flex-start' }}>
                {m.de === 'verly' && <VerlyAvatar expresion="neutral" size={30}/>}
                <div style={{ maxWidth: '82%' }}>
                  <div style={{
                    background: m.de === 'verly' ? '#F0FBF8' : '#1A1A2E',
                    color: m.de === 'verly' ? '#1A1A2E' : 'white',
                    padding: '10px 14px',
                    borderRadius: m.de === 'verly' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                    fontSize: '13px', lineHeight: 1.6,
                  }}>
                    {m.texto}
                  </div>
                  {m.paquete && (
                    <BurbujaPaquete
                      paquete={m.paquete}
                      lang={lang}
                      onAceptar={() => {
                        cambiarExpresion('feliz', 2500);
                        agregarMensaje('verly', lang === 'es'
                          ? `¡Excelente elección! Selecciona ${m.paquete!.material} como material en el drawer y agrega los filtros recomendados. Tu código VERLY10 también aplica para un 10% adicional.`
                          : `Excellent choice! Select ${m.paquete!.material} as material in the drawer and add the recommended filters. Your code VERLY10 also applies for an additional 10%.`);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            {opciones.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {opciones.map((op, i) => (
                  <button key={i} onClick={() => procesarRespuesta(op)} style={{
                    background: 'white', border: '1.5px solid #2BBFB3', borderRadius: '20px',
                    padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#2BBFB3',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#E0F7F4'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #EAECF0', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && manejarEnvio()}
              placeholder={lang === 'es' ? 'Escribe aquí...' : 'Type here...'}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '20px',
                border: '1.5px solid #EAECF0', fontSize: '13px',
                fontFamily: 'inherit', outline: 'none',
              }}
            />
            <button onClick={manejarEnvio} style={{
              background: '#2BBFB3', color: 'white', border: 'none',
              borderRadius: '50%', width: '40px', height: '40px',
              cursor: 'pointer', fontSize: '18px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes verlyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes verlySlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}