// /borrador — Home nuevo en construcción (no se indexa ni se enlaza desde ningún lado)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Borrador · GON Ópticas',
  robots: { index: false, follow: false },
};

export default function BorradorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
