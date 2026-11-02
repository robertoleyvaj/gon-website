import type { Metadata } from "next";
import { preciosDesde, pesos } from "../lib/precios-desde";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const d = await preciosDesde();
  return {
  title: "Tipos de Lentes y Micas Graduadas en Rosarito | GON Ópticas",
  description:
    `Monofocal, bifocal, progresivo, luz azul, fotocromático y más. Micas graduadas${d.mono ? ` desde ${pesos(d.mono)}` : ""} con precio web en Rosarito, B.C. Sin seguro y con examen de la vista gratis.`,
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
    title: "Micas y Lentes Graduados | GON Ópticas Rosarito",
    description:
      "Elige entre monofocal, bifocal o progresivo. 5 materiales, 7 filtros. Recoge en cualquiera de nuestras 3 ópticas en Rosarito.",
    url: "https://www.gonmx.com/lenses",
  },
  alternates: {
    canonical: "https://www.gonmx.com/lenses",
  },
  };
}

const armarFaq = (d: Awaited<ReturnType<typeof preciosDesde>>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto cuestan los lentes graduados en Rosarito?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Con precio web en GON Ópticas, las micas monofocales empiezan en ${pesos(d.mono)}, las bifocales en ${pesos(d.bi)} y las progresivas en ${pesos(d.prog)}${d.armazon ? `, y los armazones desde ${pesos(d.armazon)}` : ""}. El total depende del armazón, del material de la mica y de los filtros que elijas.`,
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
      name: "¿Puedo comprar si todavía no tengo mi graduación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Compra o aparta tus lentes en línea y ven por tu examen de la vista gratis a cualquiera de nuestras 3 ópticas en Rosarito. En cuanto tengamos tu graduación mandamos a hacer tus lentes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tarda un pedido con lentes graduados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de la mica que elijas. Te avisamos por correo en cuanto tus lentes estén listos para recoger en la óptica que elegiste.",
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
});

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(armarFaq(await preciosDesde())) }}
      />
      {children}
    </>
  );
}
