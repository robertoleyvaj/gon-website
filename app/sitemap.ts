// app/sitemap.ts
import { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gonmx.com";

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                         lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/Tienda`,             lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/examen`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ubicaciones`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/nosotros`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/lenses`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/sunglasses`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
  ];

  // Armazones individuales
  let armazonPages: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase.from("armazones").select("id, updated_at").eq("activo", true);
    if (data) {
      armazonPages = data.map((a) => ({
        url: `${baseUrl}/armazon/${a.id}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (_) {}

  return [...staticPages, ...armazonPages];
}