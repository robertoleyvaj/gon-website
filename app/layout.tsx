// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "./components/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import StructuredData from "./components/StructuredData";
import FooterGon from "./components/FooterGon";
import WhatsAppCodigo from "./components/WhatsAppCodigo";

// Tipografías: se cargan directo de Google Fonts con <link> (next/font/google fallaba en el build de Vercel)
const FUENTES = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap";

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
    apple: "/apple-touch-icon.png",
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
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
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
      style={{ height: "100%" }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FUENTES} />
      </head>
      <body style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-dm), sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2352394322228270');
            fbq('track', 'PageView');
          `}
        </Script>
        <StructuredData />
        <LangProvider>
          <CartProvider>
            <FavoritosProvider>
              {children}
              <FooterGon />
              <WhatsAppCodigo />
            </FavoritosProvider>
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
