// /lab — prototipos internos del Home (no se indexa ni se enlaza desde ningún lado)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prototipos · GON Ópticas',
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
