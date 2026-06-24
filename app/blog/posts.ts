// app/blog/posts.ts
export interface BlogPost {
  slug: string;
  fecha: string;
  categoria: 'local' | 'salud-visual' | 'frontera' | 'moda';
  imagen?: string;
  titulo_es: string;
  titulo_en: string;
  descripcion_es: string;
  descripcion_en: string;
  keywords_es: string[];
  keywords_en: string[];
  contenido_es: string;
  contenido_en: string;
}

export const posts: BlogPost[] = [
  // ──────────────────────────────────────────────────────────────
  // 1. LOCAL — Óptica en Rosarito
  // ──────────────────────────────────────────────────────────────
  {
    slug: 'optica-en-rosarito',
    fecha: '2026-06-01',
    categoria: 'local',
    titulo_es: 'Óptica en Rosarito — Todo lo que necesitas saber',
    titulo_en: 'Optical Store in Rosarito, Mexico — Your Complete Guide',
    descripcion_es: 'Encuentra la mejor óptica en Playas de Rosarito. GON Óptica ofrece lentes graduados, examen de la vista gratis y 3 sucursales. Precios en pesos, sin seguro.',
    descripcion_en: 'Looking for an optical store in Rosarito, Mexico? GON Optica offers prescription glasses, free eye exams, and 3 locations in Playas de Rosarito. No insurance needed.',
    keywords_es: ['óptica Rosarito', 'óptica Playas de Rosarito', 'lentes Rosarito', 'optometrista Rosarito', 'óptica cerca de mí Rosarito'],
    keywords_en: ['optical store Rosarito Mexico', 'glasses Rosarito', 'optometrist Rosarito', 'eye doctor Rosarito Mexico', 'prescription glasses Rosarito'],
    contenido_es: `
<h2>La óptica más completa de Rosarito</h2>
<p>Si estás buscando una óptica en Rosarito, Baja California, GON — Grupo Óptico del Noroeste — es la opción con más experiencia y más sucursales en la zona. Con más de 12 años atendiendo a familias de Rosarito y visitantes de toda la región fronteriza, somos la óptica de confianza del noroeste.</p>

<h2>¿Qué ofrecemos en GON Óptica Rosarito?</h2>
<ul>
<li><strong>Examen de la vista gratis</strong> con optometristas certificados por la Universidad Xochicalco</li>
<li><strong>Lentes graduados</strong> monofocales, bifocales y progresivos</li>
<li><strong>Más de 100 modelos de armazones</strong> para hombre, mujer y niños</li>
<li><strong>Filtros especiales</strong>: antirreflejo, luz azul, fotocromático y polarizado</li>
<li><strong>Lentes de sol</strong> con graduación y protección UV400</li>
<li><strong>Precios en pesos mexicanos</strong>, sin necesidad de seguro médico</li>
</ul>

<h2>Nuestras 3 sucursales en Rosarito</h2>
<p>Tenemos tres ubicaciones estratégicas en Playas de Rosarito para que siempre tengas una óptica cerca:</p>
<ul>
<li><strong>Óptica Baja Visión</strong> — Blvd. Benito Juárez 79B</li>
<li><strong>Óptica 5 de Mayo</strong> — C. 5 de Mayo 200, Local 1</li>
<li><strong>Plaza Laureles</strong> — C. José María Morelos 118</li>
</ul>
<p>Las tres sucursales cuentan con optometristas certificados y atención de lunes a domingo.</p>

<h2>¿Por qué elegir GON en lugar de otras ópticas?</h2>
<p>A diferencia de las grandes cadenas nacionales, en GON tenemos atención personalizada y conocemos a nuestra comunidad. No somos una franquicia — somos una empresa 100% del noroeste de México, con raíces en Rosarito y compromiso con cada paciente.</p>
<p>Además, todos nuestros lentes graduados se pueden ordenar en línea y recoger en cualquiera de nuestras sucursales, o los enviamos a domicilio en toda la república.</p>

<h2>¿Necesito seguro médico?</h2>
<p>No. En GON todos los precios son directos al consumidor. El examen de la vista también es gratuito — no necesitas seguro, orden médica ni cita previa.</p>
    `,
    contenido_en: `
<h2>The Most Complete Optical Store in Rosarito</h2>
<p>If you're looking for an optical store in Rosarito, Baja California, GON — Grupo Óptico del Noroeste — is the most experienced option in the area. With over 12 years serving families from Rosarito and visitors from across the border region, we're the trusted optical store of northwestern Mexico.</p>

<h2>What We Offer at GON Optica Rosarito</h2>
<ul>
<li><strong>Free eye exam</strong> with certified optometrists</li>
<li><strong>Prescription lenses</strong>: single vision, bifocal, and progressive</li>
<li><strong>100+ frame styles</strong> for men, women, and children</li>
<li><strong>Specialty filters</strong>: anti-reflective, blue light, photochromic, and polarized</li>
<li><strong>Prescription sunglasses</strong> with UV400 protection</li>
<li><strong>Prices in Mexican pesos</strong> — no insurance needed</li>
</ul>

<h2>Our 3 Locations in Rosarito</h2>
<p>We have three convenient locations in Playas de Rosarito:</p>
<ul>
<li><strong>Óptica Baja Visión</strong> — Blvd. Benito Juárez 79B</li>
<li><strong>Óptica 5 de Mayo</strong> — C. 5 de Mayo 200, Local 1</li>
<li><strong>Plaza Laureles</strong> — C. José María Morelos 118</li>
</ul>
<p>All three locations have certified optometrists and are open Monday through Sunday.</p>

<h2>Why Choose GON Over Other Optical Stores?</h2>
<p>Unlike large national chains, GON offers personalized attention and deep roots in the community. We're not a franchise — we're a 100% local business from northwestern Mexico, committed to every patient we see.</p>

<h2>Do I Need Insurance?</h2>
<p>No insurance required. All our prices are direct to the consumer with no middlemen. The eye exam is also free — no insurance, no prescription, no appointment needed.</p>
    `,
  },

  // ──────────────────────────────────────────────────────────────
  // 2. FRONTERA — Prescription glasses from San Diego
  // ──────────────────────────────────────────────────────────────
  {
    slug: 'prescription-glasses-rosarito-from-san-diego',
    fecha: '2026-06-02',
    categoria: 'frontera',
    titulo_es: 'Lentes graduados en Rosarito desde San Diego — La guía completa',
    titulo_en: 'Getting Prescription Glasses in Rosarito from San Diego — Complete Guide',
    descripcion_es: 'Cruza la frontera y ahorra hasta 60% en lentes graduados de calidad en Rosarito. GON Óptica ofrece examen gratis, lentes monofocales desde $749 MXN y recoge el mismo día.',
    descripcion_en: 'Cross the border and save up to 60% on quality prescription glasses in Rosarito, Mexico. GON Optica offers free eye exams, single-vision lenses from $749 MXN, and same-day pickup.',
    keywords_es: ['lentes graduados frontera Rosarito', 'óptica Rosarito San Diego', 'lentes baratos Rosarito', 'turismo médico Rosarito'],
    keywords_en: ['prescription glasses Rosarito Mexico', 'cheap glasses Rosarito', 'glasses San Diego border', 'prescription eyeglasses Tijuana Rosarito', 'affordable glasses Mexico border', 'eye care Rosarito Mexico'],
    contenido_es: `
<h2>¿Vale la pena cruzar la frontera por lentes?</h2>
<p>Sí, y mucho. Los lentes graduados en Estados Unidos pueden costar entre $300 y $800 USD, especialmente si incluyen micas progresivas o filtros especiales. En GON Óptica Rosarito, los mismos lentes de calidad cuestan entre 3 y 5 veces menos — sin sacrificar calidad ni atención profesional.</p>

<h2>¿Cuánto me ahorro exactamente?</h2>
<p>Un par de lentes monofocales con armazón en GON comienza en aproximadamente $749 MXN en micas más el precio del armazón. En dólares, eso equivale a menos de $45 USD al tipo de cambio actual. En una óptica de San Diego, el mismo servicio raramente baja de $150–200 USD.</p>

<h2>¿Puedo usar mi receta de Estados Unidos?</h2>
<p>Sí. Aceptamos recetas de optometristas y oftalmólogos de Estados Unidos. Solo trae tu receta y nosotros fabricamos tus lentes. Si no tienes receta actualizada, ofrecemos examen de la vista gratuito en cualquiera de nuestras 3 sucursales en Rosarito.</p>

<h2>¿Qué tan lejos está Rosarito de San Diego?</h2>
<p>Rosarito está a solo 30–45 minutos al sur de la frontera de San Diego/Tijuana (San Ysidro). Desde la garita de San Ysidro, tomas la Autopista de Ensenada y llegas directo a Rosarito. Las tres sucursales de GON están sobre el Boulevard Benito Juárez o muy cerca de él.</p>

<h2>¿Cuánto tiempo tarda el pedido?</h2>
<p>Para lentes monofocales sencillos, muchas veces podemos entregar el mismo día o al día siguiente. Para progresivos o micas especiales, el tiempo es de 3 a 7 días. Puedes regresar en tu próxima visita o te los enviamos por paquetería.</p>
    `,
    contenido_en: `
<h2>Is It Worth Crossing the Border for Glasses?</h2>
<p>Absolutely. Prescription glasses in the US can cost between $300–$800 USD, especially with progressive lenses or specialty filters. At GON Optica in Rosarito, the same quality glasses cost 3 to 5 times less — without sacrificing quality or professional care.</p>

<h2>How Much Can I Actually Save?</h2>
<p>A pair of single-vision lenses with frame at GON starts at around $749 MXN for the lenses, plus the cost of the frame. At current exchange rates, that's under $45 USD. At a San Diego optical store, the same service rarely drops below $150–200 USD.</p>

<h2>Can I Use My US Prescription?</h2>
<p>Yes. We accept prescriptions from US optometrists and ophthalmologists. Just bring your written prescription and we'll make your lenses. If your prescription is outdated, we offer a free eye exam at any of our 3 Rosarito locations — no appointment required.</p>

<h2>How Far Is Rosarito from San Diego?</h2>
<p>Rosarito is just 30–45 minutes south of the San Diego/Tijuana border crossing (San Ysidro). From the border, take the Ensenada Toll Road (Autopista de Ensenada) directly into Rosarito. All three GON locations are on or near Blvd. Benito Juárez.</p>

<h2>How Long Does It Take?</h2>
<p>For simple single-vision lenses, we can often deliver same-day or next day. For progressives or specialty lenses, expect 3–7 business days. You can pick them up on your next trip, or we can ship them to your US address.</p>

<h2>Is the Quality Comparable to US Glasses?</h2>
<p>Yes. We use the same international-grade lens materials — CR-39, polycarbonate, and Hi-Index 1.60/1.67/1.74 — that any US optical uses. Our optometrists are university-certified and our lens lab meets the same optical standards.</p>
    `,
  },

  // ──────────────────────────────────────────────────────────────
  // 3. SALUD VISUAL — Lentes para computadora
  // ──────────────────────────────────────────────────────────────
  {
    slug: 'lentes-para-computadora',
    fecha: '2026-06-05',
    categoria: 'salud-visual',
    titulo_es: 'Lentes para computadora: ¿de verdad sirven? Todo lo que debes saber',
    titulo_en: 'Computer Glasses and Blue Light Lenses: Do They Really Work?',
    descripcion_es: 'Los lentes con filtro de luz azul reducen la fatiga visual frente a pantallas. Descubre cómo funcionan, para quién son ideales y dónde conseguirlos en Rosarito.',
    descripcion_en: 'Blue light blocking glasses can reduce digital eye strain. Learn how they work, who benefits most, and where to get them in Rosarito, Mexico.',
    keywords_es: ['lentes para computadora Rosarito', 'filtro luz azul lentes', 'lentes luz azul Rosarito', 'fatiga visual pantallas', 'lentes antirreflejo Rosarito'],
    keywords_en: ['blue light glasses Rosarito', 'computer glasses Mexico', 'digital eye strain glasses', 'blue light filter lenses'],
    contenido_es: `
<h2>¿Qué son los lentes para computadora?</h2>
<p>Los lentes para computadora — también llamados lentes con filtro de luz azul o "blue light" — son lentes diseñados para reducir la exposición a la luz azul emitida por pantallas de celulares, computadoras y televisores. Incluyen un tratamiento especial en la mica que filtra parte de ese espectro de luz.</p>

<h2>¿Realmente funcionan?</h2>
<p>Sí, aunque con matices. El filtro de luz azul ha demostrado ser útil para reducir la fatiga visual digital (ojos cansados, secos o irritados después de mucho tiempo frente a pantallas). También puede ayudar a mejorar la calidad del sueño si usas dispositivos de noche, ya que la luz azul interfiere con la producción de melatonina.</p>
<p>Lo que NO hacen es corregir la visión ni sustituir a los lentes graduados si los necesitas.</p>

<h2>¿Para quién son ideales?</h2>
<ul>
<li>Personas que trabajan más de 4 horas diarias frente a una computadora o pantalla</li>
<li>Estudiantes con uso intensivo de dispositivos</li>
<li>Quienes experimentan dolores de cabeza frecuentes después de trabajar en pantalla</li>
<li>Personas que usan el celular antes de dormir</li>
</ul>

<h2>¿Se pueden combinar con graduación?</h2>
<p>Sí. En GON puedes agregar el filtro de luz azul a cualquier tipo de lente graduado — monofocal, bifocal o progresivo. Es solo un tratamiento adicional sobre la mica que ya elegiste.</p>

<h2>¿Cuánto cuestan en GON Rosarito?</h2>
<p>El filtro de luz azul en GON tiene un costo adicional de $549 MXN sobre el precio de tus micas. Es uno de los filtros más vendidos porque la diferencia en comodidad es notoria para quienes pasan muchas horas frente a pantallas.</p>
    `,
    contenido_en: `
<h2>What Are Computer Glasses?</h2>
<p>Computer glasses — also called blue light glasses or blue light blocking lenses — are designed to reduce your exposure to the blue light emitted by phone, computer, and TV screens. They include a special coating on the lens that filters a portion of that light spectrum.</p>

<h2>Do They Actually Work?</h2>
<p>Yes, with some nuance. Blue light filters have been shown to reduce digital eye strain — tired, dry, or irritated eyes after extended screen time. They can also help improve sleep quality if you use devices at night, since blue light interferes with melatonin production.</p>
<p>What they do NOT do is correct your vision or replace prescription glasses if you need them.</p>

<h2>Who Benefits Most?</h2>
<ul>
<li>People who spend 4+ hours daily in front of a screen</li>
<li>Students with heavy device use</li>
<li>Those who experience frequent headaches after screen work</li>
<li>People who use their phone before bed</li>
</ul>

<h2>Can They Be Combined with Prescription Lenses?</h2>
<p>Absolutely. At GON, you can add blue light filtering to any prescription lens — single vision, bifocal, or progressive. It's simply an additional coating applied to whatever lens material you choose.</p>

<h2>How Much Do They Cost at GON Rosarito?</h2>
<p>The blue light filter add-on at GON costs an additional $549 MXN on top of your lens price. It's one of our most popular upgrades because the difference in comfort is immediately noticeable for heavy screen users.</p>
    `,
  },

  // ──────────────────────────────────────────────────────────────
  // 4. SALUD VISUAL — Lentes para niños
  // ──────────────────────────────────────────────────────────────
  {
    slug: 'lentes-para-ninos-rosarito',
    fecha: '2026-06-08',
    categoria: 'salud-visual',
    titulo_es: 'Lentes para niños en Rosarito — Cuándo los necesitan y cómo elegirlos',
    titulo_en: "Children's Glasses in Rosarito — When Kids Need Them and How to Choose",
    descripcion_es: 'Guía completa sobre lentes para niños: señales de problemas de visión, tipos de lentes recomendados y dónde hacerse el examen gratis en Rosarito.',
    descripcion_en: "Complete guide to children's glasses: signs of vision problems, recommended lens types, and where to get a free eye exam in Rosarito, Mexico.",
    keywords_es: ['lentes para niños Rosarito', 'examen de la vista niños Rosarito', 'miopía infantil Rosarito', 'óptica niños Rosarito', 'lentes infantiles Rosarito'],
    keywords_en: ["children's glasses Rosarito", 'kids eye exam Rosarito', 'pediatric optometrist Rosarito Mexico', 'kids prescription glasses Mexico'],
    contenido_es: `
<h2>¿Cuándo necesita lentes un niño?</h2>
<p>Muchos niños tienen problemas de visión sin saberlo — simplemente porque nunca han visto de otra manera. Los señales de alerta más comunes son:</p>
<ul>
<li>Se acerca mucho al televisor o a las hojas</li>
<li>Se frota los ojos frecuentemente</li>
<li>Se queja de dolores de cabeza</li>
<li>Entrecierra los ojos para ver de lejos</li>
<li>Tiene bajo rendimiento escolar sin causa aparente</li>
<li>Inclina la cabeza al ver la pantalla o el pizarrón</li>
</ul>
<p>Si tu hijo presenta alguna de estas señales, lo más recomendable es hacer un examen de la vista cuanto antes. En GON lo hacemos de forma gratuita para pacientes de cualquier edad.</p>

<h2>¿A qué edad se recomienda el primer examen?</h2>
<p>Los especialistas recomiendan el primer examen visual a los 3 años de edad, aunque si hay señales de alerta puede hacerse antes. A partir de los 6 años, se recomienda un examen anual.</p>

<h2>¿Qué tipo de lentes son mejores para niños?</h2>
<p>Para niños recomendamos principalmente micas de policarbonato (Poly Plus en GON) porque son las más resistentes a impactos — ideales para el uso activo y cotidiano. Son más difíciles de romper que el CR-39 convencional, lo que las hace la opción más segura para menores.</p>

<h2>¿Qué pasa si mi hijo no quiere usar lentes?</h2>
<p>Es más común de lo que parece. Nuestra recomendación es involucrar al niño en la elección del armazón — que sienta que los lentes son "suyos". En GON tenemos modelos específicos para niños, coloridos y resistentes, que suelen gustarles. Una vez que notan que ven mejor, la resistencia desaparece rápidamente.</p>

<h2>Lentes para niños en Rosarito — GON</h2>
<p>En cualquiera de nuestras 3 sucursales hacemos examen de la vista gratuito para niños y tenemos armazones infantiles disponibles en stock. No necesitas cita previa.</p>
    `,
    contenido_en: `
<h2>When Does a Child Need Glasses?</h2>
<p>Many children have vision problems without knowing it — simply because they've never seen any differently. Common warning signs include:</p>
<ul>
<li>Sitting very close to the TV or holding books too close</li>
<li>Frequent eye rubbing</li>
<li>Complaints of headaches</li>
<li>Squinting to see things in the distance</li>
<li>Unexplained poor school performance</li>
<li>Tilting their head to see screens or the board at school</li>
</ul>
<p>If your child shows any of these signs, an eye exam is strongly recommended. At GON, we provide free eye exams for patients of all ages — no appointment needed.</p>

<h2>What Age Should Kids Have Their First Eye Exam?</h2>
<p>Specialists recommend the first visual exam at age 3, though if warning signs appear it can be done earlier. From age 6 onward, annual exams are recommended.</p>

<h2>What Type of Lenses Are Best for Kids?</h2>
<p>For children, we primarily recommend polycarbonate lenses (Poly Plus at GON) because they're the most impact-resistant — ideal for active, daily use. They're much harder to break than standard CR-39 lenses, making them the safest option for kids.</p>

<h2>What If My Child Refuses to Wear Glasses?</h2>
<p>This is more common than you'd think. Our recommendation is to involve your child in choosing the frame — so they feel ownership over their glasses. At GON, we have colorful, durable kids' frames that children tend to love. Once they realize they can see better, resistance usually disappears quickly.</p>
    `,
  },

  // ──────────────────────────────────────────────────────────────
  // 5. SALUD VISUAL — Bifocales vs Progresivos
  // ──────────────────────────────────────────────────────────────
  {
    slug: 'diferencia-lentes-bifocales-progresivos',
    fecha: '2026-06-10',
    categoria: 'salud-visual',
    titulo_es: 'Lentes bifocales vs progresivos — ¿Cuál es la diferencia y cuál te conviene?',
    titulo_en: 'Bifocal vs Progressive Lenses — What\'s the Difference and Which Is Right for You?',
    descripcion_es: 'Guía completa para entender la diferencia entre lentes bifocales y progresivos. Cuál es mejor para ti según tu graduación, edad y estilo de vida.',
    descripcion_en: 'Complete guide to understanding bifocal vs progressive lenses. Which is better for you based on your prescription, age, and lifestyle.',
    keywords_es: ['lentes bifocales vs progresivos', 'diferencia bifocal progresivo', 'lentes progresivos Rosarito', 'lentes bifocales Rosarito', 'presbicia lentes Rosarito'],
    keywords_en: ['bifocal vs progressive lenses', 'progressive lenses Rosarito', 'bifocal glasses Mexico', 'reading glasses Rosarito', 'presbyopia glasses Mexico'],
    contenido_es: `
<h2>¿Qué es la presbicia?</h2>
<p>La presbicia (también llamada "vista cansada") es la dificultad para enfocar de cerca que aparece normalmente después de los 40 años. Es causada por la pérdida gradual de elasticidad del cristalino del ojo. Si necesitas alejar el teléfono o el libro para leer, probablemente tienes presbicia.</p>

<h2>¿Qué son los lentes bifocales?</h2>
<p>Los lentes bifocales tienen dos zonas de visión claramente separadas por una línea visible: la parte superior sirve para ver de lejos y la parte inferior para ver de cerca. Son sencillos, económicos y efectivos, pero la línea puede ser visible y el salto entre zonas puede resultar molesto para algunas personas.</p>

<h2>¿Qué son los lentes progresivos?</h2>
<p>Los lentes progresivos — también llamados multifocales — ofrecen una transición suave y continua entre todas las distancias (lejos, intermedio y cerca) sin ninguna línea visible. La visión fluye de forma natural de lejos a cerca, igual que lo haría un ojo sano.</p>

<h2>¿Cuál es mejor para mí?</h2>
<p>Depende de tus necesidades y preferencias:</p>
<ul>
<li><strong>Bifocales</strong>: ideales si necesitas algo sencillo y económico, si usas los lentes principalmente para leer o para ver de lejos, o si tienes dificultad para adaptarte a los progresivos.</li>
<li><strong>Progresivos</strong>: ideales si usas la computadora y el celular durante el día, si valoras la estética (sin línea visible), o si tienes un estilo de vida activo que requiere visión a múltiples distancias.</li>
</ul>

<h2>Precios en GON Rosarito</h2>
<ul>
<li>Lentes <strong>bifocales</strong>: desde $1,149 MXN en micas + el armazón</li>
<li>Lentes <strong>progresivos</strong>: desde $1,899 MXN en micas + el armazón</li>
</ul>
<p>En cualquiera de nuestras 3 sucursales en Rosarito te hacemos un examen gratuito y te asesoramos cuál opción se adapta mejor a tu graduación y estilo de vida.</p>
    `,
    contenido_en: `
<h2>What Is Presbyopia?</h2>
<p>Presbyopia (also called "tired eyes" or age-related farsightedness) is the gradual loss of near vision that typically begins after age 40. It's caused by the natural loss of flexibility in the eye's lens. If you find yourself holding your phone or book farther away to read, you likely have presbyopia.</p>

<h2>What Are Bifocal Lenses?</h2>
<p>Bifocal lenses have two distinct vision zones separated by a visible line: the upper portion is for distance vision and the lower portion for near vision. They're straightforward, affordable, and effective — but the visible line can be noticeable and the abrupt jump between zones bothers some wearers.</p>

<h2>What Are Progressive Lenses?</h2>
<p>Progressive lenses — also called multifocal lenses — provide a smooth, continuous transition between all distances (far, intermediate, and near) with no visible line. Vision flows naturally from distance to close-up, just as a healthy young eye would see.</p>

<h2>Which Is Right for Me?</h2>
<ul>
<li><strong>Bifocals</strong>: best if you want something simple and affordable, if you mainly use glasses for reading or distance vision, or if you've had trouble adapting to progressives in the past.</li>
<li><strong>Progressives</strong>: best if you use a computer and phone throughout the day, if you value aesthetics (no visible line), or if you have an active lifestyle that requires vision at multiple distances.</li>
</ul>

<h2>Prices at GON Rosarito</h2>
<ul>
<li><strong>Bifocal</strong> lenses: from $1,149 MXN for lenses + frame cost</li>
<li><strong>Progressive</strong> lenses: from $1,899 MXN for lenses + frame cost</li>
</ul>
<p>At any of our 3 Rosarito locations, we offer a free eye exam and personalized advice on which option best fits your prescription and lifestyle.</p>
    `,
  },

  // ──────────────────────────────────────────────────────────────
  // 6. SALUD VISUAL — Miopía
  // ──────────────────────────────────────────────────────────────
  {
    slug: 'miopia-sintomas-lentes',
    fecha: '2026-06-12',
    categoria: 'salud-visual',
    titulo_es: 'Miopía: síntomas, causas y cómo elegir tus lentes en Rosarito',
    titulo_en: 'Myopia: Symptoms, Causes, and How to Choose Your Glasses in Rosarito',
    descripcion_es: 'La miopía es el problema de visión más común. Aprende a identificar sus síntomas, sus causas y cómo los lentes graduados te ayudan a verla más claro.',
    descripcion_en: 'Myopia (nearsightedness) is the most common vision problem. Learn to identify its symptoms, causes, and how prescription glasses can help you see clearly again.',
    keywords_es: ['miopía síntomas', 'lentes para miopía Rosarito', 'soy miope qué hago', 'graduación miopía', 'miopía Rosarito'],
    keywords_en: ['myopia symptoms', 'nearsighted glasses Rosarito', 'myopia treatment Mexico', 'prescription glasses for myopia Rosarito'],
    contenido_es: `
<h2>¿Qué es la miopía?</h2>
<p>La miopía (o "miopía simple") es una condición visual en la que puedes ver bien de cerca pero con dificultad de lejos. El ojo de una persona miope enfoca la imagen frente a la retina en lugar de sobre ella, lo que hace que los objetos distantes se vean borrosos.</p>

<h2>Síntomas de la miopía</h2>
<ul>
<li>Dificultad para ver la televisión, el pizarrón o señales de tráfico de lejos</li>
<li>Cerrar los ojos o entrecerrarlos para ver mejor</li>
<li>Dolores de cabeza frecuentes, especialmente después de actividades visuales</li>
<li>Fatiga ocular</li>
<li>Parpadeo excesivo</li>
</ul>

<h2>¿Cuál es la causa?</h2>
<p>La miopía suele ser hereditaria, pero también puede desarrollarse o empeorar por el uso excesivo de pantallas, la falta de tiempo al aire libre durante la infancia, o simplemente por el crecimiento del globo ocular. Es muy común: se estima que cerca del 30% de la población mundial tiene algún grado de miopía.</p>

<h2>¿Cómo se corrige?</h2>
<p>La forma más simple y económica de corregir la miopía es con lentes graduados (armazón o contacto). Los lentes divergentes (con signo negativo en la receta) compensan el exceso de curvatura del ojo y devuelven la imagen a la retina.</p>

<h2>¿Qué mica es mejor para miopía?</h2>
<p>Depende de la graduación:</p>
<ul>
<li><strong>Essential (CR-39)</strong>: para graduaciones hasta -2.00 dioptrías</li>
<li><strong>Slim HD (1.60)</strong>: para -2.00 a -4.00, más delgada y ligera</li>
<li><strong>Poly Plus (policarbonato)</strong>: resistente, ideal para uso activo hasta -4.00</li>
<li><strong>Ultra Slim (1.67)</strong>: para -4.00 a -6.00 dioptrías</li>
<li><strong>Ultra Slim Pro (1.74)</strong>: para graduaciones mayores a -6.00</li>
</ul>
<p>En GON te asesoramos sin costo para que elijas la mica correcta según tu graduación exacta.</p>
    `,
    contenido_en: `
<h2>What Is Myopia?</h2>
<p>Myopia (nearsightedness) is a vision condition where you can see clearly up close but have difficulty seeing distant objects. In a myopic eye, the image focuses in front of the retina instead of on it, making faraway objects appear blurry.</p>

<h2>Symptoms of Myopia</h2>
<ul>
<li>Difficulty seeing the TV, whiteboard, or street signs from a distance</li>
<li>Squinting to see more clearly</li>
<li>Frequent headaches, especially after visual tasks</li>
<li>Eye fatigue</li>
<li>Excessive blinking</li>
</ul>

<h2>What Causes It?</h2>
<p>Myopia is often hereditary, but it can also develop or worsen from excessive screen use, lack of outdoor time during childhood, or simply from the natural growth of the eye. It's very common — approximately 30% of the world's population has some degree of myopia.</p>

<h2>How Is It Corrected?</h2>
<p>The simplest and most affordable way to correct myopia is with prescription glasses (frames or contact lenses). Diverging lenses (marked with a negative sign on your prescription) compensate for the excess curvature of the eye and bring the image back onto the retina.</p>

<h2>Which Lens Material Is Best for Myopia?</h2>
<p>It depends on your prescription strength:</p>
<ul>
<li><strong>Essential (CR-39)</strong>: for prescriptions up to -2.00 diopters</li>
<li><strong>Slim HD (1.60)</strong>: for -2.00 to -4.00, thinner and lighter</li>
<li><strong>Poly Plus (polycarbonate)</strong>: impact-resistant, great for active use up to -4.00</li>
<li><strong>Ultra Slim (1.67)</strong>: for -4.00 to -6.00 diopters</li>
<li><strong>Ultra Slim Pro (1.74)</strong>: for prescriptions above -6.00</li>
</ul>
<p>At GON we provide free advice to help you choose the right lens material based on your exact prescription.</p>
    `,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug);
}

export function getPostsByCategory(cat: BlogPost['categoria']): BlogPost[] {
  return posts.filter(p => p.categoria === cat);
}
