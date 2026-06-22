import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Armazones y Lentes Graduados en Rosarito | GON Óptica",
  description:
    "Explora más de 48 modelos de armazones para adultos y niños. Precios en pesos, lentes graduados, bifocales, progresivos y filtros. Recoge en cualquiera de nuestras 3 ópticas en Rosarito.",
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
    title: "Armazones y Lentes en Rosarito | GON Óptica",
    description:
      "48+ modelos desde $230 MXN. Graduados, bifocales, progresivos. Recoge en óptica el mismo día.",
    url: "https://gonmx.com/Tienda",
  },
  alternates: {
    canonical: "https://gonmx.com/Tienda",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
