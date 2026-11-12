// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/lab"],
      },
    ],
    sitemap: "https://www.gonmx.com/sitemap.xml",
  };
}