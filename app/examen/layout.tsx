import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Examen de la Vista Gratis — Agenda tu Cita | GON Óptica Rosarito",
  description:
    "Agenda tu examen de la vista gratis en Rosarito, B.C. Optometristas certificados por la Universidad Xochicalco. 3 sucursales: Baja Visión, 5 de Mayo y Plaza Laureles.",
  keywords: [
    "examen de la vista Rosarito",
    "optometrista Rosarito",
    "examen visual gratis Rosarito",
    "cita óptica Rosarito",
    "graduación lentes Rosarito",
    "optometrista Baja California",
  ],
  openGraph: {
    title: "Examen de la Vista Gratis en Rosarito | GON Óptica",
    description:
      "Agenda con nuestros optometristas certificados. Sin costo, sin esperas. 3 ópticas en Rosarito, B.C.",
    url: "https://gonmx.com/examen",
  },
  alternates: {
    canonical: "https://gonmx.com/examen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
