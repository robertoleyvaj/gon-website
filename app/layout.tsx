import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import VerlyBot from "./components/verlybot";
import { LangProvider } from "./components/LanguageContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Verly Optical — Lentes accesibles para California",
  description: "Lentes graduados a tu medida, entrega rápida a California. Sin aseguranza.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{fontFamily: 'var(--font-jakarta), sans-serif'}}>
        <LangProvider>
          {children}
          <VerlyBot />
        </LangProvider>
      </body>
    </html>
  );
}