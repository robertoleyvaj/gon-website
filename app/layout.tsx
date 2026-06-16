// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import { LangProvider } from "./components/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { FavoritosProvider } from "./context/FavoritosContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gonmx.com"),
  title: {
    default: "GON — Grupo Óptico del Noroeste | Rosarito, B.C.",
    template: "%s | GON Óptica",
  },
  description:
    "Armazones modernos, lentes de calidad y examen de la vista profesional en Playas de Rosarito. Compra en línea y recoge en cualquiera de nuestras ópticas.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "óptica Rosarito",
    "lentes graduados Rosarito",
    "examen de la vista Rosarito",
    "armazones Baja California",
    "lentes en pesos",
    "óptica Playas de Rosarito",
    "Grupo Óptico del Noroeste",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://gonmx.com",
    siteName: "GON — Grupo Óptico del Noroeste",
    title: "GON — Grupo Óptico del Noroeste | Rosarito, B.C.",
    description:
      "Armazones modernos, lentes de calidad y examen de la vista profesional en Rosarito.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GON — Grupo Óptico del Noroeste",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GON — Grupo Óptico del Noroeste",
    description: "Lentes de calidad en Rosarito, B.C. Compra en línea y recoge en óptica.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://gonmx.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} $${poppins.variable}`}
      style={{ height: "100%" }}
    >
      <body style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-dm), sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}>
        <LangProvider>
          <CartProvider>
            <FavoritosProvider>
              {children}
            </FavoritosProvider>
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}