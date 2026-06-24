import type { Metadata } from 'next';
import { sucursales } from '../sucursales';

export async function generateStaticParams() {
  return sucursales.map(s => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const s = sucursales.find(s => s.slug === slug);
  if (!s) return { title: 'Óptica Rosarito | GON' };

  const url = `https://gonmx.com/sucursales/${s.slug}`;
  const title = `${s.nombre_largo} | Lentes Graduados Rosarito`;
  const description = `${s.descripcion_es} Examen de la vista gratis. ${s.horario_es}. ${s.direccion}.`;

  return {
    title,
    description,
    keywords: [...s.keywords_es, ...s.keywords_en],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'es_MX',
    },
  };
}

export default function SucursalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
