'use client';
// Pago en línea de GON: elige sucursal, cómo pagar (Apartar / Anticipo / Liquidar) y cuánto.
// Las reglas viven en lib/pago-gon.ts y el servidor las vuelve a revisar.
import { useState, useMemo } from 'react';
import type { CartItem } from '../context/CartContext';
import { rangoPago, validarPago, SUCURSALES_PAGO, DIAS_APARTADO, DIAS_SALDO_FAVOR, type ModoPago } from '../lib/pago-gon';

// Textos pensados para el cliente: beneficio primero; las reglas solo en el "?"
const OPCIONES: { k: ModoPago; titulo: string; corto: string; ayuda: string }[] = [
  { k: 'liquidar', titulo: 'Pagar todo', corto: 'Los mandamos a hacer hoy mismo',
    ayuda: 'Pagas el total en línea y mandamos a hacer tus lentes de inmediato. Solo pasas a recogerlos.' },
  { k: 'anticipo', titulo: 'Dejar un anticipo', corto: 'Empezamos tus lentes y pagas el resto al recoger',
    ayuda: 'Dejas una parte (del 35% al 60% del total) y mandamos a hacer tus lentes de inmediato. El resto lo pagas al recogerlos en la óptica.' },
  { k: 'apartar', titulo: 'Solo apartarlos', corto: `Te guardamos tus lentes y tu precio web ${DIAS_APARTADO} días`,
    ayuda: `Dejas de $100 a $300 y te guardamos tus lentes con tu precio web. Tienes ${DIAS_APARTADO} días para pasar a la óptica a dejar tu anticipo y los mandamos a hacer. El apartado no es reembolsable; si no pasas a tiempo, tu dinero queda como saldo a favor por ${DIAS_SALDO_FAVOR} días.` },
];
const mxn = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

export default function PagoGon({ items, total, onVolver }: { items: CartItem[]; total: number; onVolver: () => void }) {
  const [sucursal, setSucursal] = useState('');
  const [modo, setModo] = useState<ModoPago | ''>('liquidar');
  const [monto, setMonto] = useState(String(Math.round(total)));
  const [ayuda, setAyuda] = useState<ModoPago | null>(null);
  const [acepto, setAcepto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const rango = useMemo(() => modo ? rangoPago(modo, total) : null, [modo, total]);
  const montoNum = modo === 'liquidar' ? Math.round(total) : Math.round(Number(monto) || 0);
  const errMonto = modo && (modo === 'liquidar' || monto !== '') ? validarPago(modo, total, montoNum) : null;
  const listo = !!sucursal && !!modo && !errMonto && montoNum > 0 && (modo !== 'apartar' || acepto);

  const elegir = (k: ModoPago) => {
    setModo(k); setError(''); setAcepto(false);
    const r = rangoPago(k, total);
    setMonto(String(k === 'apartar' ? Math.min(200, r.max) : r.min));
  };

  const pagar = async () => {
    if (!listo || !modo) return;
    setEnviando(true); setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, modo, monto: montoNum, sucursal }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      setError(data.error || 'No se pudo iniciar el pago. Intenta de nuevo.');
    } catch { setError('No se pudo iniciar el pago. Intenta de nuevo.'); }
    setEnviando(false);
  };

  return (
    <div className="pg">
      <button className="pg-volver" onClick={onVolver}>← Volver al carrito</button>

      <p className="pg-l">1. ¿Dónde los recoges?</p>
      <div className="pg-suc">
        {SUCURSALES_PAGO.map(s => (
          <button key={s.k} className={sucursal === s.k ? 'on' : ''} onClick={() => setSucursal(s.k)}>
            <b>{s.nombre}</b><span>{s.dir}</span>
          </button>
        ))}
      </div>

      <p className="pg-l">2. ¿Cómo quieres pagar?</p>
      <div className="pg-op">
        {OPCIONES.map(o => (
          <div key={o.k} className={`pg-o ${modo === o.k ? 'on' : ''}`}>
            <button className="pg-o-main" onClick={() => elegir(o.k)}>
              <span className="pg-o-top"><b>{o.titulo}</b><em>{o.k === 'liquidar' ? mxn(total) : `desde ${mxn(rangoPago(o.k, total).min)}`}</em></span>
              <span>{o.corto}</span>
            </button>
            <button className="pg-q" aria-label={`¿Qué es ${o.titulo}?`} onClick={() => setAyuda(ayuda === o.k ? null : o.k)}>?</button>
            {ayuda === o.k && <p className="pg-ayuda">{o.ayuda}</p>}
          </div>
        ))}
      </div>

      {modo && rango && (
        <>
          {modo !== 'liquidar' && (
            <>
              <p className="pg-l">¿Cuánto quieres dejar hoy?</p>
              <div className="pg-monto">
                <span>$</span>
                <input type="number" inputMode="numeric" min={rango.min} max={rango.max} value={monto}
                  onChange={e => setMonto(e.target.value.replace(/[^\d]/g, ''))} />
              </div>
              {errMonto && <p className="pg-err">{errMonto}</p>}
            </>
          )}

          <div className="pg-res">
            <div><span>Total web</span><b>{mxn(total)}</b></div>
            <div><span>Pagas hoy</span><b>{mxn(montoNum)}</b></div>
            <div><span>Pendiente al recoger</span><b>{mxn(Math.max(0, total - montoNum))}</b></div>
          </div>

          {modo === 'apartar' && (
            <label className="pg-acepto">
              <input type="checkbox" checked={acepto} onChange={e => setAcepto(e.target.checked)} />
              <span>Entiendo que el apartado no es reembolsable y que tengo {DIAS_APARTADO} días para pasar a dejar mi anticipo; si no, queda como saldo a favor por {DIAS_SALDO_FAVOR} días.</span>
            </label>
          )}
        </>
      )}

      {error && <p className="pg-err">{error}</p>}
      <button className="pg-pagar" disabled={!listo || enviando} onClick={pagar}>
        {enviando ? 'Procesando…' : listo ? `Pagar ${mxn(montoNum)} →` : !sucursal ? 'Elige dónde los recoges' : 'Revisa tu pago'}
      </button>
      <p className="pg-seg">🔒 Pago seguro con Stripe</p>

      <style>{`
        .pg{padding:1rem 0 1.5rem}
        .pg-volver{background:none;border:none;color:var(--sage);font-size:13px;cursor:pointer;padding:0;margin:0 0 14px;font-family:var(--font-sans)}
        .pg-l{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#1d1d1d;margin:18px 0 8px}
        .pg-suc{display:flex;flex-direction:column;gap:6px}
        .pg-suc button,.pg-o-main{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;text-align:left;background:#fff;border:1px solid var(--border);border-radius:8px;padding:10px 12px;cursor:pointer;font-family:var(--font-sans)}
        .pg-suc button b,.pg-o-main b{font-size:13.5px;color:#1d1d1d}
        .pg-o-top{display:flex;justify-content:space-between;width:100%;padding-right:30px}
        .pg-o-top em{font-style:normal;font-size:13px;color:#1d1d1d}
        .pg-suc button span,.pg-o-main span{font-size:11.5px;color:#8a8a8a}
        .pg-suc button.on{border:1.5px solid var(--sage);background:rgba(27,47,94,.05)}
        .pg-op{display:flex;flex-direction:column;gap:6px}
        .pg-o{position:relative}
        .pg-o.on .pg-o-main{border:1.5px solid var(--sage);background:rgba(27,47,94,.05)}
        .pg-q{position:absolute;top:9px;right:10px;width:22px;height:22px;border-radius:50%;border:1px solid var(--border);background:#fff;color:var(--sage);font-weight:700;font-size:12px;cursor:pointer}
        .pg-ayuda{font-size:12px;line-height:1.55;color:#555;background:#f5f7fb;border-radius:6px;padding:10px 12px;margin:6px 0 0}
        .pg-monto{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .pg-monto span{font-size:18px;font-weight:600}
        .pg-monto input{width:120px;font-size:18px;font-weight:600;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-family:var(--font-sans)}
        .pg-monto small{font-size:11.5px;color:#8a8a8a;width:100%}
        .pg-fijo{font-size:20px;font-weight:600;margin:0}
        .pg-err{color:#c0392b;font-size:12px;margin:6px 0 0}
        .pg-res{background:var(--cream-dark);border-radius:8px;padding:10px 12px;margin:14px 0 0}
        .pg-res div{display:flex;justify-content:space-between;font-size:13px;padding:3px 0}
        .pg-res span{color:#666}
        .pg-acepto{display:flex;gap:8px;align-items:flex-start;font-size:11.5px;line-height:1.5;color:#555;margin:12px 0 0;cursor:pointer}
        .pg-pagar{width:100%;margin:18px 0 8px;background:var(--sage);color:#fff;border:none;border-radius:8px;padding:15px;font-size:13px;font-weight:600;letter-spacing:.04em;cursor:pointer;font-family:var(--font-sans)}
        .pg-pagar:disabled{background:#b9bfca;cursor:not-allowed}
        .pg-seg{text-align:center;font-size:11px;color:#9a9a9a;margin:0}
      `}</style>
    </div>
  );
}
