import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos, garantías y aviso de privacidad — GON Ópticas",
  description: "Garantía de micas y armazones, plazos para recoger tus lentes, compras en línea, apartados y aviso de privacidad de GON Ópticas en Rosarito, B.C.",
  alternates: { canonical: "https://www.gonmx.com/terminos" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
