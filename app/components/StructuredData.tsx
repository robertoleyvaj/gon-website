// app/components/StructuredData.tsx
// JSON-LD structured data para SEO local

export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      // ── Organización principal ──
      {
        "@type": "Organization",
        "@id": "https://gonmx.com/#organization",
        "name": "Grupo Óptico del Noroeste",
        "alternateName": "GON Óptica",
        "url": "https://gonmx.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://gonmx.com/logo-gon.png",
          "width": 200,
          "height": 60,
        },
        "sameAs": [
          "https://www.facebook.com/opticarosarito",
          "https://www.instagram.com/gonoptica",
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+52-664-834-3018",
          "contactType": "customer service",
          "areaServed": "MX",
          "availableLanguage": ["Spanish", "English"],
        },
      },

      // ── Sucursal 1: Óptica Baja Visión ──
      {
        "@type": "Optician",
        "@id": "https://gonmx.com/#bajavision",
        "name": "Óptica Baja Visión — GON",
        "image": "https://gonmx.com/hero-man.jpg",
        "url": "https://gonmx.com/ubicaciones",
        "telephone": "+52-664-834-3018",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Blvd. Benito Juárez 79B",
          "addressLocality": "Playas de Rosarito",
          "addressRegion": "Baja California",
          "postalCode": "22710",
          "addressCountry": "MX",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 32.3654,
          "longitude": -117.0613,
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "10:00",
            "closes": "18:00",
          },
        ],
        "hasMap": "https://maps.google.com/?q=Optica+Baja+Vision+Blvd+Benito+Juarez+Rosarito",
        "parentOrganization": { "@id": "https://gonmx.com/#organization" },
        "description": "Óptica en Rosarito con más de 9 años de experiencia. Armazones, lentes graduados, examen de la vista profesional.",
        "servesCuisine": null,
        "paymentAccepted": "Cash, Credit Card, Debit Card",
        "currenciesAccepted": "MXN, USD",
      },

      // ── Sucursal 2: Óptica Rosarito 5 de Mayo ──
      {
        "@type": "Optician",
        "@id": "https://gonmx.com/#5demayo",
        "name": "Óptica Rosarito 5 de Mayo — GON",
        "image": "https://gonmx.com/hero-man.jpg",
        "url": "https://gonmx.com/ubicaciones",
        "telephone": "+52-664-834-3018",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "C. 5 de Mayo 200, Local 1",
          "addressLocality": "Playas de Rosarito",
          "addressRegion": "Baja California",
          "postalCode": "22710",
          "addressCountry": "MX",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 32.3681,
          "longitude": -117.0598,
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "10:00",
            "closes": "18:00",
          },
        ],
        "hasMap": "https://maps.google.com/?q=Optica+Rosarito+5+de+Mayo+Rosarito+BC",
        "parentOrganization": { "@id": "https://gonmx.com/#organization" },
        "description": "Óptica en Rosarito centro. Armazones graduados, lentes de contacto, bifocales y progresivos.",
        "paymentAccepted": "Cash, Credit Card, Debit Card",
        "currenciesAccepted": "MXN, USD",
      },

      // ── Sucursal 3: Plaza Laureles ──
      {
        "@type": "Optician",
        "@id": "https://gonmx.com/#laureles",
        "name": "Óptica Rosarito Plaza Laureles — GON",
        "image": "https://gonmx.com/hero-man.jpg",
        "url": "https://gonmx.com/ubicaciones",
        "telephone": "+52-664-834-3018",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "C. José María Morelos 118, Plaza Laureles",
          "addressLocality": "Playas de Rosarito",
          "addressRegion": "Baja California",
          "postalCode": "22710",
          "addressCountry": "MX",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 32.3702,
          "longitude": -117.0581,
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "10:00",
            "closes": "18:00",
          },
        ],
        "hasMap": "https://maps.google.com/?q=Plaza+Laureles+Jose+Maria+Morelos+118+Rosarito+BC",
        "parentOrganization": { "@id": "https://gonmx.com/#organization" },
        "description": "Óptica en Plaza Laureles, Rosarito. Atención personalizada, optometristas certificados, marcas Essilor y Zeiss.",
        "paymentAccepted": "Cash, Credit Card, Debit Card",
        "currenciesAccepted": "MXN, USD",
      },

      // ── WebSite (para sitelinks search box) ──
      {
        "@type": "WebSite",
        "@id": "https://gonmx.com/#website",
        "url": "https://gonmx.com",
        "name": "GON — Grupo Óptico del Noroeste",
        "description": "Armazones, lentes y examen de la vista en Rosarito, B.C.",
        "publisher": { "@id": "https://gonmx.com/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://gonmx.com/Tienda?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
