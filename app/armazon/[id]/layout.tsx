// app/armazon/[id]/layout.tsx  — server component
import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getArmazon(id: string) {
  const { data } = await supabase
    .from('armazones')
    .select('nombre, modelo, forma, genero, tipo, imagen_url, precio_gon, precio')
    .eq('id', id)
    .eq('activo', true)
    .single();
  return data;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const data = await getArmazon(id);

  if (!data) return { title: 'Armazón | GON Óptica' };

  const nombre = data.nombre || data.modelo || 'Armazón';
  const forma  = data.forma  ? `${data.forma} ` : '';
  const genero = data.genero === 'hombre' ? 'para hombre' : data.genero === 'mujer' ? 'para mujer' : '';
  const tipo   = data.tipo   ? `${data.tipo} ` : '';

  const title = `${nombre} — Armazón ${forma}${tipo}${genero} | GON Óptica Rosarito`;
  const description = `Compra el ${nombre} en GON Óptica Rosarito. Armazón ${forma}${genero} con lentes graduados desde $749 MXN. Monofocal, bifocal o progresivo. Recoge el mismo día en cualquiera de nuestras 3 sucursales.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url:    `https://gonmx.com/armazon/${id}`,
      images: data.imagen_url
        ? [{ url: data.imagen_url, width: 800, height: 600, alt: nombre }]
        : [],
    },
    alternates: { canonical: `https://gonmx.com/armazon/${id}` },
  };
}

export default async function ArmazonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getArmazon(id);

  const productSchema = data ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.nombre || data.modelo || 'Armazón',
    brand: { '@type': 'Brand', name: 'GON Óptica' },
    category: 'Eyeglasses',
    image: data.imagen_url ? [data.imagen_url] : [],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MXN',
      price: data.precio_gon || Math.round((data.precio || 0) * 18),
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Grupo Óptico del Noroeste' },
      url: `https://gonmx.com/armazon/${id}`,
    },
  } : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {children}
    </>
  );
}
