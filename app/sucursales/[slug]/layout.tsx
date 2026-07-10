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

// ── LocalBusiness schema para SEO local de Google ─────────────
function LocalBusinessSchema({ slug }: { slug: string }) {
  const s = sucursales.find(s => s.slug === slug);
  if (!s) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Optician',
    name: s.nombre_largo,
    image: `https://gonmx.com/sucursales/${s.slug}/og.jpg`,
    url: `https://gonmx.com/sucursales/${s.slug}`,
    telephone: s.telefono,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.direccion.split(',')[0],
      addressLocality: 'Playas de Rosarito',
      addressRegion: 'Baja California',
      postalCode: '22710',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: s.lat,
      longitude: s.lng,
    },
    openingHoursSpecification: s.slug === 'optica-5-de-mayo-rosarito'
      ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '10:00', closes: '18:00' }]
      : [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '10:00', closes: '18:00' }],
    priceRange: '$$',
    currenciesAccepted: 'MXN, USD',
    paymentAccepted: 'Cash, Credit Card',
    description: s.descripcion_es,
    sameAs: [s.googleUrl],
    parentOrganization: {
      '@type': 'Organization',
      name: 'GON — Grupo Óptico del Noroeste',
      url: 'https://gonmx.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function SucursalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <LocalBusinessSchema slug={slug} />
      {children}
    </>
  );
}
