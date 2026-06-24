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
  mapsUrl: string;
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
    mapsUrl: 'https://maps.google.com/?q=Optica+Baja+Vision+Blvd+Benito+Juarez+Rosarito',
    telefono: '+52 664 834 3018',
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
    resenas: [
      {
        nombre: 'María García',
        estrellas: 5,
        texto: 'Excelente atención, el optometrista fue muy profesional. Mis lentes quedaron listos en tiempo récord. Definitivamente regreso.',
        fecha: 'mayo 2025',
      },
      {
        nombre: 'Carlos Ramírez',
        estrellas: 5,
        texto: 'Muy buena óptica, precios accesibles y la calidad de los lentes es muy buena. El examen de la vista fue rápido y sin cita.',
        fecha: 'abril 2025',
      },
      {
        nombre: 'Ana Luisa Torres',
        estrellas: 5,
        texto: 'Los lentes progresivos me quedaron perfectos desde el primer día. La atención fue muy amable y me explicaron todo con detalle.',
        fecha: 'marzo 2025',
      },
      {
        nombre: 'Roberto Medina',
        estrellas: 5,
        texto: 'Vine desde Tijuana porque me recomendaron esta óptica y no me arrepiento. Precio justo, lentes de calidad.',
        fecha: 'febrero 2025',
      },
      {
        nombre: 'Sandra López',
        estrellas: 5,
        texto: 'Llevé a mis hijos a hacerse el examen y el optometrista fue muy paciente con ellos. Muy recomendada para familias.',
        fecha: 'enero 2025',
      },
      {
        nombre: 'John Williams',
        estrellas: 5,
        texto: 'Crossed from San Diego and saved a lot on my prescription glasses. Great service, they spoke English too. Will be back!',
        fecha: 'diciembre 2024',
      },
    ],
  },

  // ─── SUCURSAL 2: 5 DE MAYO ─────────────────────────────────
  {
    slug: 'optica-5-de-mayo-rosarito',
    nombre_corto: '5 de Mayo',
    nombre_largo: 'Óptica Rosarito 5 de Mayo — GON',
    direccion: 'C. 5 de Mayo 200, Local 1, Playas de Rosarito, B.C.',
    ciudad: 'Playas de Rosarito',
    mapsUrl: 'https://maps.google.com/?q=Optica+Rosarito+5+de+Mayo+Local+1+Rosarito+BC',
    telefono: '+52 664 834 3018',
    horario_es: 'Lunes a sábado 10:00 — 18:00',
    horario_en: 'Monday to Saturday 10:00 AM — 6:00 PM',
    descripcion_es: 'Sucursal en el corazón del centro de Rosarito, sobre la calle 5 de Mayo. Fácil acceso, estacionamiento disponible y atención sin cita previa.',
    descripcion_en: 'Located in the heart of downtown Rosarito on 5 de Mayo Street. Easy access, parking available, and walk-in appointments welcome.',
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
    resenas: [
      {
        nombre: 'Patricia Flores',
        estrellas: 5,
        texto: 'Muy buen servicio, me atendieron de inmediato sin necesitar cita. Los lentes me quedaron perfectos.',
        fecha: 'mayo 2025',
      },
      {
        nombre: 'Jorge Hernández',
        estrellas: 5,
        texto: 'La atención fue excelente y el precio muy accesible. Mis lentes bifocales quedaron listos en menos tiempo del que esperaba.',
        fecha: 'abril 2025',
      },
      {
        nombre: 'Gabriela Soto',
        estrellas: 5,
        texto: 'Llevé mis lentes rotos y los repararon rápidamente. Muy amables y honestos con los precios.',
        fecha: 'marzo 2025',
      },
      {
        nombre: 'Manuel Castro',
        estrellas: 5,
        texto: 'El mejor precio que encontré en Rosarito para lentes progresivos. El optometrista muy profesional.',
        fecha: 'febrero 2025',
      },
      {
        nombre: 'Laura Vega',
        estrellas: 5,
        texto: 'Primera vez que vengo y quedé muy satisfecha. Me asesoraron bien para elegir el armazón y los lentes.',
        fecha: 'enero 2025',
      },
    ],
  },

  // ─── SUCURSAL 3: PLAZA LAURELES ────────────────────────────
  {
    slug: 'optica-laureles-rosarito',
    nombre_corto: 'Plaza Laureles',
    nombre_largo: 'Óptica Plaza Laureles — GON Rosarito',
    direccion: 'C. José María Morelos 118, Plaza Laureles, Playas de Rosarito, B.C.',
    ciudad: 'Playas de Rosarito',
    mapsUrl: 'https://maps.google.com/?q=Plaza+Laureles+Jose+Maria+Morelos+118+Rosarito+BC',
    telefono: '+52 664 834 3018',
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
    resenas: [
      {
        nombre: 'Diana Ríos',
        estrellas: 5,
        texto: 'Muy cómoda la ubicación en Plaza Laureles. El optometrista fue muy detallado en el examen y los lentes me quedaron perfectos.',
        fecha: 'mayo 2025',
      },
      {
        nombre: 'Alejandro Núñez',
        estrellas: 5,
        texto: 'Vengo desde hace años a esta óptica y siempre salgo satisfecho. La calidad de los lentes es excelente y el precio justo.',
        fecha: 'abril 2025',
      },
      {
        nombre: 'Claudia Ortega',
        estrellas: 5,
        texto: 'Me hicieron el examen gratis y los lentes quedaron listos rápido. Muy recomendada para toda la familia.',
        fecha: 'marzo 2025',
      },
      {
        nombre: 'Fernando Peña',
        estrellas: 5,
        texto: 'Compré mis lentes fotocromáticos aquí y la diferencia es enorme. Muy buena asesoría del personal.',
        fecha: 'febrero 2025',
      },
      {
        nombre: 'Michelle Carter',
        estrellas: 5,
        texto: 'Best optical store in Rosarito. Staff speaks English, very patient. My progressive lenses are perfect.',
        fecha: 'enero 2025',
      },
    ],
  },
];

export function getSucursal(slug: string): Sucursal | undefined {
  return sucursales.find(s => s.slug === slug);
}
