import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lentes de Sol Graduables en Rosarito — UV400 | GON Óptica",
  description:
    "Lentes de sol con protección UV400, todos graduables. Modelos para hombre, mujer y unisex desde $350 MXN. Recoge en nuestras ópticas en Rosarito, B.C.",
  keywords: [
    "lentes de sol Rosarito",
    "lentes de sol graduados Rosarito",
    "lentes de sol UV400 Rosarito",
    "sunglasses Rosarito",
    "gafas de sol Rosarito",
    "lentes de sol polarizados Rosarito",
    "lentes de sol hombre Rosarito",
    "lentes de sol mujer Rosarito",
  ],
  openGraph: {
    title: "Lentes de Sol UV400 Graduables | GON Óptica Rosarito",
    description:
      "Protección UV400, todos graduables, polarizado disponible. Modelos para hombre, mujer y unisex. Sin seguro.",
    url: "https://gonmx.com/sunglasses",
  },
  alternates: {
    canonical: "https://gonmx.com/sunglasses",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Los lentes de sol de GON se pueden graduar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Todos los modelos de lentes de sol de GON Óptica son graduables. Puedes agregar tu graduación (monofocal, bifocal o progresivo) al momento de comprarlos, incluyendo filtros como polarizado o fotocromático.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué protección UV ofrecen los lentes de sol de GON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Todos nuestros lentes de sol incluyen protección UV400, que bloquea el 100% de los rayos UVA y UVB. Esta es la máxima protección solar disponible para lentes ópticos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la diferencia entre lentes polarizados y no polarizados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los lentes polarizados eliminan los reflejos de superficies como agua, asfalto y vidrio, lo que mejora la visión en exteriores. Son ideales para manejar, playa y actividades al aire libre. Los no polarizados ofrecen protección UV pero sin reducción de reflejos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito seguro médico para comprar lentes de sol graduados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. En GON los precios son directos sin necesidad de seguro. Si no tienes tu receta, ofrecemos examen de la vista gratis en cualquiera de nuestras 3 sucursales en Rosarito.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tardan los lentes de sol con graduación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El armazón solo tarda entre 5 y 7 días. Con micas graduadas se agregan hasta 10 días adicionales. Recibes una notificación cuando esté listo para recoger en tu óptica GON más cercana en Rosarito.",
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
