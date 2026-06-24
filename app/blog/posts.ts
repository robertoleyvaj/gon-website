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

  // ── 7. lentes baratos rosarito ─────────────────────────────
  {
    slug: 'lentes-baratos-rosarito',
    fecha: '2026-06-14',
    categoria: 'local',
    titulo_es: 'Lentes baratos en Rosarito — precios reales sin letra chica',
    titulo_en: 'Cheap Glasses in Rosarito — Real Prices, No Hidden Fees',
    descripcion_es: 'Lentes graduados baratos en Rosarito desde $749 MXN. Sin seguro, sin cita, sin sorpresas. Tres sucursales en Playas de Rosarito.',
    descripcion_en: 'Affordable prescription glasses in Rosarito from $749 MXN. No insurance, no appointment, no surprises. Three locations in Playas de Rosarito.',
    keywords_es: ['lentes baratos rosarito','lentes economicos rosarito','lentes graduados baratos rosarito','donde comprar lentes baratos rosarito'],
    keywords_en: ['cheap glasses rosarito','affordable glasses rosarito mexico','inexpensive prescription glasses rosarito'],
    contenido_es: `
<h2>¿Cuánto cuestan los lentes en Rosarito?</h2>
<p>En GON Óptica los precios son directos — sin seguros, sin intermediarios. Los lentes monofocales más sencillos comienzan desde <strong>$749 MXN</strong> en micas, más el armazón que elijas. La mayoría de nuestros armazones están entre $300 y $1,200 MXN.</p>
<h2>¿Por qué son tan baratos comparado con Estados Unidos?</h2>
<p>Los lentes en México cuestan entre 3 y 5 veces menos que en EE.UU. porque no hay intermediarios de seguros, los costos operativos son menores y el peso mexicano hace que los precios sean muy accesibles para quien gana en dólares.</p>
<h2>¿La calidad es buena aunque sean baratos?</h2>
<p>Sí. Usamos micas de las mismas marcas internacionales — CR-39, policarbonato, Hi-Index. "Barato" en GON no significa baja calidad; significa que no pagas el margen de un seguro médico ni la renta de una plaza cara.</p>
<h2>Precios de referencia en GON Rosarito</h2>
<ul>
<li><strong>Monofocal Essential (CR-39)</strong>: $749 MXN</li>
<li><strong>Monofocal Slim HD (1.60)</strong>: $1,146 MXN</li>
<li><strong>Bifocal</strong>: desde $1,149 MXN</li>
<li><strong>Progresivo</strong>: desde $1,899 MXN</li>
</ul>
<p>El examen de la vista es gratis. No necesitas cita ni seguro médico.</p>`,
    contenido_en: `
<h2>How Much Do Glasses Cost in Rosarito?</h2>
<p>At GON Optica, prices are direct — no insurance, no middlemen. Single-vision lenses start from <strong>$749 MXN</strong> (around $40 USD), plus the frame you choose. Most frames range from $300 to $1,200 MXN.</p>
<h2>Why Are They So Much Cheaper Than in the US?</h2>
<p>Glasses in Mexico cost 3–5x less than in the US because there's no insurance markup, lower operating costs, and the exchange rate makes prices very accessible for USD earners.</p>
<h2>Is the Quality Still Good?</h2>
<p>Yes. We use the same international-grade lens materials — CR-39, polycarbonate, Hi-Index. "Cheap" at GON means you're not paying an insurance company's markup, not that quality is compromised.</p>
<h2>Reference Prices at GON Rosarito</h2>
<ul>
<li><strong>Single Vision Essential (CR-39)</strong>: $749 MXN (~$40 USD)</li>
<li><strong>Single Vision Slim HD (1.60)</strong>: $1,146 MXN (~$60 USD)</li>
<li><strong>Bifocal</strong>: from $1,149 MXN (~$62 USD)</li>
<li><strong>Progressive</strong>: from $1,899 MXN (~$102 USD)</li>
</ul>
<p>Eye exam is free. No insurance or appointment needed.</p>`,
  },

  // ── 8. lentes urgentes rosarito ────────────────────────────
  {
    slug: 'lentes-urgentes-rosarito',
    fecha: '2026-06-14',
    categoria: 'local',
    titulo_es: 'Lentes urgentes en Rosarito — ¿cuánto tardan y qué opciones tienes?',
    titulo_en: 'Urgent Glasses in Rosarito — How Fast Can You Get Them?',
    descripcion_es: 'Necesitas lentes urgentes en Rosarito. Descubre cuánto tardan los monofocales, progresivos y de emergencia. GON tiene 3 sucursales abiertas sin cita.',
    descripcion_en: 'Need glasses fast in Rosarito? Find out how quickly you can get single vision, progressives, or emergency replacement glasses at GON Optica.',
    keywords_es: ['lentes urgentes rosarito','lentes express rosarito','lentes rapidos rosarito','lentes mismo dia rosarito','lentes emergencia rosarito'],
    keywords_en: ['urgent glasses rosarito','same day glasses rosarito','emergency glasses rosarito mexico','fast glasses rosarito'],
    contenido_es: `
<h2>¿Se pueden hacer lentes el mismo día en Rosarito?</h2>
<p>Para lentes monofocales sencillos (CR-39 o policarbonato, sin filtros especiales), en GON muchas veces podemos entregarlos el mismo día o al siguiente día hábil. Depende de tu graduación y la carga de trabajo del laboratorio ese día.</p>
<h2>¿Cuánto tardan según el tipo de lente?</h2>
<ul>
<li><strong>Monofocal básico</strong>: 1–2 días en la mayoría de los casos</li>
<li><strong>Monofocal con filtro (antirreflejo, luz azul)</strong>: 2–3 días</li>
<li><strong>Bifocal</strong>: 3–5 días</li>
<li><strong>Progresivo</strong>: 5–7 días</li>
<li><strong>Fotocromático o polarizado</strong>: 5–7 días</li>
</ul>
<h2>Perdí mis lentes, ¿qué hago?</h2>
<p>Si perdiste o rompiste tus lentes, ven directamente a cualquiera de nuestras 3 sucursales. Si traes tu receta anterior, podemos empezar de inmediato. Si no la tienes, te hacemos el examen de la vista gratis en el momento y comenzamos tu pedido ese mismo día.</p>
<h2>¿Tienen lentes temporales mientras espero?</h2>
<p>Podemos orientarte sobre lentes de lectura de emergencia si tu caso lo permite, aunque lo más recomendable es fabricar tus lentes correctos lo antes posible para no forzar la vista.</p>`,
    contenido_en: `
<h2>Can You Get Same-Day Glasses in Rosarito?</h2>
<p>For simple single-vision lenses (CR-39 or polycarbonate, no special filters), GON can often deliver same-day or next business day. It depends on your prescription and the lab's workload that day.</p>
<h2>How Long Does Each Type Take?</h2>
<ul>
<li><strong>Basic single vision</strong>: 1–2 days in most cases</li>
<li><strong>Single vision with filter (anti-reflective, blue light)</strong>: 2–3 days</li>
<li><strong>Bifocal</strong>: 3–5 days</li>
<li><strong>Progressive</strong>: 5–7 days</li>
<li><strong>Photochromic or polarized</strong>: 5–7 days</li>
</ul>
<h2>I Lost My Glasses — What Do I Do?</h2>
<p>Come directly to any of our 3 locations. If you have your previous prescription, we can start right away. If not, we'll give you a free eye exam on the spot and begin your order the same day.</p>`,
  },

  // ── 9. examen vista gratis rosarito ────────────────────────
  {
    slug: 'examen-vista-gratis-rosarito',
    fecha: '2026-06-15',
    categoria: 'local',
    titulo_es: 'Examen de la vista gratis en Rosarito — sin cita, sin seguro',
    titulo_en: 'Free Eye Exam in Rosarito — No Appointment, No Insurance',
    descripcion_es: 'GON Óptica ofrece examen de la vista gratuito en sus 3 sucursales en Rosarito. Sin cita previa, sin seguro médico. Optometristas certificados.',
    descripcion_en: 'GON Optica offers free eye exams at all 3 Rosarito locations. No appointment needed, no insurance required. Certified optometrists on staff.',
    keywords_es: ['examen de la vista gratis rosarito','graduacion gratis rosarito','optometrista gratis rosarito','revision de la vista rosarito'],
    keywords_en: ['free eye exam rosarito','free eye exam rosarito mexico','no cost eye exam rosarito'],
    contenido_es: `
<h2>¿El examen de la vista es realmente gratis?</h2>
<p>Sí, completamente gratis. En GON Óptica el examen de la vista no tiene costo en ninguna de nuestras 3 sucursales en Rosarito. No necesitas seguro médico, cita previa ni comprar nada.</p>
<h2>¿Qué incluye el examen?</h2>
<ul>
<li>Evaluación de agudeza visual (lejos y cerca)</li>
<li>Detección de miopía, hipermetropía y astigmatismo</li>
<li>Evaluación de presbicia (vista cansada)</li>
<li>Receta médica impresa al finalizar</li>
</ul>
<h2>¿Quiénes hacen el examen?</h2>
<p>Todos nuestros optometristas están certificados por universidades reconocidas. El examen sigue los mismos protocolos que cualquier óptica privada — la diferencia es que en GON no te cobramos por él.</p>
<h2>¿Puedo pedir solo el examen sin comprar lentes?</h2>
<p>Sí. El examen es gratuito independientemente de si compras o no. Te damos tu receta para que hagas lo que quieras con ella.</p>
<h2>Horarios y ubicaciones</h2>
<ul>
<li>Blvd. Benito Juárez 79B — Lun a Dom 10:00–18:00</li>
<li>C. 5 de Mayo 200, Local 1 — Lun a Sáb 10:00–18:00</li>
<li>Plaza Laureles, Morelos 118 — Lun a Dom 10:00–18:00</li>
</ul>`,
    contenido_en: `
<h2>Is the Eye Exam Really Free?</h2>
<p>Yes, completely free. At GON Optica, the eye exam costs nothing at any of our 3 Rosarito locations. No insurance, no appointment, no purchase required.</p>
<h2>What Does the Exam Include?</h2>
<ul>
<li>Visual acuity evaluation (distance and near)</li>
<li>Detection of myopia, hyperopia, and astigmatism</li>
<li>Presbyopia (reading vision) assessment</li>
<li>Written prescription at the end</li>
</ul>
<h2>Can I Just Get the Exam Without Buying Glasses?</h2>
<p>Yes. The exam is free regardless of whether you purchase anything. You get your prescription to use wherever you'd like.</p>
<h2>Hours and Locations</h2>
<ul>
<li>Blvd. Benito Juárez 79B — Mon–Sun 10:00 AM–6:00 PM</li>
<li>C. 5 de Mayo 200, Local 1 — Mon–Sat 10:00 AM–6:00 PM</li>
<li>Plaza Laureles, Morelos 118 — Mon–Sun 10:00 AM–6:00 PM</li>
</ul>`,
  },

  // ── 10. optometrista rosarito ───────────────────────────────
  {
    slug: 'optometrista-rosarito',
    fecha: '2026-06-15',
    categoria: 'local',
    titulo_es: 'Optometrista en Rosarito — certificados, sin cita, examen gratis',
    titulo_en: 'Optometrist in Rosarito, Mexico — Certified, Walk-In, Free Exam',
    descripcion_es: 'Encuentra optometristas certificados en Rosarito, B.C. GON Óptica tiene 3 sucursales con examen de la vista gratis. Sin cita, sin seguro.',
    descripcion_en: 'Find certified optometrists in Rosarito, BC. GON Optica has 3 locations with free eye exams. Walk-ins welcome, no insurance needed.',
    keywords_es: ['optometrista rosarito','optometrista playas de rosarito','doctor ojos rosarito','revision ojos rosarito'],
    keywords_en: ['optometrist rosarito mexico','eye doctor rosarito','optometrist playas de rosarito'],
    contenido_es: `
<h2>¿Qué hace un optometrista?</h2>
<p>Un optometrista es el profesional de salud visual especializado en detectar y corregir problemas de refracción como miopía, hipermetropía, astigmatismo y presbicia. No es médico cirujano — para enfermedades oculares como cataratas o glaucoma necesitas un oftalmólogo. Para graduarte y elegir tus lentes, el optometrista es quien necesitas.</p>
<h2>¿Cómo sé si el optometrista es bueno?</h2>
<p>En GON todos nuestros optometristas tienen título universitario y cédula profesional. Llevan años atendiendo a familias de Rosarito y la zona fronteriza. Puedes verificar sus credenciales en cualquier momento.</p>
<h2>¿Necesito cita con el optometrista?</h2>
<p>No. En las 3 sucursales de GON en Rosarito atendemos sin cita previa. Llega, espera unos minutos si hay pacientes antes, y te atendemos.</p>
<h2>¿Cuánto cobra el optometrista en Rosarito?</h2>
<p>En GON el examen es completamente gratuito. Algunos consultorios independientes cobran entre $100 y $300 MXN por consulta.</p>`,
    contenido_en: `
<h2>What Does an Optometrist Do?</h2>
<p>An optometrist is a vision health professional specializing in detecting and correcting refractive errors like myopia, hyperopia, astigmatism, and presbyopia. For eye diseases like cataracts or glaucoma you need an ophthalmologist. For getting your prescription and choosing glasses, an optometrist is who you need.</p>
<h2>Do I Need an Appointment?</h2>
<p>No. At all 3 GON locations in Rosarito we welcome walk-ins. Arrive, wait a few minutes if there are patients ahead of you, and we'll see you.</p>
<h2>How Much Does an Optometrist Cost in Rosarito?</h2>
<p>At GON, the exam is completely free. Independent optometry offices typically charge between $100–$300 MXN for a consultation.</p>`,
  },

  // ── 11. cheap glasses rosarito (EN) ────────────────────────
  {
    slug: 'cheap-glasses-rosarito-mexico',
    fecha: '2026-06-16',
    categoria: 'frontera',
    titulo_es: 'Lentes baratos en Rosarito México — la guía para cruzar la frontera',
    titulo_en: 'Cheap Glasses in Rosarito Mexico — Everything You Need to Know',
    descripcion_es: 'Ahorra hasta 70% en lentes graduados cruzando a Rosarito, México. GON Óptica: examen gratis, lentes desde $749 MXN, 3 sucursales, atención en inglés.',
    descripcion_en: 'Save up to 70% on prescription glasses by crossing to Rosarito, Mexico. GON Optica: free eye exam, lenses from $749 MXN, 3 locations, English-speaking staff.',
    keywords_es: ['lentes baratos rosarito mexico','lentes economicos cruzar frontera','optica frontera rosarito'],
    keywords_en: ['cheap glasses rosarito mexico','affordable eyeglasses rosarito','cheap prescription glasses mexico border','glasses mexico border san diego'],
    contenido_es: `
<h2>¿Cuánto puedo ahorrar comprando lentes en Rosarito?</h2>
<p>Un par de lentes monofocales con armazón en GON Rosarito cuesta entre $1,000 y $2,500 MXN dependiendo del material y armazón — unos $55–$135 USD al tipo de cambio actual. El mismo par en San Diego difícilmente baja de $200–$400 USD. El ahorro puede ser del 60–70%.</p>
<h2>¿Es seguro cruzar la frontera para lentes?</h2>
<p>Completamente. Rosarito es una ciudad tranquila y turística a 30 minutos de la garita de San Ysidro. Miles de personas del lado americano cruzan regularmente para servicios dentales, médicos y ópticos. GON tiene más de 12 años atendiendo a clientes de ambos lados de la frontera.</p>
<h2>¿Hablan inglés en GON?</h2>
<p>Sí. Nuestro personal habla inglés y estamos acostumbrados a atender a clientes que vienen desde el lado americano. No necesitas hablar español.</p>`,
    contenido_en: `
<h2>How Much Can I Save on Glasses in Rosarito?</h2>
<p>A pair of single-vision glasses with a frame at GON Rosarito costs between $1,000–$2,500 MXN depending on the lens material and frame — roughly $55–$135 USD at current exchange rates. The same pair in San Diego rarely drops below $200–$400 USD. Savings can be 60–70%.</p>
<h2>Is It Safe to Cross the Border for Glasses?</h2>
<p>Absolutely. Rosarito is a calm, tourist-friendly city just 30 minutes from the San Ysidro border crossing. Thousands of Americans cross regularly for dental, medical, and optical services. GON has over 12 years serving customers from both sides of the border.</p>
<h2>Do They Speak English at GON?</h2>
<p>Yes. Our staff speaks English and is experienced with American customers. You don't need to speak Spanish.</p>
<h2>Can I Use My US Prescription?</h2>
<p>Yes. We accept prescriptions from any licensed US optometrist or ophthalmologist. Just bring your written prescription and we'll make your lenses right away.</p>`,
  },

  // ── 12. eye exam rosarito (EN) ──────────────────────────────
  {
    slug: 'eye-exam-rosarito-mexico',
    fecha: '2026-06-16',
    categoria: 'frontera',
    titulo_es: 'Examen de la vista en Rosarito México — gratis con o sin compra',
    titulo_en: 'Eye Exam in Rosarito Mexico — Free With or Without Purchase',
    descripcion_es: 'Examen de la vista gratuito en Rosarito, México. Sin cita, sin seguro, en inglés. GON Óptica: 3 sucursales en Playas de Rosarito.',
    descripcion_en: 'Free eye exam in Rosarito, Mexico. No appointment, no insurance, English-speaking staff. GON Optica has 3 locations in Playas de Rosarito.',
    keywords_es: ['examen vista rosarito mexico','examen ojos rosarito','revision vision rosarito'],
    keywords_en: ['eye exam rosarito mexico','free eye exam rosarito','eye examination rosarito baja california','vision test rosarito mexico'],
    contenido_es: `
<h2>¿Por qué hacerse el examen de la vista en Rosarito?</h2>
<p>En Estados Unidos un examen de la vista puede costar entre $50 y $150 USD sin seguro. En GON Rosarito es completamente gratuito. Además, si decides comprar tus lentes en el mismo lugar, todo queda listo en una sola visita.</p>`,
    contenido_en: `
<h2>Why Get an Eye Exam in Rosarito?</h2>
<p>In the US, an eye exam can cost $50–$150 USD without insurance. At GON Rosarito it's completely free. And if you decide to buy your glasses at the same time, everything is done in a single visit.</p>
<h2>What to Expect</h2>
<p>The exam takes 15–20 minutes and includes a full refraction test — distance and near vision, astigmatism check, and presbyopia assessment. You'll receive a written prescription at the end that you can use anywhere.</p>
<h2>Do I Need an Appointment?</h2>
<p>No. Walk-ins are always welcome at all 3 GON locations. Arrive and we'll see you as soon as an optometrist is available — usually within minutes.</p>
<h2>Will They Accept My US Insurance?</h2>
<p>We don't process US insurance directly, but since the exam is free and lenses are significantly cheaper than in the US, you often save money even without insurance coverage.</p>`,
  },

  // ── 13. prescription glasses tijuana (EN) ──────────────────
  {
    slug: 'prescription-glasses-tijuana',
    fecha: '2026-06-17',
    categoria: 'frontera',
    titulo_es: 'Lentes graduados en Tijuana y Rosarito — precios y opciones',
    titulo_en: 'Prescription Glasses in Tijuana and Rosarito — Prices and Options',
    descripcion_es: 'Compara opciones de lentes graduados en Tijuana y Rosarito. GON Óptica en Rosarito: más cerca de la frontera, examen gratis, precios desde $749 MXN.',
    descripcion_en: 'Compare prescription glasses in Tijuana vs Rosarito. GON Optica in Rosarito: closer to the border, free exam, prices from $749 MXN.',
    keywords_es: ['lentes graduados tijuana','optica tijuana rosarito','lentes tijuana precio'],
    keywords_en: ['prescription glasses tijuana','glasses tijuana mexico','eyeglasses tijuana','prescription glasses near tijuana border'],
    contenido_es: `
<h2>¿Tijuana o Rosarito para comprar lentes?</h2>
<p>Ambas ciudades tienen buenas opciones, pero Rosarito tiene una ventaja para quien viene desde San Diego: está sobre la autopista libre, es menos congestionada y GON tiene 3 sucursales accesibles sobre el boulevard principal.</p>
<h2>¿GON tiene sucursales en Tijuana?</h2>
<p>Por ahora GON opera exclusivamente en Rosarito. Si vienes desde el cruce de San Ysidro o Otay, Rosarito está a solo 30–40 minutos hacia el sur por la Autopista de Ensenada.</p>`,
    contenido_en: `
<h2>Tijuana or Rosarito for Prescription Glasses?</h2>
<p>Both cities have good options, but Rosarito has an advantage for those coming from San Diego: it's on the free highway, less congested, and GON has 3 easily accessible locations on the main boulevard.</p>
<h2>How Far Is Rosarito from the Tijuana Border?</h2>
<p>From the San Ysidro or Otay crossing, Rosarito is about 30–40 minutes south on the Ensenada Toll Road (Autopista de Ensenada). It's a straight shot — no city traffic.</p>
<h2>What Are the Prices Like?</h2>
<p>Single-vision lenses at GON start at $749 MXN (~$40 USD). Progressive lenses start at $1,899 MXN (~$102 USD). Eye exam is free at all locations.</p>`,
  },

  // ── 14. lentes astigmatismo rosarito ───────────────────────
  {
    slug: 'lentes-astigmatismo-rosarito',
    fecha: '2026-06-17',
    categoria: 'salud-visual',
    titulo_es: 'Lentes para astigmatismo en Rosarito — qué son y cuánto cuestan',
    titulo_en: 'Glasses for Astigmatism in Rosarito — What They Are and What They Cost',
    descripcion_es: 'El astigmatismo se corrige fácilmente con lentes graduados. Conoce los tipos de micas para astigmatismo y sus precios en GON Óptica Rosarito.',
    descripcion_en: 'Astigmatism is easily corrected with prescription glasses. Learn about lens options for astigmatism and prices at GON Optica Rosarito.',
    keywords_es: ['lentes astigmatismo rosarito','lentes para astigmatismo rosarito','astigmatismo lentes rosarito','graduacion astigmatismo rosarito'],
    keywords_en: ['glasses for astigmatism rosarito','astigmatism glasses rosarito mexico','toric lenses rosarito'],
    contenido_es: `
<h2>¿Qué es el astigmatismo?</h2>
<p>El astigmatismo es una curvatura irregular de la córnea que hace que la visión sea borrosa o distorsionada a todas las distancias. Es muy común — afecta a más del 30% de la población — y se corrige perfectamente con lentes graduados.</p>
<h2>¿Cómo se ven los lentes para astigmatismo?</h2>
<p>Exactamente iguales a los lentes normales. La diferencia está en la mica, que tiene un eje cilíndrico (el "CYL" y "EJE" de tu receta). No puedes distinguirlos por fuera.</p>
<h2>¿Qué material de mica es mejor para astigmatismo?</h2>
<p>Para astigmatismos leves a moderados, el CR-39 (Essential) o el policarbonato (Poly Plus) funcionan muy bien. Para astigmatismos altos combinados con miopía fuerte, el Hi-Index (1.67 o 1.74) hace la mica más delgada y liviana.</p>
<h2>¿Cuánto cuestan en GON Rosarito?</h2>
<p>Los lentes para astigmatismo tienen el mismo precio que los monofocales normales — desde $749 MXN en micas. El astigmatismo no tiene costo adicional en la graduación.</p>`,
    contenido_en: `
<h2>What Is Astigmatism?</h2>
<p>Astigmatism is an irregular curvature of the cornea that causes blurry or distorted vision at all distances. It's very common — affecting over 30% of the population — and is perfectly corrected with prescription glasses.</p>
<h2>Do Astigmatism Glasses Look Different?</h2>
<p>No, they look exactly like regular glasses. The difference is in the lens, which has a cylindrical axis (the "CYL" and "AXIS" values on your prescription).</p>
<h2>How Much Do They Cost at GON Rosarito?</h2>
<p>Astigmatism correction glasses are priced the same as regular single-vision lenses — from $749 MXN. There's no extra charge for astigmatism correction.</p>`,
  },

  // ── 15. vista cansada lentes rosarito ──────────────────────
  {
    slug: 'vista-cansada-lentes-rosarito',
    fecha: '2026-06-18',
    categoria: 'salud-visual',
    titulo_es: 'Vista cansada en Rosarito — lentes para presbicia desde $1,149 MXN',
    titulo_en: 'Tired Eyes in Rosarito — Reading Glasses and Progressives from $1,149 MXN',
    descripcion_es: 'La vista cansada o presbicia se corrige con lentes bifocales o progresivos. Precios desde $1,149 MXN en GON Óptica Rosarito. Examen gratis.',
    descripcion_en: 'Presbyopia (tired eyes) is corrected with bifocal or progressive lenses. Prices from $1,149 MXN at GON Optica Rosarito. Free eye exam.',
    keywords_es: ['vista cansada lentes rosarito','presbicia lentes rosarito','lentes lectura rosarito','lentes para ver de cerca rosarito'],
    keywords_en: ['reading glasses rosarito','presbyopia glasses rosarito mexico','tired eyes glasses rosarito'],
    contenido_es: `
<h2>¿Qué es la vista cansada?</h2>
<p>La "vista cansada" o presbicia es la dificultad natural para enfocar objetos cercanos que aparece después de los 40 años. Si necesitas alejar el teléfono o el periódico para leer, o si te duele la cabeza después de leer mucho, probablemente tienes presbicia.</p>
<h2>¿Cómo se corrige?</h2>
<p>Con lentes bifocales (zona de lejos + zona de cerca con línea visible) o progresivos (transición suave sin línea). También existen lentes monofocales de lectura para quien solo necesita ayuda para ver de cerca.</p>
<h2>Precios en GON Rosarito</h2>
<ul>
<li><strong>Lentes de lectura monofocales</strong>: desde $749 MXN</li>
<li><strong>Bifocales</strong>: desde $1,149 MXN</li>
<li><strong>Progresivos</strong>: desde $1,899 MXN</li>
</ul>
<p>Examen de la vista gratuito en las 3 sucursales de Rosarito.</p>`,
    contenido_en: `
<h2>What Are Tired Eyes (Presbyopia)?</h2>
<p>Presbyopia is the natural loss of near-focus ability that appears after age 40. If you need to hold your phone or newspaper farther away to read, or get headaches after reading, you likely have presbyopia.</p>
<h2>How Is It Corrected?</h2>
<p>With bifocal lenses (distance + near zones with a visible line) or progressive lenses (smooth transition, no visible line). Reading-only single-vision lenses also work if you only need help up close.</p>
<h2>Prices at GON Rosarito</h2>
<ul>
<li><strong>Reading glasses (single vision)</strong>: from $749 MXN (~$40 USD)</li>
<li><strong>Bifocal</strong>: from $1,149 MXN (~$62 USD)</li>
<li><strong>Progressive</strong>: from $1,899 MXN (~$102 USD)</li>
</ul>`,
  },

  // ── 16. lentes antirreflejo rosarito ───────────────────────
  {
    slug: 'lentes-antirreflejo-rosarito',
    fecha: '2026-06-18',
    categoria: 'salud-visual',
    titulo_es: 'Lentes antirreflejo en Rosarito — para qué sirven y cuánto cuestan',
    titulo_en: 'Anti-Reflective Lenses in Rosarito — What They Do and What They Cost',
    descripcion_es: 'Los lentes antirreflejo reducen brillos en pantallas, luz artificial y al manejar. En GON Rosarito desde $279 MXN como upgrade a tus lentes graduados.',
    descripcion_en: 'Anti-reflective lenses reduce glare from screens, artificial light, and driving at night. Available at GON Rosarito from $279 MXN as an upgrade.',
    keywords_es: ['lentes antirreflejo rosarito','lentes ar rosarito','lentes sin reflejos rosarito','tratamiento antirreflejo rosarito'],
    keywords_en: ['anti reflective lenses rosarito','AR coating glasses rosarito','glare free glasses rosarito mexico'],
    contenido_es: `
<h2>¿Qué son los lentes antirreflejo?</h2>
<p>El tratamiento antirreflejo (también llamado AR) es una capa que se aplica sobre la mica para eliminar los reflejos de luz en la superficie del lente. Hace que tus lentes sean casi invisibles a la vista de otros y mejora tu visión en condiciones de luz artificial.</p>
<h2>¿Para qué situaciones son útiles?</h2>
<ul>
<li>Trabajar frente a computadora o pantallas</li>
<li>Manejar de noche (reduce el encandilamiento de los faros)</li>
<li>Ambientes de oficina con luz fluorescente</li>
<li>Fotografías y videollamadas (tus ojos se ven sin reflejos)</li>
</ul>
<h2>¿Cuánto cuesta en GON?</h2>
<p>El tratamiento antirreflejo en GON Rosarito tiene un costo adicional de <strong>$279 MXN</strong> sobre el precio de tus micas. Es uno de los upgrades más recomendados porque la diferencia en comodidad visual es inmediata.</p>`,
    contenido_en: `
<h2>What Are Anti-Reflective Lenses?</h2>
<p>Anti-reflective (AR) coating is a layer applied to the lens surface to eliminate light reflections. It makes your lenses nearly invisible to others and improves your vision under artificial lighting.</p>
<h2>When Are They Most Useful?</h2>
<ul>
<li>Working in front of a computer or screens</li>
<li>Driving at night (reduces headlight glare)</li>
<li>Office environments with fluorescent lighting</li>
<li>Photos and video calls (no reflections hiding your eyes)</li>
</ul>
<h2>How Much Does It Cost at GON?</h2>
<p>The anti-reflective coating at GON Rosarito costs an additional <strong>$279 MXN</strong> (~$15 USD) on top of your lens price. It's one of the most recommended upgrades — the comfort difference is immediately noticeable.</p>`,
  },

  // ── 17. lentes para manejar de noche ───────────────────────
  {
    slug: 'lentes-para-manejar-noche',
    fecha: '2026-06-19',
    categoria: 'salud-visual',
    titulo_es: 'Lentes para manejar de noche — cuál es el mejor filtro para conducir',
    titulo_en: 'Glasses for Night Driving — Which Lens Is Best for Driving at Night',
    descripcion_es: 'Si te encandilan los faros al manejar de noche, los lentes antirreflejo o polarizados pueden ayudar. Descubre cuál es mejor para conducir y dónde conseguirlos en Rosarito.',
    descripcion_en: 'If headlights bother you while driving at night, anti-reflective or polarized lenses can help. Find out which is better and where to get them in Rosarito.',
    keywords_es: ['lentes para manejar de noche','lentes conducir noche','lentes anti encandilamiento','manejar de noche lentes amarillos'],
    keywords_en: ['glasses for night driving','night driving lenses','anti glare glasses driving','best lenses for driving at night'],
    contenido_es: `
<h2>¿Por qué me encandilan más los faros con el tiempo?</h2>
<p>Con la edad, el cristalino del ojo se vuelve menos transparente y dispersa más la luz, lo que aumenta la sensibilidad al encandilamiento. También puede ser por miopía no corregida o por lentes sucios o rayados.</p>
<h2>¿Qué tipo de lente ayuda a manejar de noche?</h2>
<ul>
<li><strong>Antirreflejo</strong>: el más recomendado para manejar de noche. Elimina los reflejos de los faros en la superficie de tus lentes y mejora el contraste.</li>
<li><strong>Lentes amarillos</strong>: populares pero con evidencia limitada. Mejoran el contraste en lluvia o niebla pero pueden reducir la visión de colores.</li>
<li><strong>Polarizados</strong>: excelentes para manejar de día, pero NO se recomiendan de noche porque oscurecen demasiado la visión.</li>
</ul>
<h2>¿Cuánto cuesta el antirreflejo en GON Rosarito?</h2>
<p>$279 MXN adicionales sobre el precio de tus micas. Si ya tienes lentes graduados sin antirreflejo, no puedes agregar el tratamiento a tus lentes actuales — necesitas fabricar unas nuevas micas.</p>`,
    contenido_en: `
<h2>Why Do Headlights Bother Me More at Night?</h2>
<p>With age, the eye's lens becomes less transparent and scatters more light, increasing glare sensitivity. Uncorrected myopia or scratched/dirty lenses can also contribute.</p>
<h2>Which Lens Type Helps with Night Driving?</h2>
<ul>
<li><strong>Anti-reflective coating</strong>: the most recommended for night driving. Eliminates headlight reflections on the lens surface and improves contrast.</li>
<li><strong>Yellow-tinted lenses</strong>: popular but with limited evidence. They improve contrast in rain or fog but may reduce color perception.</li>
<li><strong>Polarized lenses</strong>: excellent for daytime driving, but NOT recommended at night — they darken vision too much.</li>
</ul>
<h2>How Much Is the Anti-Reflective Coating at GON Rosarito?</h2>
<p>$279 MXN (~$15 USD) added to your lens price. The difference when driving at night is immediate and significant.</p>`,
  },

  // ── 18. lentes polarizados rosarito ────────────────────────
  {
    slug: 'lentes-polarizados-rosarito',
    fecha: '2026-06-19',
    categoria: 'salud-visual',
    titulo_es: 'Lentes polarizados en Rosarito — para la playa, el mar y el volante',
    titulo_en: 'Polarized Lenses in Rosarito — For the Beach, Ocean, and Driving',
    descripcion_es: 'Los lentes polarizados eliminan reflejos en agua, asfalto y vidrio. Perfectos para Rosarito. En GON desde $1,699 MXN, graduables y en lentes de sol.',
    descripcion_en: 'Polarized lenses eliminate reflections from water, asphalt, and glass. Perfect for Rosarito. At GON from $1,699 MXN, available with prescription and as sunglasses.',
    keywords_es: ['lentes polarizados rosarito','lentes sol polarizados rosarito','polarizados para playa rosarito','lentes polarizados graduados rosarito'],
    keywords_en: ['polarized lenses rosarito','polarized sunglasses rosarito mexico','prescription polarized glasses rosarito'],
    contenido_es: `
<h2>¿Qué hacen exactamente los lentes polarizados?</h2>
<p>Los lentes polarizados tienen un filtro que bloquea la luz horizontal reflejada en superficies planas como el agua, el asfalto o el cofre de los carros. Esa luz reflejada es lo que produce el encandilamiento típico en el mar o al manejar en carretera.</p>
<h2>¿Para qué son ideales en Rosarito?</h2>
<p>Rosarito es una ciudad costera — la playa, el malecón y las carreteras junto al mar hacen que los polarizados sean especialmente útiles aquí. Son perfectos para surf, pesca, paseos en la playa y manejar por la Autopista de Ensenada.</p>
<h2>¿Se pueden graduar?</h2>
<p>Sí. En GON todos nuestros lentes polarizados son graduables. Puedes combinarlo con monofocal, bifocal o progresivo.</p>
<h2>¿Cuánto cuestan?</h2>
<p>El filtro polarizado en GON tiene un costo de <strong>$1,699 MXN</strong> adicionales sobre el precio base de tus micas.</p>`,
    contenido_en: `
<h2>What Do Polarized Lenses Actually Do?</h2>
<p>Polarized lenses have a filter that blocks horizontal reflected light from flat surfaces like water, asphalt, or car hoods. That reflected light is what causes the typical glare you see at the beach or on the highway.</p>
<h2>Why Are They Especially Useful in Rosarito?</h2>
<p>Rosarito is a coastal city — the beach, boardwalk, and coastal highways make polarized lenses particularly useful here. They're ideal for surfing, fishing, beach walks, and driving the Ensenada Toll Road.</p>
<h2>Can They Be Made with a Prescription?</h2>
<p>Yes. At GON all polarized lenses are available with your prescription — single vision, bifocal, or progressive.</p>
<h2>How Much Do They Cost?</h2>
<p>The polarized filter at GON costs an additional <strong>$1,699 MXN</strong> (~$91 USD) on top of the base lens price.</p>`,
  },

  // ── 19. lentes fotocromáticos rosarito ─────────────────────
  {
    slug: 'lentes-fotocromáticos-rosarito',
    fecha: '2026-06-20',
    categoria: 'salud-visual',
    titulo_es: 'Lentes fotocromáticos en Rosarito — se oscurecen solos con el sol',
    titulo_en: 'Photochromic Lenses in Rosarito — Lenses That Darken in the Sun',
    descripcion_es: 'Los lentes fotocromáticos se oscurecen automáticamente bajo el sol y aclaran en interiores. En GON Rosarito desde $949 MXN. Ideales para usar todo el día.',
    descripcion_en: 'Photochromic lenses automatically darken in sunlight and clear indoors. Available at GON Rosarito from $949 MXN. Perfect for all-day wear.',
    keywords_es: ['lentes fotocromáticos rosarito','lentes transitions rosarito','lentes que se oscurecen solos rosarito','lentes fotocromáticos precio rosarito'],
    keywords_en: ['photochromic lenses rosarito','transition lenses rosarito mexico','lenses that darken in sun rosarito'],
    contenido_es: `
<h2>¿Cómo funcionan los lentes fotocromáticos?</h2>
<p>Los lentes fotocromáticos contienen moléculas sensibles a los rayos UV que reaccionan cambiando de color al exponerse a la luz solar. En interiores o bajo poca luz son claros (casi como lentes normales); al salir al sol se oscurecen en 30–60 segundos.</p>
<h2>¿Funcionan dentro del carro?</h2>
<p>En general, NO. El parabrisas de los autos bloquea los rayos UV, que son los que activan el fotocromático. Dentro del carro tus lentes permanecerán claros aunque haya mucho sol. Para manejar, los lentes de sol o polarizados son mejor opción.</p>
<h2>¿En qué colores vienen?</h2>
<p>En GON ofrecemos fotocromático en gris, café, verde y azul. El gris es el más popular porque no distorsiona los colores del entorno.</p>
<h2>¿Cuánto cuestan?</h2>
<p>El filtro fotocromático en GON cuesta <strong>$949 MXN</strong> adicionales sobre el precio base de tus micas.</p>`,
    contenido_en: `
<h2>How Do Photochromic Lenses Work?</h2>
<p>Photochromic lenses contain UV-sensitive molecules that react by changing color when exposed to sunlight. Indoors they're clear (nearly like regular lenses); outside they darken within 30–60 seconds.</p>
<h2>Do They Work Inside the Car?</h2>
<p>Generally, NO. Car windshields block the UV rays that activate the photochromic reaction. Inside the car your lenses will stay clear even in bright sunlight. For driving, sunglasses or polarized lenses are a better option.</p>
<h2>What Colors Are Available?</h2>
<p>At GON we offer photochromic in gray, brown, green, and blue. Gray is most popular because it doesn't distort surrounding colors.</p>
<h2>How Much Do They Cost?</h2>
<p>The photochromic filter at GON costs an additional <strong>$949 MXN</strong> (~$51 USD) on top of the base lens price.</p>`,
  },

  // ── 20. lentes de sol graduados rosarito ───────────────────
  {
    slug: 'lentes-sol-graduados-rosarito',
    fecha: '2026-06-20',
    categoria: 'moda',
    titulo_es: 'Lentes de sol graduados en Rosarito — UV400, todos los estilos',
    titulo_en: 'Prescription Sunglasses in Rosarito — UV400, All Styles',
    descripcion_es: 'Lentes de sol graduados en Rosarito con protección UV400. Todos los modelos de GON son graduables en monofocal, bifocal o progresivo. Desde $749 MXN en micas.',
    descripcion_en: 'Prescription sunglasses in Rosarito with UV400 protection. All GON frames are available with prescription — single vision, bifocal, or progressive. Lenses from $749 MXN.',
    keywords_es: ['lentes sol graduados rosarito','lentes sol con graduacion rosarito','gafas sol graduadas rosarito','lentes sol rosarito'],
    keywords_en: ['prescription sunglasses rosarito','sunglasses with prescription rosarito mexico','graduated sunglasses rosarito'],
    contenido_es: `
<h2>¿Puedo ponerle graduación a mis lentes de sol?</h2>
<p>Sí. En GON todos los armazones de nuestra colección de lentes de sol son graduables. Puedes agregar tu graduación en monofocal, bifocal o progresivo con protección UV400 y opcionalmente filtro polarizado.</p>
<h2>¿La protección UV es igual que en los lentes de sol sin graduación?</h2>
<p>Sí. La protección UV400 (que bloquea el 100% de los rayos UVA y UVB) se aplica independientemente de si los lentes llevan graduación o no.</p>
<h2>¿Cuánto cuestan los lentes de sol graduados en GON?</h2>
<p>El precio depende del armazón que elijas más el costo de las micas graduadas:</p>
<ul>
<li>Armazón de sol: desde $350 MXN</li>
<li>Micas monofocales con tinte: desde $749 MXN + $549 MXN de tinte</li>
<li>Micas con polarizado: $1,699 MXN adicionales</li>
</ul>`,
    contenido_en: `
<h2>Can I Get Prescription Lenses in Sunglasses?</h2>
<p>Yes. At GON all our sunglass frames are available with prescription lenses — single vision, bifocal, or progressive — with UV400 protection and optional polarization.</p>
<h2>Is the UV Protection the Same as Non-Prescription Sunglasses?</h2>
<p>Yes. UV400 protection (which blocks 100% of UVA and UVB rays) is applied regardless of whether the lenses have a prescription.</p>
<h2>How Much Do Prescription Sunglasses Cost at GON?</h2>
<ul>
<li>Sunglass frame: from $350 MXN</li>
<li>Single-vision tinted lenses: from $749 MXN + $549 MXN tint</li>
<li>With polarized filter: $1,699 MXN additional</li>
</ul>`,
  },

  // ── 21. lentes contacto rosarito ───────────────────────────
  {
    slug: 'lentes-contacto-rosarito',
    fecha: '2026-06-21',
    categoria: 'salud-visual',
    titulo_es: 'Lentes de contacto en Rosarito — dónde conseguirlos y qué necesitas',
    titulo_en: 'Contact Lenses in Rosarito — Where to Get Them and What You Need',
    descripcion_es: 'Encuentra lentes de contacto en Rosarito con receta médica. GON Óptica ofrece asesoría y graduación para lentes de contacto blandos y para astigmatismo.',
    descripcion_en: 'Find contact lenses in Rosarito with a prescription. GON Optica offers guidance and fitting for soft contact lenses including for astigmatism.',
    keywords_es: ['lentes de contacto rosarito','lentes contacto rosarito','pupilentes rosarito','lentes blandos rosarito'],
    keywords_en: ['contact lenses rosarito','contacts rosarito mexico','soft contact lenses rosarito'],
    contenido_es: `
<h2>¿Necesito receta para lentes de contacto?</h2>
<p>Sí. Los lentes de contacto son un dispositivo médico y requieren una receta específica para contactos (distinta a la receta de armazones). En GON podemos hacerte la evaluación para lentes de contacto con nuestros optometristas.</p>
<h2>¿Qué tipos de lentes de contacto hay?</h2>
<ul>
<li><strong>Blandos diarios</strong>: se desechan cada día, máxima comodidad e higiene</li>
<li><strong>Blandos mensuales</strong>: se usan hasta 30 días con cuidado adecuado</li>
<li><strong>Tóricos</strong>: para astigmatismo</li>
<li><strong>Multifocales</strong>: para quien necesita corrección a varias distancias</li>
</ul>
<h2>¿Puedo usar contactos si tengo astigmatismo?</h2>
<p>Sí, con lentes tóricos. Son más especializados y un poco más caros, pero corrigen el astigmatismo perfectamente. El optometrista evaluará si eres buen candidato.</p>`,
    contenido_en: `
<h2>Do I Need a Prescription for Contact Lenses?</h2>
<p>Yes. Contact lenses are a medical device and require a specific contact lens prescription (different from your glasses prescription). At GON our optometrists can do a contact lens fitting evaluation.</p>
<h2>What Types of Contacts Are Available?</h2>
<ul>
<li><strong>Daily soft lenses</strong>: discarded each day, maximum comfort and hygiene</li>
<li><strong>Monthly soft lenses</strong>: used up to 30 days with proper care</li>
<li><strong>Toric lenses</strong>: for astigmatism correction</li>
<li><strong>Multifocal contacts</strong>: for multiple distance correction</li>
</ul>
<h2>Can I Wear Contacts with Astigmatism?</h2>
<p>Yes, with toric lenses. They're more specialized and slightly more expensive, but correct astigmatism perfectly. Your optometrist will evaluate whether you're a good candidate.</p>`,
  },

  // ── 22. lentes deportivos rosarito ─────────────────────────
  {
    slug: 'lentes-deportivos-rosarito',
    fecha: '2026-06-21',
    categoria: 'moda',
    titulo_es: 'Lentes deportivos en Rosarito — resistentes y graduables',
    titulo_en: 'Sports Glasses in Rosarito — Durable and Available with Prescription',
    descripcion_es: 'Lentes deportivos graduados en Rosarito. Policarbonato resistente a impactos, perfectos para surf, ciclismo, fútbol y actividades al aire libre.',
    descripcion_en: 'Sports glasses with prescription in Rosarito. Impact-resistant polycarbonate, perfect for surfing, cycling, soccer, and outdoor activities.',
    keywords_es: ['lentes deportivos rosarito','armazones deportivos rosarito','lentes para deporte rosarito','lentes surf rosarito'],
    keywords_en: ['sports glasses rosarito','prescription sports glasses rosarito mexico','athletic glasses rosarito'],
    contenido_es: `
<h2>¿Qué hace a un lente "deportivo"?</h2>
<p>Los lentes deportivos están diseñados para resistir impactos, sudar y moverse sin que se caigan. Generalmente son de policarbonato (el material más resistente a impactos), tienen armazones envolventes y patillas con agarre de goma.</p>
<h2>¿Se pueden graduar?</h2>
<p>Sí. En GON puedes poner tu graduación en muchos de nuestros armazones deportivos. La mica recomendada para deporte es el policarbonato (Poly Plus) por su resistencia a impactos.</p>
<h2>¿Para qué deportes son buenos?</h2>
<p>Surf, ciclismo, fútbol, béisbol, correr, senderismo — cualquier actividad donde los lentes regulares se caerían o se dañarían. Para deportes de contacto extremo se recomiendan gogles específicos.</p>
<h2>¿Y para Rosarito en específico?</h2>
<p>Rosarito tiene una fuerte cultura de surf y deportes de playa. Los lentes deportivos con polarizado y policarbonato son ideales para el ambiente costero: resisten la sal, la arena y los impactos.</p>`,
    contenido_en: `
<h2>What Makes Glasses "Sports" Glasses?</h2>
<p>Sports glasses are designed to resist impacts, handle sweat, and stay in place during movement. They're typically polycarbonate (the most impact-resistant material), have wrap-around frames, and rubber-grip temples.</p>
<h2>Can They Be Made with a Prescription?</h2>
<p>Yes. At GON you can add your prescription to many of our sports frames. The recommended lens for sports is polycarbonate (Poly Plus) for its impact resistance.</p>
<h2>Rosarito-Specific Uses</h2>
<p>Rosarito has a strong surf and beach sports culture. Sports glasses with polarized polycarbonate lenses are ideal for the coastal environment: they resist salt, sand, and impacts.</p>`,
  },

  // ── 23. lentes hipermetropia ───────────────────────────────
  {
    slug: 'lentes-para-hipermetropia',
    fecha: '2026-06-22',
    categoria: 'salud-visual',
    titulo_es: 'Lentes para hipermetropía — qué son, síntomas y corrección',
    titulo_en: 'Glasses for Farsightedness (Hyperopia) — Symptoms and Correction',
    descripcion_es: 'La hipermetropía dificulta ver de cerca. Se corrige con lentes convergentes. Descubre los síntomas y el precio de los lentes para hipermetropía en Rosarito.',
    descripcion_en: 'Hyperopia (farsightedness) makes near vision difficult. It is corrected with converging lenses. Learn the symptoms and lens costs in Rosarito.',
    keywords_es: ['lentes hipermetropia','lentes para hipermetropia rosarito','soy hipermetrope que lentes necesito','hipermetropia lentes precio'],
    keywords_en: ['glasses for farsightedness rosarito','hyperopia glasses mexico','farsighted glasses rosarito'],
    contenido_es: `
<h2>¿Qué es la hipermetropía?</h2>
<p>La hipermetropía (o "farsightedness") es lo contrario de la miopía: el ojo enfoca las imágenes detrás de la retina, lo que dificulta ver de cerca. En casos leves, personas jóvenes pueden compensarla con esfuerzo muscular del ojo — pero esto provoca fatiga visual y dolores de cabeza.</p>
<h2>Síntomas más comunes</h2>
<ul>
<li>Dificultad para leer o ver de cerca</li>
<li>Ojos cansados después de trabajo cercano</li>
<li>Dolores de cabeza frecuentes</li>
<li>En niños: puede causar estrabismo si no se corrige a tiempo</li>
</ul>
<h2>¿Cómo se corrige?</h2>
<p>Con lentes convergentes (signo positivo en la receta, ej. +1.50). La mica es ligeramente más gruesa en el centro que en los bordes.</p>
<h2>¿Cuánto cuestan en GON Rosarito?</h2>
<p>Igual que cualquier monofocal: desde <strong>$749 MXN</strong>. No hay sobrecargo por hipermetropía.</p>`,
    contenido_en: `
<h2>What Is Hyperopia (Farsightedness)?</h2>
<p>Hyperopia is the opposite of myopia: the eye focuses images behind the retina, making near vision difficult. Young people can often compensate with eye muscle effort — but this causes eye strain and headaches.</p>
<h2>Common Symptoms</h2>
<ul>
<li>Difficulty reading or seeing up close</li>
<li>Tired eyes after close work</li>
<li>Frequent headaches</li>
<li>In children: can cause crossed eyes if uncorrected</li>
</ul>
<h2>How Is It Corrected?</h2>
<p>With converging lenses (positive sign on the prescription, e.g. +1.50).</p>
<h2>How Much at GON Rosarito?</h2>
<p>Same as any single-vision lens: from <strong>$749 MXN</strong> (~$40 USD). No surcharge for hyperopia.</p>`,
  },

  // ── 24. cuando necesito lentes ─────────────────────────────
  {
    slug: 'cuando-necesito-lentes',
    fecha: '2026-06-22',
    categoria: 'salud-visual',
    titulo_es: '¿Cuándo necesito lentes? — señales de que tu vista necesita corrección',
    titulo_en: 'Do I Need Glasses? — Signs That You Need Vision Correction',
    descripcion_es: 'Dolores de cabeza, ver borroso de lejos o de cerca, guiñar los ojos... estos son los síntomas más comunes que indican que puedes necesitar lentes.',
    descripcion_en: 'Headaches, blurry distance vision, squinting... these are the most common signs you may need prescription glasses.',
    keywords_es: ['cuando necesito lentes','necesito lentes señales','creo que necesito lentes','me duele la cabeza necesito lentes'],
    keywords_en: ['do i need glasses signs','when do you need glasses','signs you need prescription glasses','need glasses symptoms'],
    contenido_es: `
<h2>Señales de que puedes necesitar lentes</h2>
<ul>
<li><strong>Ves borroso de lejos</strong>: no puedes leer señales, subtítulos o la pizarra con claridad → posible miopía</li>
<li><strong>Ves borroso de cerca</strong>: te cuesta leer o trabajar en pantalla → posible hipermetropía o presbicia</li>
<li><strong>Guiñas los ojos para ver mejor</strong>: señal clásica de miopía no corregida</li>
<li><strong>Dolores de cabeza frecuentes</strong>: el ojo hace un esfuerzo extra para compensar la falta de corrección</li>
<li><strong>Fatiga visual al final del día</strong>: ojos cansados después de trabajar en computadora</li>
<li><strong>Dificultad al manejar de noche</strong>: puede ser miopía leve o astigmatismo</li>
</ul>
<h2>¿Cómo saber con certeza?</h2>
<p>Con un examen de la vista. En GON es gratuito, tarda 15–20 minutos y te damos tu receta al terminar. No necesitas cita ni seguro médico.</p>`,
    contenido_en: `
<h2>Signs You Might Need Glasses</h2>
<ul>
<li><strong>Blurry distance vision</strong>: can't read signs, subtitles, or the board clearly → possible myopia</li>
<li><strong>Blurry near vision</strong>: difficulty reading or working on screen → possible hyperopia or presbyopia</li>
<li><strong>Squinting to see better</strong>: classic sign of uncorrected myopia</li>
<li><strong>Frequent headaches</strong>: eyes working extra hard to compensate for lack of correction</li>
<li><strong>Eye fatigue at end of day</strong>: tired eyes after computer work</li>
<li><strong>Difficulty driving at night</strong>: may indicate mild myopia or astigmatism</li>
</ul>
<h2>How to Know for Sure?</h2>
<p>With an eye exam. At GON it's free, takes 15–20 minutes, and we give you your prescription at the end. No appointment or insurance needed.</p>`,
  },

  // ── 25. lentes progresivos rosarito ────────────────────────
  {
    slug: 'lentes-progresivos-rosarito',
    fecha: '2026-06-23',
    categoria: 'local',
    titulo_es: 'Lentes progresivos en Rosarito — precios, tipos y cómo adaptarte',
    titulo_en: 'Progressive Lenses in Rosarito — Prices, Types, and How to Adapt',
    descripcion_es: 'Lentes progresivos en Rosarito desde $1,899 MXN. GON ofrece progresivos en varias calidades sin línea visible. Examen gratis en 3 sucursales.',
    descripcion_en: 'Progressive lenses in Rosarito from $1,899 MXN. GON offers multifocal progressives at various quality levels. Free exam at 3 locations.',
    keywords_es: ['lentes progresivos rosarito','multifocales rosarito','progresivos precio rosarito','lentes progresivos baratos rosarito'],
    keywords_en: ['progressive lenses rosarito','multifocal glasses rosarito mexico','progressive eyeglasses rosarito price'],
    contenido_es: `
<h2>¿Qué son los lentes progresivos?</h2>
<p>Los lentes progresivos (o multifocales) corrigen la visión a todas las distancias — lejos, intermedio y cerca — en una sola mica sin línea visible. Son la evolución de los bifocales para quienes tienen presbicia combinada con miopía, hipermetropía o astigmatismo.</p>
<h2>¿Son difíciles de usar?</h2>
<p>Requieren un período de adaptación de 1 a 2 semanas. Durante ese tiempo puedes sentir mareo o distorsión al mover la cabeza. Después, la mayoría de los usuarios los usa sin ningún problema.</p>
<h2>¿Cuánto cuestan en GON Rosarito?</h2>
<p>Los progresivos en GON comienzan desde <strong>$1,899 MXN</strong> en la mica Essential. Hay opciones más avanzadas (con mayor zona de visión intermedia, ideal para pantallas) a precios mayores.</p>
<h2>¿Puedo cruzar desde San Diego a comprarlos?</h2>
<p>Sí, y el ahorro es significativo. Un par de progresivos en EE.UU. fácilmente cuesta $400–$800 USD. En GON puedes conseguirlos por una fracción de ese precio con la misma calidad óptica.</p>`,
    contenido_en: `
<h2>What Are Progressive Lenses?</h2>
<p>Progressive (multifocal) lenses correct vision at all distances — far, intermediate, and near — in a single lens with no visible line. They're the evolution of bifocals for people with presbyopia combined with myopia, hyperopia, or astigmatism.</p>
<h2>Are They Hard to Get Used To?</h2>
<p>They require a 1–2 week adaptation period during which you may feel slight dizziness or distortion when moving your head. After that, most users wear them without any issues.</p>
<h2>How Much Do They Cost at GON Rosarito?</h2>
<p>Progressive lenses at GON start from <strong>$1,899 MXN</strong> (~$102 USD) for the Essential lens. More advanced options are available for larger intermediate vision zones, ideal for screen use.</p>`,
  },

  // ── 26. lentes sin seguro rosarito ─────────────────────────
  {
    slug: 'lentes-sin-seguro-rosarito',
    fecha: '2026-06-23',
    categoria: 'local',
    titulo_es: 'Lentes sin seguro médico en Rosarito — directo al consumidor',
    titulo_en: 'Glasses Without Insurance in Rosarito — Direct to Consumer',
    descripcion_es: 'No tienes seguro médico y necesitas lentes. En GON Rosarito todos los precios son directos, sin intermediarios. Examen gratis + lentes desde $749 MXN.',
    descripcion_en: "Don't have insurance and need glasses? At GON Rosarito all prices are direct to consumer. Free exam + lenses from $749 MXN.",
    keywords_es: ['lentes sin seguro rosarito','lentes sin imss rosarito','donde comprar lentes sin seguro rosarito','lentes sin seguro baja california'],
    keywords_en: ['glasses without insurance rosarito','no insurance glasses rosarito mexico','uninsured glasses rosarito'],
    contenido_es: `
<h2>¿Puedo comprar lentes en GON sin seguro médico?</h2>
<p>Sí, y de hecho así funcionamos. En GON nunca pedimos seguro médico — todos nuestros precios son directos al consumidor sin intermediarios. El examen de la vista también es gratuito sin seguro.</p>
<h2>¿El seguro médico realmente vale la pena para lentes?</h2>
<p>En México el IMSS cubre lentes solo en casos muy específicos y con trámites prolongados. El seguro privado para óptica generalmente tiene copagos que hacen que el ahorro sea mínimo. En GON el precio directo muchas veces es más conveniente que usar un seguro con copago.</p>
<h2>¿Cuánto gasto sin seguro en GON Rosarito?</h2>
<ul>
<li>Examen de la vista: <strong>GRATIS</strong></li>
<li>Lentes monofocales completos (mica + armazón): desde <strong>$1,049 MXN</strong> aprox.</li>
<li>Progresivos completos: desde <strong>$2,199 MXN</strong> aprox.</li>
</ul>`,
    contenido_en: `
<h2>Can I Get Glasses at GON Without Insurance?</h2>
<p>Yes — that's exactly how we work. At GON we never require insurance. All prices are direct to the consumer with no middlemen. The eye exam is also free with no insurance needed.</p>
<h2>How Much Will I Spend Without Insurance at GON Rosarito?</h2>
<ul>
<li>Eye exam: <strong>FREE</strong></li>
<li>Complete single-vision glasses (lens + frame): from approximately <strong>$1,049 MXN</strong> (~$57 USD)</li>
<li>Complete progressives: from approximately <strong>$2,199 MXN</strong> (~$119 USD)</li>
</ul>`,
  },

  // ── 27. optica rosarito domingos ───────────────────────────
  {
    slug: 'optica-rosarito-domingos',
    fecha: '2026-06-24',
    categoria: 'local',
    titulo_es: 'Óptica en Rosarito abierta los domingos — horarios GON',
    titulo_en: 'Optical Store Open Sundays in Rosarito — GON Hours',
    descripcion_es: '¿Necesitas ir a la óptica el domingo en Rosarito? GON Baja Visión y Plaza Laureles abren lunes a domingo. Sin cita previa.',
    descripcion_en: 'Need to visit an optical store on Sunday in Rosarito? GON Baja Visión and Plaza Laureles are open Monday through Sunday. Walk-ins welcome.',
    keywords_es: ['optica rosarito domingos','optica abierta domingo rosarito','horario optica rosarito domingo'],
    keywords_en: ['optical store open sunday rosarito','glasses store sunday rosarito mexico'],
    contenido_es: `
<h2>¿Qué ópticas de GON abren los domingos en Rosarito?</h2>
<ul>
<li><strong>Óptica Baja Visión</strong> (Blvd. Benito Juárez 79B) — Lunes a <strong>domingo</strong> 10:00–18:00</li>
<li><strong>Plaza Laureles</strong> (Morelos 118) — Lunes a <strong>domingo</strong> 10:00–18:00</li>
<li><strong>5 de Mayo</strong> (C. 5 de Mayo 200, Local 1) — Lunes a sábado 10:00–18:00 (cerrado domingos)</li>
</ul>
<h2>¿Puedo hacer el examen de la vista el domingo?</h2>
<p>Sí. En las sucursales que abren el domingo también hay optometrista disponible. No necesitas cita previa.</p>
<h2>¿Los domingos hay más tiempo de espera?</h2>
<p>Los domingos suelen ser más tranquilos en la mañana. Si llegas antes de las 13:00 generalmente la espera es mínima.</p>`,
    contenido_en: `
<h2>Which GON Locations Are Open Sundays in Rosarito?</h2>
<ul>
<li><strong>Óptica Baja Visión</strong> (Blvd. Benito Juárez 79B) — Monday to <strong>Sunday</strong> 10:00 AM–6:00 PM</li>
<li><strong>Plaza Laureles</strong> (Morelos 118) — Monday to <strong>Sunday</strong> 10:00 AM–6:00 PM</li>
<li><strong>5 de Mayo</strong> (C. 5 de Mayo 200, Local 1) — Monday to Saturday 10:00 AM–6:00 PM (closed Sundays)</li>
</ul>
<h2>Can I Get an Eye Exam on Sunday?</h2>
<p>Yes. Sunday-open locations also have an optometrist on staff. No appointment needed.</p>`,
  },

  // ── 28. lentes baratos tijuana ─────────────────────────────
  {
    slug: 'lentes-baratos-tijuana',
    fecha: '2026-06-24',
    categoria: 'frontera',
    titulo_es: 'Lentes baratos en Tijuana — o mejor en Rosarito, a 30 minutos',
    titulo_en: 'Cheap Glasses Near Tijuana — Try Rosarito, Just 30 Minutes Away',
    descripcion_es: 'Buscas lentes baratos en Tijuana. Rosarito queda a 30 minutos y GON Óptica ofrece mejores precios y menos tráfico. Desde $749 MXN, examen gratis.',
    descripcion_en: 'Looking for cheap glasses near Tijuana? Rosarito is just 30 minutes away and GON Optica offers better prices with less traffic. From $749 MXN, free exam.',
    keywords_es: ['lentes baratos tijuana','optica economica tijuana','lentes graduados tijuana baratos','optica buenos precios tijuana'],
    keywords_en: ['cheap glasses tijuana','affordable glasses near tijuana','glasses tijuana mexico price','inexpensive glasses tijuana border'],
    contenido_es: `
<h2>¿Por qué ir a Rosarito en lugar de Tijuana para lentes baratos?</h2>
<p>Si estás en la zona de Tijuana o cruzando desde San Diego, Rosarito es una alternativa muy conveniente: está a solo 30–40 minutos al sur de la garita de San Ysidro, tiene menos tráfico y congestión que el centro de Tijuana, y GON tiene 3 sucursales con precios competitivos y examen gratis.</p>
<h2>¿Cuánto cuestan los lentes en Rosarito vs Tijuana?</h2>
<p>Los precios son comparables, pero en Rosarito evitas el tráfico y el estrés del centro de Tijuana. En GON los monofocales básicos empiezan en $749 MXN con examen de la vista gratuito incluido.</p>`,
    contenido_en: `
<h2>Why Go to Rosarito Instead of Tijuana for Cheap Glasses?</h2>
<p>If you're in the Tijuana area or crossing from San Diego, Rosarito is a very convenient alternative: it's just 30–40 minutes south of the San Ysidro crossing, has far less traffic than downtown Tijuana, and GON has 3 locations with competitive prices and free eye exams.</p>
<h2>How Do Prices Compare?</h2>
<p>Prices are comparable, but in Rosarito you avoid the traffic and stress of downtown Tijuana. At GON, basic single-vision lenses start at $749 MXN with a free eye exam included.</p>`,
  },

  // ── 29. lentes bifocales rosarito ──────────────────────────
  {
    slug: 'lentes-bifocales-rosarito',
    fecha: '2026-06-24',
    categoria: 'local',
    titulo_es: 'Lentes bifocales en Rosarito — precio, ventajas y a quién le convienen',
    titulo_en: 'Bifocal Glasses in Rosarito — Price, Benefits, and Who Should Get Them',
    descripcion_es: 'Lentes bifocales en Rosarito desde $1,149 MXN. GON Óptica tiene 3 sucursales. Descubre si los bifocales son mejor opción que los progresivos para ti.',
    descripcion_en: 'Bifocal glasses in Rosarito from $1,149 MXN. GON Optica has 3 locations. Find out if bifocals are better than progressives for your needs.',
    keywords_es: ['lentes bifocales rosarito','bifocales precio rosarito','lentes dos distancias rosarito'],
    keywords_en: ['bifocal glasses rosarito','bifocals rosarito mexico','bifocal lenses price rosarito'],
    contenido_es: `
<h2>¿Para quién son los lentes bifocales?</h2>
<p>Los bifocales son ideales para personas con presbicia que necesitan corrección a dos distancias (lejos y cerca) y prefieren un lente más sencillo y económico que los progresivos. También son buena opción para quienes ya usaron bifocales antes y no quieren cambiar.</p>
<h2>¿Qué diferencia a los bifocales de los progresivos?</h2>
<p>Los bifocales tienen una línea visible que separa la zona de lejos (arriba) y de cerca (abajo). Los progresivos no tienen línea — la transición es gradual y estética. Los bifocales son más baratos pero la línea puede resultar molesta estéticamente.</p>
<h2>Precio en GON Rosarito</h2>
<p>Los lentes bifocales en GON comienzan desde <strong>$1,149 MXN</strong> en micas, más el armazón. El examen de la vista es gratuito en las 3 sucursales.</p>`,
    contenido_en: `
<h2>Who Should Get Bifocal Glasses?</h2>
<p>Bifocals are ideal for people with presbyopia who need correction at two distances (far and near) and prefer a simpler, more affordable option than progressives. They're also great for those who've used bifocals before and don't want to change.</p>
<h2>Price at GON Rosarito</h2>
<p>Bifocal lenses at GON start from <strong>$1,149 MXN</strong> (~$62 USD) for lenses, plus the frame. Free eye exam at all 3 locations.</p>`,
  },

  // ── 30. lentes lectura rosarito ────────────────────────────
  {
    slug: 'lentes-lectura-rosarito',
    fecha: '2026-06-25',
    categoria: 'salud-visual',
    titulo_es: 'Lentes para leer en Rosarito — cuándo necesitas más que los de farmacia',
    titulo_en: 'Reading Glasses in Rosarito — When You Need More Than Pharmacy Readers',
    descripcion_es: 'Los lentes de lectura de farmacia no son para todos. Si tienes astigmatismo o diferentes graduaciones en cada ojo, necesitas lentes personalizados. GON Rosarito, examen gratis.',
    descripcion_en: 'Drug store reading glasses don\'t work for everyone. If you have astigmatism or different prescriptions in each eye, you need custom lenses. GON Rosarito, free exam.',
    keywords_es: ['lentes para leer rosarito','lentes lectura rosarito','lentes para leer cerca rosarito','lentes presbicia rosarito'],
    keywords_en: ['reading glasses rosarito','custom reading glasses rosarito','prescription reading glasses rosarito mexico'],
    contenido_es: `
<h2>¿Son iguales los lentes de farmacia que los graduados?</h2>
<p>No. Los lentes de farmacia son lentes de "poder fijo" — ambos ojos tienen la misma graduación positiva. Si tienes astigmatismo, diferente graduación en cada ojo o necesitas corrección para lejos también, los lentes de farmacia no te funcionarán bien.</p>
<h2>¿Cuándo necesito lentes personalizados para leer?</h2>
<ul>
<li>Tienes astigmatismo además de presbicia</li>
<li>Cada ojo tiene una graduación diferente</li>
<li>Los lentes de farmacia te generan dolor de cabeza</li>
<li>Necesitas ver bien tanto de lejos como de cerca</li>
</ul>
<h2>¿Cuánto cuestan en GON?</h2>
<p>Desde <strong>$749 MXN</strong> en micas monofocales para leer. El examen de la vista es gratuito en las 3 sucursales de Rosarito.</p>`,
    contenido_en: `
<h2>Are Drugstore Reading Glasses the Same as Prescription Ones?</h2>
<p>No. Drugstore readers are "fixed power" lenses — both eyes get the same positive prescription. If you have astigmatism, different prescriptions in each eye, or need distance correction too, drugstore readers won't work well for you.</p>
<h2>When Do You Need Custom Reading Glasses?</h2>
<ul>
<li>You have astigmatism in addition to presbyopia</li>
<li>Each eye has a different prescription</li>
<li>Drugstore readers give you headaches</li>
<li>You need to see well at both near and far distances</li>
</ul>
<h2>How Much at GON Rosarito?</h2>
<p>From <strong>$749 MXN</strong> (~$40 USD) for single-vision reading lenses. Free eye exam at all 3 locations.</p>`,
  },

  // ── 31. optica playas de rosarito ──────────────────────────
  {
    slug: 'optica-playas-de-rosarito',
    fecha: '2026-06-25',
    categoria: 'local',
    titulo_es: 'Óptica en Playas de Rosarito — GON, la más completa de la zona',
    titulo_en: 'Optical Store in Playas de Rosarito — GON, the Most Complete in the Area',
    descripcion_es: 'GON es la óptica más completa de Playas de Rosarito. 3 sucursales, examen de la vista gratis, más de 100 armazones, lentes graduados desde $749 MXN.',
    descripcion_en: 'GON is the most complete optical store in Playas de Rosarito. 3 locations, free eye exams, 100+ frames, prescription lenses from $749 MXN.',
    keywords_es: ['optica playas de rosarito','optica rosarito bc','lentes playas de rosarito','mejor optica rosarito'],
    keywords_en: ['optical store playas de rosarito','glasses playas de rosarito','best optical rosarito baja california'],
    contenido_es: `
<h2>¿Por qué GON es la óptica de referencia en Playas de Rosarito?</h2>
<p>Con más de 12 años en la ciudad y 3 sucursales activas, GON — Grupo Óptico del Noroeste — es la óptica con mayor presencia en Playas de Rosarito. Atendemos a familias locales, visitantes de fin de semana y clientes que cruzan desde el lado americano.</p>
<h2>¿Qué nos diferencia de otras ópticas en Rosarito?</h2>
<ul>
<li>3 sucursales en puntos estratégicos de la ciudad</li>
<li>Optometristas certificados en cada sucursal</li>
<li>Examen de la vista gratis sin cita</li>
<li>Más de 100 modelos de armazones en tienda</li>
<li>Pedidos en línea con recogida en sucursal</li>
<li>Atención en español e inglés</li>
</ul>`,
    contenido_en: `
<h2>Why Is GON the Go-To Optical Store in Playas de Rosarito?</h2>
<p>With over 12 years in the city and 3 active locations, GON — Grupo Óptico del Noroeste — is the optical store with the largest presence in Playas de Rosarito. We serve local families, weekend visitors, and customers crossing from the US side.</p>
<h2>What Sets Us Apart?</h2>
<ul>
<li>3 locations at strategic points in the city</li>
<li>Certified optometrists at every location</li>
<li>Free eye exam, no appointment</li>
<li>100+ frame styles in store</li>
<li>Online orders with in-store pickup</li>
<li>Service in Spanish and English</li>
</ul>`,
  },

  // ── 32. lentes progresivos precio mexico ───────────────────
  {
    slug: 'lentes-progresivos-precio-mexico',
    fecha: '2026-06-25',
    categoria: 'salud-visual',
    titulo_es: 'Precio de lentes progresivos en México — cuánto deberías pagar',
    titulo_en: 'Price of Progressive Lenses in Mexico — How Much Should You Pay',
    descripcion_es: 'Los lentes progresivos en México varían de $1,500 a $15,000 MXN. En GON Rosarito desde $1,899 MXN con calidad óptica garantizada.',
    descripcion_en: 'Progressive lenses in Mexico range from $1,500 to $15,000 MXN. At GON Rosarito from $1,899 MXN with guaranteed optical quality.',
    keywords_es: ['lentes progresivos precio mexico','cuanto cuestan lentes progresivos mexico','precio multifocales mexico','lentes progresivos baratos mexico'],
    keywords_en: ['progressive lenses price mexico','cost progressive glasses mexico','how much progressive lenses mexico'],
    contenido_es: `
<h2>¿Por qué varía tanto el precio de los progresivos?</h2>
<p>El precio de los lentes progresivos en México puede ir desde $1,500 hasta más de $15,000 MXN. Las diferencias dependen principalmente de:</p>
<ul>
<li><strong>Calidad del diseño</strong>: un progresivo básico tiene una zona de visión intermedia pequeña; uno premium tiene un corredor más amplio y mejor adaptación</li>
<li><strong>Marca de la mica</strong>: Essilor, Zeiss y Shamir son las marcas top</li>
<li><strong>Materiales</strong>: CR-39, Hi-Index 1.60, 1.67 o 1.74</li>
<li><strong>Tratamientos adicionales</strong>: antirreflejo, fotocromático, luz azul</li>
</ul>
<h2>¿Cuánto cobran en GON Rosarito?</h2>
<p>Los progresivos en GON comienzan en <strong>$1,899 MXN</strong> y suben según el material y los filtros. Es una opción de buena calidad a precio muy accesible comparado con cadenas o clínicas privadas.</p>`,
    contenido_en: `
<h2>Why Do Progressive Lens Prices Vary So Much?</h2>
<p>Progressive lens prices in Mexico can range from $1,500 to over $15,000 MXN. Key differences include lens design quality, brand (Essilor, Zeiss, Shamir), lens material (CR-39 vs Hi-Index), and additional coatings.</p>
<h2>How Much at GON Rosarito?</h2>
<p>Progressives at GON start at <strong>$1,899 MXN</strong> (~$102 USD) and go up depending on material and filters. It's a solid quality option at a very accessible price compared to chains or private clinics.</p>`,
  },

  // ── 33. optometrist rosarito mexico (EN) ───────────────────
  {
    slug: 'optometrist-rosarito-mexico',
    fecha: '2026-06-26',
    categoria: 'frontera',
    titulo_es: 'Optometrista en Rosarito México — certificado, en inglés, sin cita',
    titulo_en: 'Optometrist in Rosarito Mexico — Certified, English-Speaking, Walk-In',
    descripcion_es: 'GON Óptica Rosarito tiene optometristas certificados que atienden en inglés. Examen de la vista gratis. 3 sucursales, sin cita previa.',
    descripcion_en: 'GON Optica Rosarito has certified optometrists who speak English. Free eye exam. 3 locations, no appointment needed.',
    keywords_es: ['optometrista rosarito mexico','oculista rosarito','doctor de la vista rosarito mexico'],
    keywords_en: ['optometrist rosarito mexico','english speaking optometrist rosarito','eye doctor rosarito mexico english','vision care rosarito mexico'],
    contenido_es: `<h2>¿Nuestros optometristas hablan inglés?</h2>
<p>Sí. Todos nuestros optometristas tienen experiencia atendiendo pacientes de habla inglesa. No necesitas hablar español para hacerte el examen en GON Rosarito.</p>
<h2>¿Sus certificaciones son válidas?</h2>
<p>Nuestros optometristas cuentan con título universitario y cédula profesional expedida por la SEP (Secretaría de Educación Pública de México). El nivel de preparación es equivalente al de un optometrista certificado en EE.UU.</p>`,
    contenido_en: `
<h2>Do GON Optometrists Speak English?</h2>
<p>Yes. Our optometrists have extensive experience serving English-speaking patients. You don't need to speak Spanish for your exam at GON Rosarito.</p>
<h2>Are Their Credentials Valid?</h2>
<p>Our optometrists hold university degrees and professional licenses issued by Mexico's SEP (Ministry of Public Education). The training level is equivalent to a licensed optometrist in the US.</p>
<h2>What Does the Exam Include?</h2>
<p>Complete refraction test, distance and near vision assessment, astigmatism check, and written prescription — all at no charge, at any of our 3 Rosarito locations.</p>`,
  },

  // ── 34. armazones economicos rosarito ──────────────────────
  {
    slug: 'armazones-economicos-rosarito',
    fecha: '2026-06-26',
    categoria: 'local',
    titulo_es: 'Armazones económicos en Rosarito — estilos para todos los presupuestos',
    titulo_en: 'Affordable Frames in Rosarito — Styles for Every Budget',
    descripcion_es: 'GON Óptica tiene armazones económicos en Rosarito desde $300 MXN. Acetato, metal, hombre, mujer y niños. Más de 100 modelos en tienda.',
    descripcion_en: 'GON Optica has affordable frames in Rosarito from $300 MXN. Acetate, metal, men\'s, women\'s and kids. 100+ styles in store.',
    keywords_es: ['armazones economicos rosarito','marcos lentes baratos rosarito','armazones baratos rosarito','donde comprar armazones rosarito'],
    keywords_en: ['affordable frames rosarito','cheap eyeglass frames rosarito mexico','frames rosarito price'],
    contenido_es: `
<h2>¿Cuánto cuesta un armazón en GON Rosarito?</h2>
<p>Tenemos armazones desde <strong>$300 MXN</strong> hasta modelos más elaborados de acetato premium. La mayoría de nuestros armazones se encuentran en el rango de $350 a $1,200 MXN.</p>
<h2>¿Qué materiales tienen disponibles?</h2>
<ul>
<li><strong>Metal</strong>: ligeros, duraderos, estilo clásico o minimalista</li>
<li><strong>Acetato</strong>: colores vivos, acabados únicos, muy de moda</li>
<li><strong>TR-90</strong>: ultralígero y flexible, ideal para niños</li>
</ul>
<h2>¿Puedo ver los armazones antes de decidir?</h2>
<p>Sí. En las 3 sucursales de GON en Rosarito tenemos exhibición física de todos los modelos. Puedes probártelos y recibir asesoría de nuestro personal para elegir el que mejor va con tu cara y estilo.</p>`,
    contenido_en: `
<h2>How Much Does a Frame Cost at GON Rosarito?</h2>
<p>We have frames from <strong>$300 MXN</strong> (~$16 USD) up to premium acetate models. Most frames range from $350 to $1,200 MXN ($19–$65 USD).</p>
<h2>What Frame Materials Are Available?</h2>
<ul>
<li><strong>Metal</strong>: lightweight, durable, classic or minimalist style</li>
<li><strong>Acetate</strong>: bold colors, unique finishes, very on-trend</li>
<li><strong>TR-90</strong>: ultra-lightweight and flexible, ideal for kids</li>
</ul>
<h2>Can I Try Them On Before Deciding?</h2>
<p>Yes. All 3 GON locations in Rosarito have physical displays of all models. You can try them on and get advice from our staff on which best suits your face shape and style.</p>`,
  },

  // ── 35. glasses from san diego to mexico ───────────────────
  {
    slug: 'glasses-san-diego-to-rosarito',
    fecha: '2026-06-26',
    categoria: 'frontera',
    titulo_es: 'De San Diego a Rosarito por lentes — la guía práctica',
    titulo_en: 'San Diego to Rosarito for Glasses — The Practical Guide',
    descripcion_es: 'Guía paso a paso para ir de San Diego a Rosarito a comprar lentes en GON. Ruta, tiempo, qué llevar y cuánto ahorras.',
    descripcion_en: 'Step-by-step guide to driving from San Diego to Rosarito to buy glasses at GON. Route, time, what to bring, and how much you save.',
    keywords_es: ['san diego rosarito lentes','ir rosarito comprar lentes san diego','cruzar frontera lentes rosarito'],
    keywords_en: ['san diego to rosarito glasses','drive from san diego to rosarito glasses','glasses rosarito from san diego guide','border crossing glasses rosarito'],
    contenido_es: `
<h2>¿Cuánto tiempo tarda ir de San Diego a Rosarito?</h2>
<p>Sin tráfico en la frontera, el viaje total desde el centro de San Diego hasta Rosarito es de unos 45–60 minutos. La mayor variable es el tiempo de cruce en la garita de San Ysidro o Otay.</p>
<h2>¿Qué ruta tomar?</h2>
<ol>
<li>Toma la I-5 south hacia San Ysidro</li>
<li>Cruza la frontera por San Ysidro (la garita más grande)</li>
<li>En México, sigue hacia la Autopista de Ensenada (México 1D) o la carretera libre</li>
<li>Rosarito está a unos 28 km al sur de la frontera</li>
</ol>
<h2>¿Qué llevar?</h2>
<ul>
<li>Pasaporte o tarjeta de cruce (passport card)</li>
<li>Tu receta de lentes si la tienes (opcional)</li>
<li>Pesos mexicanos o tarjeta de crédito (aceptamos USD también)</li>
</ul>
<h2>¿Vale la pena el viaje?</h2>
<p>Si pagas $300+ USD por lentes en San Diego, el ahorro fácilmente cubre el tiempo del viaje y la gasolina. Muchos pacientes vienen a Rosarito específicamente por los precios de GON.</p>`,
    contenido_en: `
<h2>How Long Does It Take to Drive from San Diego to Rosarito?</h2>
<p>Without border wait time, the total drive from central San Diego to Rosarito is about 45–60 minutes. The biggest variable is crossing time at the San Ysidro or Otay border crossing.</p>
<h2>Which Route Should I Take?</h2>
<ol>
<li>Take I-5 south toward San Ysidro</li>
<li>Cross the border at San Ysidro (the largest crossing)</li>
<li>In Mexico, follow signs to the Ensenada Toll Road (México 1D) or the free highway</li>
<li>Rosarito is about 28 km south of the border</li>
</ol>
<h2>What to Bring</h2>
<ul>
<li>Passport or passport card</li>
<li>Your eyeglass prescription if you have one (optional)</li>
<li>Mexican pesos or credit card (we also accept USD)</li>
</ul>
<h2>Is the Trip Worth It?</h2>
<p>If you're paying $300+ USD for glasses in San Diego, the savings easily cover the trip time and gas. Many patients come to Rosarito specifically for GON's prices.</p>`,
  },

  // ── 36. optica barata rosarito ─────────────────────────────
  {
    slug: 'optica-barata-rosarito',
    fecha: '2026-06-27',
    categoria: 'local',
    titulo_es: 'Óptica barata en Rosarito — calidad sin pagar de más',
    titulo_en: 'Affordable Optical Store in Rosarito — Quality Without Overpaying',
    descripcion_es: 'GON es la óptica más accesible de Rosarito sin sacrificar calidad. Examen gratis, lentes desde $749 MXN, 3 sucursales. Sin seguro, sin cita.',
    descripcion_en: 'GON is the most affordable optical store in Rosarito without sacrificing quality. Free exam, lenses from $749 MXN, 3 locations. No insurance, no appointment.',
    keywords_es: ['optica barata rosarito','optica economica rosarito','optica buenos precios rosarito','optica accesible rosarito'],
    keywords_en: ['affordable optical store rosarito','cheap optical rosarito mexico','budget glasses store rosarito'],
    contenido_es: `
<h2>¿Cómo puede ser barata y tener buena calidad?</h2>
<p>GON no tiene los gastos de una cadena nacional ni el margen de una clínica privada. Operamos directamente en Rosarito, con costos locales, y transferimos ese ahorro al precio final del cliente. No "baratos" como calidad inferior — baratos como precios justos sin intermediarios.</p>
<h2>¿Cómo comparar precios con otras ópticas de Rosarito?</h2>
<p>Pide siempre el precio <strong>todo incluido</strong>: armazón + micas + tratamientos. Muchas ópticas anuncian precios bajos de armazón pero cobran las micas por separado. En GON los precios de micas son transparentes desde el inicio.</p>`,
    contenido_en: `
<h2>How Can It Be Affordable AND Good Quality?</h2>
<p>GON doesn't carry the overhead of a national chain or the markup of a private clinic. We operate directly in Rosarito with local costs, and pass those savings to the customer. Not "cheap" as in lower quality — affordable as in fair prices without middlemen.</p>
<h2>How to Compare Prices with Other Rosarito Optical Stores</h2>
<p>Always ask for the <strong>all-in price</strong>: frame + lenses + treatments. Many stores advertise low frame prices but charge separately for lenses. At GON, lens prices are transparent from the start.</p>`,
  },

  // ── 37. lentes economicos baja california ──────────────────
  {
    slug: 'lentes-economicos-baja-california',
    fecha: '2026-06-27',
    categoria: 'local',
    titulo_es: 'Lentes económicos en Baja California — la mejor opción en Rosarito',
    titulo_en: 'Affordable Glasses in Baja California — Best Option in Rosarito',
    descripcion_es: 'Busca lentes económicos en Baja California. GON Óptica Rosarito ofrece los mejores precios de la región: desde $749 MXN con examen de la vista gratis.',
    descripcion_en: 'Looking for affordable glasses in Baja California? GON Optica Rosarito offers the best prices in the region: from $749 MXN with free eye exam.',
    keywords_es: ['lentes economicos baja california','optica baja california precio','lentes baratos bc','lentes graduados baja california'],
    keywords_en: ['affordable glasses baja california','cheap glasses baja california mexico','eyeglasses baja california price'],
    contenido_es: `
<h2>¿Dónde conseguir los mejores precios en lentes en Baja California?</h2>
<p>En Baja California hay ópticas en Tijuana, Rosarito, Ensenada, Tecate y Mexicali. Para quien está en la zona costera o cruza desde San Diego, Rosarito es la opción más conveniente por su ubicación sobre la Autopista de Ensenada y el bajo nivel de tráfico comparado con Tijuana.</p>
<h2>¿GON tiene buenas reseñas en Rosarito?</h2>
<p>Sí. Con más de 12 años en la ciudad y cientos de reseñas positivas en Google de pacientes de Rosarito, Tijuana y el lado americano. Consulta las reseñas de cada sucursal en Google Maps.</p>`,
    contenido_en: `
<h2>Where to Find the Best Glasses Prices in Baja California?</h2>
<p>Baja California has optical stores in Tijuana, Rosarito, Ensenada, Tecate, and Mexicali. For those in the coastal zone or crossing from San Diego, Rosarito is the most convenient option — located on the Ensenada Highway with much less traffic than Tijuana.</p>`,
  },

  // ── 38. lentes emergencia rosarito ─────────────────────────
  {
    slug: 'lentes-emergencia-rosarito',
    fecha: '2026-06-28',
    categoria: 'local',
    titulo_es: 'Lentes de emergencia en Rosarito — rompiste o perdiste los tuyos',
    titulo_en: 'Emergency Glasses in Rosarito — Broken or Lost Your Glasses',
    descripcion_es: 'Si rompiste o perdiste tus lentes en Rosarito, GON puede ayudarte. Examen gratis en el momento y fabricación rápida de lentes de emergencia.',
    descripcion_en: 'If you broke or lost your glasses in Rosarito, GON can help. Free on-the-spot eye exam and fast production of emergency replacement lenses.',
    keywords_es: ['lentes emergencia rosarito','perdi mis lentes rosarito','rompi mis lentes rosarito','reponer lentes rosarito'],
    keywords_en: ['emergency glasses rosarito','lost glasses rosarito','broken glasses rosarito mexico','replacement glasses rosarito'],
    contenido_es: `
<h2>Rompí mis lentes en Rosarito, ¿qué hago?</h2>
<p>Ve directamente a cualquiera de nuestras 3 sucursales GON. Si tienes tu receta anterior, podemos empezar el pedido inmediatamente. Si no, te hacemos el examen de la vista gratis en el momento.</p>
<h2>¿Puedo usar los marcos rotos si las micas están bien?</h2>
<p>Depende del daño. Si el armazón tiene una soldadura simple podemos repararla en muchos casos. Si las micas están bien pero el armazón está muy dañado, puedes comprar solo un armazón nuevo y transferir tus micas.</p>
<h2>¿Cuánto tardan los lentes de emergencia?</h2>
<p>Para micas monofocales básicas: 1–2 días en la mayoría de los casos. Llevamos a cabo el pedido con prioridad para situaciones de urgencia.</p>`,
    contenido_en: `
<h2>I Broke My Glasses in Rosarito — What Do I Do?</h2>
<p>Go directly to any of our 3 GON locations. If you have your previous prescription, we can start the order immediately. If not, we'll give you a free eye exam on the spot.</p>
<h2>Can I Keep My Old Frames If the Lenses Are OK?</h2>
<p>It depends on the damage. Simple solder repairs are possible in many cases. If the lenses are fine but the frame is badly damaged, you can purchase just a new frame and transfer your existing lenses.</p>
<h2>How Quickly Can Emergency Glasses Be Made?</h2>
<p>For basic single-vision lenses: 1–2 days in most cases. We prioritize urgent orders.</p>`,
  },

  // ── 39. usar lentes empeora la vista ───────────────────────
  {
    slug: 'usar-lentes-empeora-la-vista',
    fecha: '2026-06-28',
    categoria: 'salud-visual',
    titulo_es: '¿Usar lentes empeora la vista? — el mito más común en óptica',
    titulo_en: 'Does Wearing Glasses Make Your Vision Worse? — The Biggest Optical Myth',
    descripcion_es: 'No, usar lentes no empeora la vista. Es un mito muy común. Descubre por qué la vista cambia con el tiempo y qué sí puedes hacer para protegerla.',
    descripcion_en: "No, wearing glasses doesn't make your vision worse. It's a very common myth. Learn why vision changes over time and what you can actually do to protect it.",
    keywords_es: ['usar lentes empeora la vista','lentes hacen daño a los ojos mito','depender de lentes es malo','los lentes arruinan la vista'],
    keywords_en: ['does wearing glasses make vision worse','glasses dependency myth','do glasses ruin your eyes','wearing glasses bad for eyes'],
    contenido_es: `
<h2>¿Es cierto que los lentes "acostumbran" al ojo y lo hacen peor?</h2>
<p>No. Es uno de los mitos más persistentes en salud visual y no tiene ninguna base científica. Los lentes no cambian la estructura del ojo ni hacen que "se acostumbre" a depender de ellos. Lo que sí pasa es que una vez que ves bien con lentes, notas más el contraste cuando te los quitas — pero eso es percepción, no daño real.</p>
<h2>¿Por qué entonces cambia la graduación con el tiempo?</h2>
<p>La vista cambia por razones biológicas independientes del uso de lentes: el crecimiento del globo ocular en la infancia y adolescencia, cambios en el cristalino con la edad, y factores genéticos. Nada de esto es causado por usar lentes.</p>
<h2>¿Qué sí puedes hacer para cuidar tu vista?</h2>
<ul>
<li>Tomar descansos de las pantallas cada 20 minutos (regla 20-20-20)</li>
<li>Tiempo al aire libre — reduce la progresión de miopía en niños</li>
<li>Buena iluminación al leer</li>
<li>Examen de la vista anual</li>
</ul>`,
    contenido_en: `
<h2>Is It True That Glasses "Train" Your Eyes to Be Dependent?</h2>
<p>No. This is one of the most persistent myths in vision health and has no scientific basis. Glasses don't change the structure of your eye or cause it to become "dependent." What does happen is that once you see clearly with glasses, you notice the contrast more when you take them off — but that's perception, not actual damage.</p>
<h2>Why Does Prescription Change Over Time Then?</h2>
<p>Vision changes for biological reasons unrelated to wearing glasses: eyeball growth during childhood and adolescence, lens changes with age, and genetic factors. None of this is caused by wearing glasses.</p>
<h2>What Can You Actually Do to Protect Your Vision?</h2>
<ul>
<li>Take screen breaks every 20 minutes (20-20-20 rule)</li>
<li>Outdoor time — shown to reduce myopia progression in children</li>
<li>Good lighting when reading</li>
<li>Annual eye exam</li>
</ul>`,
  },

  // ── 40. mejor optica rosarito ──────────────────────────────
  {
    slug: 'mejor-optica-rosarito',
    fecha: '2026-06-28',
    categoria: 'local',
    titulo_es: '¿Cuál es la mejor óptica en Rosarito? — GON vs las demás',
    titulo_en: 'What Is the Best Optical Store in Rosarito? — GON vs the Rest',
    descripcion_es: 'Comparativa de ópticas en Rosarito. GON destaca por sus 3 sucursales, examen gratis, atención en inglés y más de 12 años en la ciudad.',
    descripcion_en: 'Comparison of optical stores in Rosarito. GON stands out for its 3 locations, free eye exam, English service, and 12+ years in the city.',
    keywords_es: ['mejor optica rosarito','cual es la mejor optica rosarito','optica rosarito opiniones','optica recomendada rosarito'],
    keywords_en: ['best optical store rosarito','top optician rosarito mexico','best glasses store rosarito','recommended optical rosarito'],
    contenido_es: `
<h2>¿Qué hace a una óptica la "mejor" en Rosarito?</h2>
<p>Depende de lo que buscas, pero los factores clave son: precio transparente, optometristas certificados, variedad de armazones, tiempo de entrega y atención al cliente. Aquí es donde GON destaca.</p>
<h2>¿Por qué GON tiene buenas reseñas?</h2>
<p>Con más de 12 años en Rosarito y cientos de reseñas en Google, nuestros pacientes valoran principalmente:</p>
<ul>
<li>El examen de la vista gratuito sin cita</li>
<li>La atención sin presión para comprar</li>
<li>Precios claros sin letra chica</li>
<li>Atención en inglés para clientes del lado americano</li>
<li>Entregas en el tiempo prometido</li>
</ul>
<h2>¿Tienen reseñas de Google verificables?</h2>
<p>Sí. Busca "Óptica Baja Visión Rosarito", "Óptica Rosarito 5 de Mayo" o "Óptica Plaza Laureles Rosarito" en Google Maps para ver las reseñas reales de cada sucursal.</p>`,
    contenido_en: `
<h2>What Makes an Optical Store the "Best" in Rosarito?</h2>
<p>It depends on what you're looking for, but key factors are: transparent pricing, certified optometrists, frame variety, delivery time, and customer service. This is where GON stands out.</p>
<h2>Why Does GON Have Good Reviews?</h2>
<p>With 12+ years in Rosarito and hundreds of Google reviews, patients most commonly cite:</p>
<ul>
<li>Free eye exam with no appointment</li>
<li>No-pressure service</li>
<li>Clear pricing with no hidden fees</li>
<li>English service for US customers</li>
<li>On-time delivery</li>
</ul>
<h2>Can I Check Google Reviews?</h2>
<p>Yes. Search "Óptica Baja Visión Rosarito," "Óptica Rosarito 5 de Mayo," or "Óptica Plaza Laureles Rosarito" on Google Maps to see real reviews for each location.</p>`,
  },

export function getPost(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug);
}

export function getPostsByCategory(cat: BlogPost['categoria']): BlogPost[] {
  return posts.filter(p => p.categoria === cat);
}
