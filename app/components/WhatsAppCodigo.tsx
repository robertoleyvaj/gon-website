'use client';
// Código web en TODOS los botones de WhatsApp de gonmx.com.
// Cualquier enlace a wa.me/526648343018 (apartar, agendar examen, preguntas, ubicaciones, botón flotante…)
// genera un código WEB-XXXXX, se lo agrega al mensaje con la explicación y muestra un aviso en la página.
// Si el enlace trae data-armazon="ID", el código queda ligado a ese armazón (solo como referencia).
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { WHATSAPP_GON } from '../lib/precio-gon';

const DIAS = 30;

export default function WhatsAppCodigo() {
  const ruta = usePathname() || '';
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    if (ruta.startsWith('/admin') || ruta.startsWith('/checkout')) return;
    const onClick = async (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null;
      if (!a || !a.href.includes(`wa.me/${WHATSAPP_GON}`)) return;
      e.preventDefault();

      // La ventana se abre antes de pedir el código para que el navegador no la bloquee
      const w = window.open('', '_blank');
      const url = new URL(a.href);
      const texto = url.searchParams.get('text') || 'Hola';
      let final = texto;
      try {
        const armazon = Number(a.dataset.armazon) || null;
        const j = await fetch('/api/codigo-web', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ armazon_id: armazon, color_sku: a.dataset.color || null }),
        }).then(r => r.json());
        if (j?.ok && j.codigo) {
          final = `${texto}\n\nMi código web: ${j.codigo}`;
          setAviso(j.codigo);
        }
      } catch { /* si falla, se manda el mensaje sin código */ }
      url.searchParams.set('text', final);
      if (w) w.location.href = url.toString(); else window.location.href = url.toString();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [ruta]);

  if (!aviso) return null;
  return (
    <div className="wac" role="status">
      <button className="wac-x" onClick={() => setAviso(null)} aria-label="Cerrar">×</button>
      <b>Tu código web: <span>{aviso}</span></b>
      <p>Ya va en tu mensaje de WhatsApp. Muéstralo en cualquiera de nuestras ópticas y te respetamos el precio web: armazones −60% y micas y filtros −15%. Válido {DIAS} días, en una compra.</p>
      <style>{`
        .wac{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:400;width:min(440px,calc(100% - 28px));background:#fff;border:2px solid var(--sage);border-radius:12px;padding:16px 18px 14px;box-shadow:0 18px 50px rgba(0,0,0,.18);font-family:var(--font-sans)}
        .wac b{display:block;font-size:15px;color:var(--charcoal);margin-bottom:6px}
        .wac b span{font-family:ui-monospace,monospace;color:var(--sage);letter-spacing:.04em}
        .wac p{margin:0;font-size:13px;line-height:1.5;color:var(--warm-gray)}
        .wac-x{position:absolute;top:6px;right:10px;background:none;border:none;font-size:22px;color:var(--warm-gray);cursor:pointer}
      `}</style>
    </div>
  );
}
