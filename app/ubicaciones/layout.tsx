import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubicaciones — 3 Ópticas en Rosarito, B.C. | GON",
  description:
    "Encuentra nuestras 3 ópticas en Rosarito: Baja Visión (Blvd. Benito Juárez), 5 de Mayo y Plaza Laureles. Horarios, mapas y WhatsApp directo.",
  keywords: [
    "óptica Rosarito ubicación",
    "óptica Baja Visión Rosarito",
    "óptica 5 de Mayo Rosarito",
    "Plaza Laureles óptica",
    "horario óptica Rosarito",
    "lentes Rosarito dirección",
  ],
  openGraph: {
    title: "Nuestras Ubicaciones — GON Ópticas Rosarito",
    description:
      "3 ópticas en Rosarito, B.C. de 10 a 18 hrs (5 de Mayo cierra domingos). Examen de la vista gratis, con o sin cita.",
    url: "https://www.gonmx.com/ubicaciones",
  },
  alternates: {
    canonical: "https://www.gonmx.com/ubicaciones",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
