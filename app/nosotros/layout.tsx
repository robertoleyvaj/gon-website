import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros — GON Ópticas",
  description:
    "Más de 12 años cuidando la visión de Rosarito. 3 sucursales, optometristas certificados por la Universidad Xochicalco, marcas Essilor y Zeiss. La óptica más importante de Rosarito, B.C.",
  keywords: [
    "óptica Rosarito historia",
    "Grupo Óptico del Noroeste",
    "optometristas certificados Rosarito",
    "Essilor Zeiss Rosarito",
    "lentes calidad Rosarito",
    "óptica familiar Rosarito",
  ],
  openGraph: {
    title: "Sobre Nosotros — GON Ópticas Rosarito",
    description:
      "12+ años, 3 sucursales, miles de pacientes atendidos. La óptica de confianza en Rosarito, B.C.",
    url: "https://www.gonmx.com/nosotros",
  },
  alternates: {
    canonical: "https://www.gonmx.com/nosotros",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
