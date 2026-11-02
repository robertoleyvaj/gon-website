// app/sucursales/sucursales.ts
// ─────────────────────────────────────────────────────────────
// Para agregar fotos: pon las imágenes en /public/sucursales/baja-vision/
// y agrega el path al arreglo `fotos` de cada sucursal.
// Para agregar reseñas: copia el bloque de reseña y pega la real de Google.
// ─────────────────────────────────────────────────────────────

export interface Resena {
  nombre: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  texto: string;
  fecha: string; // e.g. "junio 2025"
  foto?: string; // URL del avatar de Google (opcional)
}

export interface Sucursal {
  slug: string;
  nombre_corto: string;   // "Baja Visión"
  nombre_largo: string;   // "Óptica Baja Visión — GON Rosarito"
  direccion: string;
  ciudad: string;
  lat: number;            // Coordenadas para schema LocalBusiness
  lng: number;
  mapsUrl: string;        // Link "Cómo llegar" → Google Maps
  googleUrl: string;      // Link al perfil de Google Business (reseñas)
  telefono: string;
  horario_es: string;
  horario_en: string;
  descripcion_es: string;
  descripcion_en: string;
  keywords_es: string[];
  keywords_en: string[];
  fotos: string[];        // paths en /public/
  resenas: Resena[];
}

export const sucursales: Sucursal[] = [
  // ─── SUCURSAL 1: BAJA VISIÓN ───────────────────────────────
  {
    slug: 'optica-baja-vision-rosarito',
    nombre_corto: 'Baja Visión',
    nombre_largo: 'Óptica Baja Visión — GON Rosarito',
    direccion: 'Blvd. Benito Juárez 79B, Playas de Rosarito, B.C.',
    ciudad: 'Playas de Rosarito',
    lat: 32.3514861,
    lng: -117.059602,
    mapsUrl: 'https://www.google.com/maps/search/Óptica+Baja+Visión+Blvd+Benito+Juárez+79+Rosarito',
    // 📌 Actualiza esta URL: busca tu negocio en Google Maps → Compartir → Copiar enlace
    googleUrl: 'https://www.google.com/maps/search/Óptica+Baja+Visión+Rosarito+661+104+0873',
    telefono: '661 104 0873',
    horario_es: 'Lunes a domingo 10:00 — 18:00',
    horario_en: 'Monday to Sunday 10:00 AM — 6:00 PM',
    descripcion_es: 'Nuestra sucursal del Bulevar Benito Juárez es la más conocida de Rosarito. Atención personalizada, optometristas certificados y entrega rápida de lentes graduados.',
    descripcion_en: 'Our Blvd. Benito Juárez location is the most recognized optical store in Rosarito. Personalized care, certified optometrists, and fast prescription lens delivery.',
    keywords_es: [
      'óptica baja visión rosarito',
      'baja vision optica rosarito',
      'optica blvd juarez rosarito',
      'lentes rosarito blvd juarez',
      'optometrista baja vision rosarito',
    ],
    keywords_en: [
      'optica baja vision rosarito',
      'optical store blvd juarez rosarito',
      'glasses rosarito blvd juarez',
    ],
    // ── Agrega aquí tus fotos reales ──
    // Formato: '/sucursales/baja-vision/foto1.jpg'
    fotos: [
      '/sucursales/baja-vision/exterior.jpg',
      '/sucursales/baja-vision/interior.jpg',
      '/sucursales/baja-vision/armazones.jpg',
      '/sucursales/baja-vision/optometrista.jpg',
    ],
    // ── Pega aquí las reseñas reales de Google ──
    resenas: [],  // solo reseñas reales de Google
  },

  // ─── SUCURSAL 2: 5 DE MAYO ─────────────────────────────────
  {
    slug: 'optica-5-de-mayo-rosarito',
    nombre_corto: '5 de Mayo',
    nombre_largo: 'Óptica Rosarito 5 de Mayo — GON',
    direccion: 'C. 5 de Mayo 200, Local 1, Playas de Rosarito, B.C.',
    ciudad: 'Playas de Rosarito',
    lat: 32.3506259,
    lng: -117.057464,
    mapsUrl: 'https://www.google.com/maps/search/Optica+Rosarito+5+de+Mayo+200+Local+1+Rosarito+BC',
    // 📌 Actualiza esta URL: busca tu negocio en Google Maps → Compartir → Copiar enlace
    googleUrl: 'https://www.google.com/maps/search/Optica+Rosarito+5+de+Mayo+661+612+0316',
    telefono: '661 612 0316',
    horario_es: 'Lunes a sábado 10:00 — 18:00',
    horario_en: 'Monday to Saturday 10:00 AM — 6:00 PM',
    descripcion_es: 'Sucursal en el corazón del centro de Rosarito, sobre la calle 5 de Mayo. Fácil acceso, estacionamiento disponible y atención con o sin cita.',
    descripcion_en: 'Located in the heart of downtown Rosarito on 5 de Mayo Street. Easy access, parking available, and walk-ins or appointments welcome.',
    keywords_es: [
      'óptica 5 de mayo rosarito',
      'optica centro rosarito',
      'lentes centro rosarito',
      'optometrista rosarito centro',
      'óptica calle 5 de mayo rosarito',
    ],
    keywords_en: [
      'optical store downtown rosarito',
      'glasses 5 de mayo rosarito',
    ],
    fotos: [
      '/sucursales/5-de-mayo/exterior.jpg',
      '/sucursales/5-de-mayo/interior.jpg',
      '/sucursales/5-de-mayo/armazones.jpg',
      '/sucursales/5-de-mayo/atencion.jpg',
    ],
    resenas: [],  // solo reseñas reales de Google
  },

  // ─── SUCURSAL 3: PLAZA LAURELES ────────────────────────────
  {
    slug: 'optica-laureles-rosarito',
    nombre_corto: 'Plaza Laureles',
    nombre_largo: 'Óptica Plaza Laureles — GON Rosarito',
    direccion: 'C. José María Morelos 118, Plaza Laureles, Playas de Rosarito, B.C.',
    ciudad: 'Playas de Rosarito',
    lat: 32.3426328,
    lng: -117.0513124,
    mapsUrl: 'https://www.google.com/maps/search/Óptica+Rosarito+Plaza+Laureles+Morelos+Rosarito+BC',
    // 📌 Actualiza esta URL: busca tu negocio en Google Maps → Compartir → Copiar enlace
    googleUrl: 'https://www.google.com/maps/search/Óptica+Rosarito+Plaza+Laureles+661+104+0431',
    telefono: '661 104 0431',
    horario_es: 'Lunes a domingo 10:00 — 18:00',
    horario_en: 'Monday to Sunday 10:00 AM — 6:00 PM',
    descripcion_es: 'Ubicados en Plaza Laureles, una de las zonas comerciales más activas de Rosarito. Atención de lunes a domingo con optometristas certificados.',
    descripcion_en: 'Located in Plaza Laureles, one of Rosarito\'s busiest commercial zones. Open Monday through Sunday with certified optometrists on staff.',
    keywords_es: [
      'óptica plaza laureles rosarito',
      'optica laureles rosarito',
      'optica morelos rosarito',
      'lentes plaza laureles rosarito',
      'optometrista laureles rosarito',
    ],
    keywords_en: [
      'optical store plaza laureles rosarito',
      'glasses plaza laureles rosarito',
    ],
    fotos: [
      '/sucursales/laureles/exterior.jpg',
      '/sucursales/laureles/interior.jpg',
      '/sucursales/laureles/armazones.jpg',
      '/sucursales/laureles/atencion.jpg',
    ],
    resenas: [],  // solo reseñas reales de Google
  },
];

export function getSucursal(slug: string): Sucursal | undefined {
  return sucursales.find(s => s.slug === slug);
}
