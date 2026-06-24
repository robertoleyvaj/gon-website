// app/blog/[slug]/layout.tsx — server component for per-post metadata
import type { Metadata } from 'next';
import { posts } from '../posts';

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);

  if (!post) return { title: 'Blog | GON Óptica' };

  const url = `https://gonmx.com/blog/${post.slug}`;

  return {
    title: `${post.titulo_es} | GON Óptica Rosarito`,
    description: post.descripcion_es,
    keywords: [...post.keywords_es, ...post.keywords_en],
    alternates: {
      canonical: url,
      languages: {
        'es-MX': url,
        'en-US': url,
      },
    },
    openGraph: {
      title: post.titulo_es,
      description: post.descripcion_es,
      url,
      type: 'article',
      publishedTime: post.fecha,
      authors: ['GON Óptica'],
      locale: 'es_MX',
      alternateLocale: ['en_US'],
    },
    other: {
      // hreflang for bilingual content on same URL
      'og:locale:alternate': 'en_US',
    },
  };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
