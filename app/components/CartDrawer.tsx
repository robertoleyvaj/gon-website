// app/components/CartDrawer.tsx
'use client';
import { useState } from 'react';
import { useCart, CartItem } from '../context/CartContext';
import { useLang } from './LanguageContext';
import Link from 'next/link';

function ItemCard({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  const { t } = useLang() as any;
  const { removeItem, addItem } = useCart();
  const [editandoPaciente, setEditandoPaciente] = useState(false);
  const [nombreTemp, setNombreTemp] = useState(item.paciente || '');

  const guardarNombre = () => {
    if (!nombreTemp.trim()) return;
    removeItem(item.id);
    addItem({ ...item, paciente: nombreTemp.trim() });
    setEditandoPaciente(false);
  };

  return (
    <div style={{ padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: '72px', height: '60px', borderRadius: '8px', background: 'var(--cream-dark)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.armazon_imagen
            ? <img src={item.armazon_imagen} alt={item.armazon_nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <svg width="40" height="22" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.2 }}><rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {editandoPaciente ? (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <input
                autoFocus type="text" value={nombreTemp}
                onChange={e => setNombreTemp(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') guardarNombre(); if (e.key === 'Escape') setEditandoPaciente(false); }}
                placeholder={t('Nombre...', 'Name...')}
                style={{ flex: 1, padding: '4px 8px', borderRadius: '6px', border: '1.5px solid var(--sage)', fontSize: '12px', fontFamily: 'var(--font-sans)', outline: 'none' }}
              />
              <button onClick={guardarNombre} style={{ background: 'var(--sage)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>✓</button>
              <button onClick={() => setEditandoPaciente(false)} style={{ background: 'var(--cream-dark)', color: '#6f6a63', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              {item.paciente
                ? <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage)' }}>{item.paciente}</span>
                : <span style={{ fontSize: '10px', fontWeight: 600, color: '#c0392b', background: '#fff5f5', padding: '2px 8px', borderRadius: '20px', border: '1px solid #fcc' }}>⚠ {t('Sin nombre — requerido', 'No name — required')}</span>
              }
              <button onClick={() => { setNombreTemp(item.paciente || ''); setEditandoPaciente(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a9a9a', fontSize: '10px', fontFamily: 'var(--font-sans)', textDecoration: 'underline', padding: 0 }}>
                {item.paciente ? t('editar', 'edit') : t('agregar', 'add')}
              </button>
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, color: '#1d1d1d', marginBottom: '4px', lineHeight: 1.2 }}>{item.armazon_nombre}</div>

          {item.lentes && !item.solo_armazon && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', color: '#6f6a63' }}>{item.lentes.vision_nombre}</div>
              <div style={{ fontSize: '11px', color: '#6f6a63' }}>{item.lentes.material_nombre}</div>
              {item.lentes.filtros_nombres.length > 0 && <div style={{ fontSize: '11px', color: '#6f6a63' }}>{item.lentes.filtros_nombres.join(' · ')}</div>}
            </div>
          )}

          {item.solo_armazon && <span style={{ fontSize: '9px', fontWeight: 600, color: '#9a9a9a', background: 'var(--cream-dark)', padding: '2px 8px', borderRadius: '20px' }}>{t('Solo armazón', 'Frame only')}</span>}

          {item.receta && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.receta.metodo === 'despues' ? '#d97706' : 'var(--sage)', flexShrink: 0 }}/>
              <span style={{ fontSize: '10px', color: item.receta.metodo === 'despues' ? '#92400e' : 'var(--sage)', fontWeight: 500 }}>
                {item.receta.metodo === 'manual' && t('Receta ingresada', 'Prescription entered')}
                {item.receta.metodo === 'foto' && t('Foto adjunta', 'Photo attached')}
                {item.receta.metodo === 'despues' && t('Receta pendiente', 'Prescription pending')}
                {item.receta.metodo === 'sin_graduacion' && t('Sin graduación', 'No prescription')}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 400, color: '#1d1d1d' }}>
            ${item.precio_total.toLocaleString('es-MX')} MXN
          </div>
          <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a9a9a', fontSize: '11px', fontFamily: 'var(--font-sans)', textDecoration: 'underline', padding: 0 }}>
            {t('Eliminar', 'Remove')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { t, lang } = useLang() as any;
  const { items, removeItem, totalPrecio, totalItems, cartOpen, setCartOpen } = useCart();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Cupón
  const [cuponInput, setCuponInput] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState<{ codigo: string; tipo: 'porcentaje' | 'fijo'; valor: number; descuento: number } | null>(null);
  const [cuponError, setCuponError] = useState('');
  const [validandoCupon, setValidandoCupon] = useState(false);

  const descuento = cuponAplicado?.descuento ?? 0;
  const totalConDescuento = Math.max(0, totalPrecio - descuento);

  const aplicarCupon = async () => {
    if (!cuponInput.trim()) return;
    setValidandoCupon(true);
    setCuponError('');
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cuponInput.trim().toUpperCase(), total: totalPrecio }),
      });
      const data = await res.json();
      if (data.valido) {
        const monto = data.tipo === 'fijo' ? data.valor : Math.round(totalPrecio * data.valor / 100);
        setCuponAplicado({ codigo: cuponInput.trim().toUpperCase(), tipo: data.tipo, valor: data.valor, descuento: monto });
        setCuponInput('');
      } else {
        setCuponError(data.error || 'Código inválido');
      }
    } catch {
      setCuponError('Error al validar el código');
    }
    setValidandoCupon(false);
  };

  const quitarCupon = () => { setCuponAplicado(null); setCuponError(''); };

  const handleCheckout = async () => {
    const sinNombre = items.filter(i => !i.paciente?.trim());
    if (sinNombre.length > 0) {
      alert(t(
        `Por favor agrega un nombre a ${sinNombre.length === 1 ? 'tu par de lentes' : 'todos los pares'} antes de continuar.`,
        `Please add a name to ${sinNombre.length === 1 ? 'your pair of glasses' : 'all pairs'} before continuing.`
      ));
      return;
    }
    setLoadingCheckout(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total: totalConDescuento, cupon: cuponAplicado }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert(t('Error al procesar el pago.', 'Error processing payment.')); setLoadingCheckout(false); }
    } catch {
      alert(t('Error al procesar el pago.', 'Error processing payment.'));
      setLoadingCheckout(false);
    }
  };

  const tienePendientes = items.some(i => i.receta?.metodo === 'despues');

  return (
    <>
      {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 300, backdropFilter: 'blur(2px)' }}/>}

      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px', maxWidth: '100vw', background: 'white', zIndex: 301, boxShadow: '-2px 0 40px rgba(0,0,0,0.08)', transform: cartOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, margin: 0, color: '#1d1d1d' }}>{t('Tu carrito', 'Your cart')}</h3>
            {totalItems > 0 && <span style={{ background: 'var(--sage)', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{totalItems}</span>}
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: 'var(--cream-dark)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: '#6f6a63', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ marginBottom: '1rem', opacity: 0.3 }}>
                <svg width="48" height="28" viewBox="0 0 160 90" fill="none"><rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/><path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: '#1d1d1d', marginBottom: '0.5rem' }}>{t('Tu carrito está vacío', 'Your cart is empty')}</p>
              <p style={{ fontSize: '13px', color: '#9a9a9a', marginBottom: '1.5rem' }}>{t('Agrega un par de lentes para comenzar.', 'Add a pair of glasses to get started.')}</p>
              <Link href="/Tienda" onClick={() => setCartOpen(false)} style={{ display: 'inline-block', background: 'var(--sage)', color: 'white', padding: '12px 24px', borderRadius: '3px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
                {t('Ver colección', 'Browse frames')}
              </Link>
            </div>
          ) : (
            <>
              {items.map(item => <ItemCard key={item.id} item={item} onRemove={() => removeItem(item.id)}/>)}

              {tienePendientes && (
                <div style={{ margin: '1rem 0', background: '#fffbeb', borderRadius: '8px', padding: '0.85rem 1rem', border: '1px solid rgba(245,197,24,0.3)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#92400e', margin: '0 0 2px' }}>⚠ {t('Recetas pendientes', 'Prescriptions pending')}</p>
                  <p style={{ fontSize: '11px', color: '#a16207', margin: 0, lineHeight: 1.5 }}>
                    {t('Algunos pares no tienen receta. Se solicitará antes de fabricar.', "Some pairs don't have a prescription. We'll request it before manufacturing.")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', background: 'white', flexShrink: 0 }}>

            {/* Desglose */}
            <div style={{ marginBottom: '0.75rem' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6f6a63', marginBottom: '4px' }}>
                  <span style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.paciente ? `${item.paciente} — ` : ''}{item.armazon_nombre}
                  </span>
                  <span style={{ fontWeight: 500, color: '#1d1d1d', flexShrink: 0 }}>${item.precio_total.toLocaleString('es-MX')} MXN</span>
                </div>
              ))}
            </div>

            {/* Cupón aplicado */}
            {cuponAplicado && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EFF6FF', borderRadius: '6px', padding: '8px 12px', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--sage)' }}>🏷 {cuponAplicado.codigo}</span>
                  <span style={{ fontSize: '11px', color: 'var(--sage)', marginLeft: '8px' }}>
                    {cuponAplicado.tipo === 'porcentaje' ? `-${cuponAplicado.valor}%` : `-$${cuponAplicado.valor.toLocaleString('es-MX')}`}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--sage)' }}>-${descuento.toLocaleString('es-MX')} MXN</span>
                  <button onClick={quitarCupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a9a9a', fontSize: '14px', lineHeight: 1, padding: 0 }}>×</button>
                </div>
              </div>
            )}

            {/* Input cupón */}
            {!cuponAplicado && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text" value={cuponInput}
                    onChange={e => { setCuponInput(e.target.value.toUpperCase()); setCuponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && aplicarCupon()}
                    placeholder={t('Código de descuento', 'Discount code')}
                    style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', border: cuponError ? '1.5px solid #c0392b' : '1px solid #e8e4df', fontSize: '12px', fontFamily: 'var(--font-sans)', outline: 'none', letterSpacing: '0.05em' }}
                  />
                  <button onClick={aplicarCupon} disabled={validandoCupon || !cuponInput.trim()} style={{ background: '#1d1d1d', color: 'white', border: 'none', borderRadius: '6px', padding: '9px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', opacity: (!cuponInput.trim() || validandoCupon) ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                    {validandoCupon ? '...' : t('Aplicar', 'Apply')}
                  </button>
                </div>
                {cuponError && <p style={{ fontSize: '11px', color: '#c0392b', margin: '4px 0 0', paddingLeft: '2px' }}>{cuponError}</p>}
              </div>
            )}

            {/* Total */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginBottom: '1rem' }}>
              {cuponAplicado && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9a9a9a', marginBottom: '4px' }}>
                  <span>{t('Subtotal', 'Subtotal')}</span>
                  <span style={{ textDecoration: 'line-through' }}>${totalPrecio.toLocaleString('es-MX')} MXN</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: '#1d1d1d', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 400, color: cuponAplicado ? 'var(--sage)' : '#1d1d1d' }}>
                  ${totalConDescuento.toLocaleString('es-MX')} <span style={{ fontSize: '0.75rem', color: '#9a9a9a', fontFamily: 'var(--font-sans)' }}>MXN</span>
                </span>
              </div>
            </div>

            {/* Checkout */}
            <button onClick={handleCheckout} disabled={loadingCheckout} style={{ width: '100%', background: loadingCheckout ? '#9a9a9a' : '#1d1d1d', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '13px', fontWeight: 600, cursor: loadingCheckout ? 'not-allowed' : 'pointer', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', transition: 'background 0.2s', marginBottom: '10px' }}
              onMouseEnter={e => !loadingCheckout && (e.currentTarget.style.background = 'var(--sage)')}
              onMouseLeave={e => !loadingCheckout && (e.currentTarget.style.background = '#1d1d1d')}
            >
              {loadingCheckout ? t('Procesando...', 'Processing...') : t('Pagar con tarjeta →', 'Checkout →')}
            </button>
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#9a9a9a', margin: 0 }}>🔒 {t('Pago seguro con Stripe', 'Secure payment with Stripe')}</p>
          </div>
        )}
      </div>
    </>
  );
}
