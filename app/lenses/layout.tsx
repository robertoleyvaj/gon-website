import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos de Lentes y Micas Graduadas en Rosarito | GON Óptica",
  description:
    "Monofocal, bifocal, progresivo, luz azul, fotocromático y más. Lentes graduados con micas de calidad Essilor y Zeiss en Rosarito, B.C. Sin seguro, desde $230 MXN.",
  keywords: [
    "lentes monofocales Rosarito",
    "lentes progresivos Rosarito",
    "micas graduadas Rosarito",
    "lentes bifocales Rosarito",
    "filtro luz azul Rosarito",
    "lentes fotocromáticos Rosarito",
    "micas Essilor Zeiss Rosarito",
    "lentes delgados Rosarito",
  ],
  openGraph: {
    title: "Micas y Lentes Graduados | GON Óptica Rosarito",
    description:
      "Elige entre monofocal, bifocal o progresivo. 5 materiales, 7 filtros. Recoge en cualquiera de nuestras 3 ópticas en Rosarito.",
    url: "https://gonmx.com/lenses",
  },
  alternates: {
    canonical: "https://gonmx.com/lenses",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto cuestan los lentes graduados en Rosarito?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En GON Óptica los lentes graduados monofocales comienzan desde $749 MXN. Los bifocales desde $1,149 MXN y los progresivos desde $1,899 MXN. El precio final incluye el armazón y puede variar según el material de la mica y los filtros que elijas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la diferencia entre lentes monofocales, bifocales y progresivos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los lentes monofocales corrigen una sola distancia (lejos o cerca) y son los más comunes. Los bifocales tienen dos zonas con una línea visible: lejos arriba y cerca abajo. Los progresivos ofrecen visión continua para todas las distancias sin línea visible, ideales para presbicia combinada con miopía o hipermetropía.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué tipo de mica necesito según mi graduación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para graduaciones leves (hasta ±2.00) recomendamos Essential (índice 1.50), que es la opción base incluida. Para graduaciones medias (±2.00 a ±4.00) el Slim HD (1.60) o Poly Plus (1.58 policarbonato). Para graduaciones altas, Ultra Slim (1.67) o Ultra Slim Pro (1.74). A mayor graduación, más delgada y ligera debe ser la mica.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo subir mi receta después de comprar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Puedes completar tu pedido y subir tu receta antes de que lo procesemos. También puedes traer tu receta impresa directamente a cualquiera de nuestras 3 ópticas en Rosarito.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tarda un pedido con lentes graduados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si solo compras el armazón, el tiempo es de 5 a 7 días. Con micas graduadas, se agregan hasta 10 días adicionales para la fabricación. Si recoges en óptica en Rosarito, te avisamos en cuanto esté listo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito seguro médico para comprar lentes en GON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Todos nuestros precios son directos al consumidor, sin intermediarios ni necesidad de seguro médico. El examen de la vista también es gratis en cualquiera de nuestras sucursales.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el filtro de luz azul y para qué sirve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El filtro de luz azul bloquea parte del espectro azul emitido por pantallas de celulares, computadoras y televisores. Reduce la fatiga visual y puede mejorar la calidad del sueño si usas dispositivos por la noche. En GON lo ofrecemos como upgrade a cualquier mica graduada.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
