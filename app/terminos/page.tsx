// app/terminos/page.tsx — Términos, garantías y aviso de privacidad (el ticket remite aquí)
import Navbar from '../components/Navbar';

const ACTUALIZADO = '5 de noviembre de 2026';

const secciones: { id: string; titulo: string; puntos: string[] }[] = [
  {
    id: 'garantia-micas',
    titulo: '1. Garantía de tus micas: hasta que te queden bien',
    puntos: [
      'Durante los 30 días siguientes a la entrega, si tus lentes no te quedan bien (te marean, no ves claro o no te adaptas), regresa con tu ticket y los ajustamos sin costo hasta que te queden bien.',
      'Aplica a monofocales, bifocales y progresivos fabricados con la graduación de nuestro examen o de la receta que nos entregaste.',
      'Si tu graduación cambió por un examen nuevo posterior a la compra, el cambio de micas tiene costo.',
    ],
  },
  {
    id: 'garantia-armazon',
    titulo: '2. Garantía de tu armazón',
    puntos: [
      'Tu armazón tiene 30 días de garantía a partir de la entrega por defectos de fábrica.',
      'Los armazones entregados como regalo o como parte de una promoción no tienen garantía.',
      'Armazón propio: si nos traes tu armazón para ponerle micas, el laboratorio no se hace responsable si se daña durante el proceso.',
    ],
  },
  {
    id: 'no-cubre',
    titulo: '3. Lo que la garantía no cubre',
    puntos: [
      'Rayones, golpes, caídas o mal uso.',
      'Daños por calor (por ejemplo, dejar los lentes dentro del carro) o por limpiarlos con productos no adecuados.',
      'Antirreflejante craquelado o desprendido por descuido, calor o limpieza inadecuada.',
      'Pérdida o robo.',
      'Lentes reparados o modificados en otro lugar.',
    ],
  },
  {
    id: 'hacer-valida',
    titulo: '4. Cómo hacer válida tu garantía',
    puntos: [
      'Presenta tu ticket de compra en la óptica donde compraste, junto con tus lentes. Sin ticket no es posible aplicar la garantía.',
      'Revisa tu nota y tu cambio antes de salir de la óptica, y que tu número de teléfono esté bien escrito para poder avisarte.',
    ],
  },
  {
    id: 'recoger',
    titulo: '5. Plazo para recoger tus lentes',
    puntos: [
      'Tienes 30 días para recoger tus lentes, contados a partir de tu último pago o abono.',
      'Pasado ese plazo sin recogerlos ni abonar, pierdes el armazón y lo que hayas pagado.',
      'Si los recoges después de 30 días de que estuvieron listos, la garantía por adaptación ya no aplica.',
    ],
  },
  {
    id: 'anticipos',
    titulo: '6. Anticipos y pagos',
    puntos: [
      'Los lentes graduados se fabrican a la medida. Una vez enviados a fabricar, el anticipo no es reembolsable.',
      'Si cancelas antes de que se manden a fabricar, tu anticipo queda como saldo a favor para usarse en la óptica.',
      'Todos los precios están en pesos mexicanos (MXN) e incluyen IVA.',
    ],
  },
  {
    id: 'en-linea',
    titulo: '7. Compras en gonmx.com',
    puntos: [
      'Puedes pagar el total, dejar un anticipo (del 35% al 60%) o apartar tus lentes (de $100 a $300 MXN). Recoges en la óptica que elegiste al pagar.',
      'Apartado: tienes 10 días para pasar a la óptica a completar tu anticipo. El apartado no es reembolsable; si no lo completas a tiempo, tu dinero queda como saldo a favor durante 30 días.',
      'Si compraste sin graduación, primero te hacemos el examen de la vista gratis y después mandamos a hacer tus lentes. Si tu graduación necesita otro material, te avisamos la diferencia antes de fabricarlos.',
      'Precio web y código web: el código que te damos por WhatsApp aplica el precio web en la óptica. Vale 30 días, se usa una sola vez y no se junta con otros cupones o promociones.',
      'Los pagos en línea se procesan de forma segura con Stripe. GON Ópticas no guarda los datos de tu tarjeta.',
    ],
  },
  {
    id: 'contacto',
    titulo: '8. Dudas y aclaraciones',
    puntos: [
      'Escríbenos por WhatsApp al 664 834 3018 o visítanos en cualquiera de nuestras ópticas en Playas de Rosarito, B.C.',
    ],
  },
];

const privacidad: string[] = [
  'Grupo Óptico del Noroeste (GON Ópticas), con domicilio en Blvd. Benito Juárez 79B, Centro, Playas de Rosarito, B.C., es responsable del uso y protección de tus datos personales.',
  'Datos que recabamos: nombre, teléfono, correo electrónico, fecha de nacimiento y tu graduación y datos del examen de la vista (estos últimos se consideran datos sensibles de salud).',
  'Para qué los usamos: hacer tu examen, fabricar y entregar tus lentes, procesar tus pagos, darte seguimiento y garantía, y avisarte cuando tus lentes estén listos. De forma secundaria, para enviarte promociones; si no quieres recibirlas, avísanos por WhatsApp.',
  'No vendemos ni compartimos tus datos con terceros, salvo con el laboratorio que fabrica tus lentes, con el procesador de pagos y cuando la ley lo exija.',
  'Puedes pedir el acceso, rectificación, cancelación u oposición de tus datos (derechos ARCO) escribiéndonos por WhatsApp al 664 834 3018 o en cualquiera de nuestras ópticas.',
  'Cualquier cambio a este aviso se publicará en esta página.',
];

export default function TerminosPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--charcoal)' }}>
      <Navbar />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '110px 1.25rem 4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 500, lineHeight: 1.15, marginBottom: '0.5rem' }}>
          Términos, garantías y aviso de privacidad
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', marginBottom: '2rem' }}>Última actualización: {ACTUALIZADO}</p>

        <nav style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '2.5rem', fontSize: '0.9rem', lineHeight: 1.9 }}>
          {secciones.map(s => <div key={s.id}><a href={`#${s.id}`} style={{ color: 'var(--sage)', textDecoration: 'none' }}>{s.titulo}</a></div>)}
          <div><a href="#privacidad" style={{ color: 'var(--sage)', textDecoration: 'none' }}>9. Aviso de privacidad</a></div>
        </nav>

        {secciones.map(s => (
          <section key={s.id} id={s.id} style={{ marginBottom: '2rem', scrollMarginTop: '100px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem' }}>{s.titulo}</h2>
            <ul style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.5rem', fontSize: '0.95rem', lineHeight: 1.65, color: '#333' }}>
              {s.puntos.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </section>
        ))}

        <section id="privacidad" style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem' }}>9. Aviso de privacidad simplificado</h2>
          <ul style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.5rem', fontSize: '0.95rem', lineHeight: 1.65, color: '#333' }}>
            {privacidad.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>
      </main>
    </div>
  );
}
