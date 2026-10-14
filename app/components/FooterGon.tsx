'use client';
// Pie de página de GON (portada y catálogo) + botón flotante de WhatsApp.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from './LanguageContext';
import { waGon } from '../lib/precio-gon';

export default function FooterGon() {
  const { t } = useLang() as any;
  const ruta = usePathname() || '';
  if (ruta.startsWith('/checkout') || ruta.startsWith('/admin')) return null;
  // En la página del armazón el celular ya tiene su barra fija abajo: ahí no va el botón flotante
  const flotante = !ruta.startsWith('/armazon');
  const wa = waGon(t('Hola, tengo una pregunta', 'Hi, I have a question'));
  const col = (titulo: string, links: { href: string; label: string }[]) => (
    <div>
      <h4>{titulo}</h4>
      {links.map(l => <Link key={l.href + l.label} href={l.href}>{l.label}</Link>)}
    </div>
  );
  return (
    <>
      <footer className="gft">
        <div className="gft-wrap">
          <div className="gft-marca">
            <img src="/logo-gon.png" alt="GON — Grupo Óptico del Noroeste" />
            <p>{t('Ópticas en Playas de Rosarito, B.C. Examen de la vista gratis y atención bilingüe.', 'Optical stores in Playas de Rosarito, B.C. Free eye exam and bilingual service.')}</p>
            <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp · 664 834 3018</a>
          </div>
          {col(t('Tienda', 'Shop'), [
            { href: '/Tienda', label: t('Armazones', 'Frames') },
            { href: '/lenses', label: t('Tipos de mica', 'Lens types') },
          ])}
          {col(t('Ópticas', 'Stores'), [
            { href: '/ubicaciones', label: t('Ubicaciones', 'Locations') },
            { href: '/examen', label: t('Examen de la vista', 'Eye exam') },
            { href: '/nosotros', label: t('Nosotros', 'About us') },
            { href: '/blog', label: 'Blog' },
          ])}
        </div>
        <div className="gft-base">© {new Date().getFullYear()} Grupo Óptico del Noroeste</div>
      </footer>
      {flotante && <a href={wa} target="_blank" rel="noopener noreferrer" className="gft-wa" aria-label="WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.49-8.42z"/></svg>
      </a>}
      <style>{`
        .gft{background:var(--sage);color:rgba(255,255,255,.6);font-size:13.5px}
        .gft-wrap{max-width:1280px;margin:0 auto;padding:56px 2.5rem 36px;display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:32px}
        .gft-marca img{height:44px;width:auto;margin-bottom:14px}
        .gft-marca p{max-width:320px;line-height:1.6;margin:0 0 14px}
        .gft-marca a{color:#fff;text-decoration:none}
        .gft h4{color:#fff;font-size:13px;font-weight:600;margin:0 0 14px;font-family:var(--font-sans);letter-spacing:0}
        .gft-wrap > div:not(.gft-marca){display:flex;flex-direction:column;gap:10px}
        .gft-wrap > div:not(.gft-marca) a{color:rgba(255,255,255,.65);text-decoration:none}
        .gft-wrap > div:not(.gft-marca) a:hover{color:#fff}
        .gft-base{max-width:1280px;margin:0 auto;padding:18px 2.5rem 28px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;color:rgba(255,255,255,.4)}
        .gft-wa{position:fixed;right:20px;bottom:20px;width:52px;height:52px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(37,211,102,.4);z-index:90}
        @media (max-width:800px){.gft-wrap{grid-template-columns:1fr 1fr;padding:40px 1.25rem 28px}.gft-marca{grid-column:1/-1}.gft-base{padding:16px 1.25rem 80px}}
      `}</style>
    </>
  );
}
