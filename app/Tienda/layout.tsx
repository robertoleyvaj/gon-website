import type { Metadata } from "next";
import { preciosDesde, pesos } from "../lib/precios-desde";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const d = await preciosDesde();
  const desde = d.armazon ? ` desde ${pesos(d.armazon)}` : "";
  return {
  title: "Armazones y Lentes Graduados en Rosarito | GON Ópticas",
  description:
    `Armazones${desde} con precio web: hasta 60% menos comprando en línea. Agrega micas monofocales, bifocales o progresivas y recoge en cualquiera de nuestras 3 ópticas en Rosarito.`,
  keywords: [
    "armazones Rosarito",
    "lentes graduados Rosarito",
    "comprar lentes Rosarito",
    "armazones en pesos mexicanos",
    "lentes baratos Rosarito",
    "óptica online Rosarito",
    "lentes de contacto Rosarito",
    "armazones para niños Rosarito",
  ],
  openGraph: {
    title: "Armazones y Lentes en Rosarito | GON Ópticas",
    description:
      `Armazones${desde}. Hasta 60% menos en línea. Recoge en tu óptica en Rosarito.`,
    url: "https://www.gonmx.com/Tienda",
  },
  alternates: {
    canonical: "https://www.gonmx.com/Tienda",
  },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
