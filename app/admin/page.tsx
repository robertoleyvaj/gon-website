// app/admin/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  )},
  { id: 'pedidos', label: 'Pedidos', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )},
  { id: 'clientes', label: 'Clientes', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
  { id: 'catalogo', label: 'Catálogo', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.2.4.312.846.312 1.311V12a8.5 8.5 0 1 1-8.5-8.5h.244"/>
    </svg>
  )},
  { id: 'finanzas', label: 'Finanzas', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  )},
  { id: 'promociones', label: 'Promociones', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )},
  { id: 'marketing', label: 'Marketing', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )},
];

const ESTADOS = ['pendiente', 'en proceso', 'enviado', 'entregado'];

const ESTADO_COLORS: any = {
  'pendiente': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'en proceso': { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  'enviado': { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  'entregado': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [modulo, setModulo] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [armazones, setArmazones] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [finanzas, setFinanzas] = useState<any[]>([]);

  const [editArmazon, setEditArmazon] = useState<any>(null);
  const [editPedido, setEditPedido] = useState<any>(null);
  const [editCliente, setEditCliente] = useState<any>(null);
  const [showNewPedido, setShowNewPedido] = useState(false);
  const [showNewCliente, setShowNewCliente] = useState(false);
  const [showNewArmazon, setShowNewArmazon] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [newPedido, setNewPedido] = useState<any>({
    cliente_id: '', armazon_id: '', estado: 'pendiente',
    precio_venta: '', notas_admin: '', notas_cliente: '',
    tracking: '', paqueteria: '',
    receta: { sph_od: '', cyl_od: '', axis_od: '', sph_os: '', cyl_os: '', axis_os: '', add_val: '', dp: '', notas: '' },
    finanzas: { costo_armazon: '', costo_laboratorio: '', otros_costos: '' },
  });
  const [newCliente, setNewCliente] = useState({ nombre: '', email: '', telefono: '', direccion: '', notas: '' });
  const [newArmazon, setNewArmazon] = useState({ nombre: '', forma: 'cuadrada', genero: 'unisex', precio: '13', stock: '10', badge: '', color: '#1A1A2E', activo: true, marca: '', imagen_url: '', tipo: 'optico' });

  useEffect(() => { if (authed) cargarTodo(); }, [authed]);

  async function cargarTodo() {
    const [{ data: a }, { data: p }, { data: c }, { data: f }] = await Promise.all([
      supabase.from('armazones').select('*').order('id'),
      supabase.from('pedidos').select('*, clientes(*), armazones(*), recetas(*), pedido_items(*), finanzas(*)').order('created_at', { ascending: false }),
      supabase.from('clientes').select('*').order('created_at', { ascending: false }),
      supabase.from('finanzas').select('*'),
    ]);
    setArmazones(a || []);
    setPedidos(p || []);
    setClientes(c || []);
    setFinanzas(f || []);
  }

  async function subirFoto(file: File, armazonId?: number): Promise<string | null> {
    setUploadingImg(true);
    const ext = file.name.split('.').pop();
    const nombre = `armazon-${armazonId || Date.now()}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('armazones').upload(nombre, file, { upsert: true });
    if (error) { console.error(error); setUploadingImg(false); return null; }
    const { data } = supabase.storage.from('armazones').getPublicUrl(nombre);
    setUploadingImg(false);
    return data.publicUrl;
  }

  const totalVentas = pedidos.reduce((s, p) => s + (p.precio_venta || 0), 0);
  const totalCostos = finanzas.reduce((s, f) => s + (f.costo_armazon || 0) + (f.costo_laboratorio || 0) + (f.otros_costos || 0), 0);
  const ganancia = totalVentas - totalCostos;
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;

  const C = {
    bg: 'var(--cream)',
    white: 'white',
    charcoal: 'var(--charcoal)',
    sage: 'var(--sage)',
    border: 'var(--border)',
    warmGray: 'var(--warm-gray)',
    creamDark: 'var(--cream-dark)',
  };

  const inputStyle: any = {
    width: '100%', padding: '8px 12px', borderRadius: '6px',
    border: '1px solid var(--border)', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'var(--font-sans), sans-serif',
    background: 'var(--cream)', color: 'var(--charcoal)',
  };

  const labelStyle: any = {
    fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)',
    letterSpacing: '0.1em', display: 'block', marginBottom: '4px',
    textTransform: 'uppercase', fontFamily: 'var(--font-sans), sans-serif',
  };

  const btnPrimary: any = {
    background: 'var(--charcoal)', color: 'white', border: 'none',
    borderRadius: '4px', padding: '9px 18px', fontSize: '12px',
    fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans), sans-serif',
    letterSpacing: '0.06em',
  };

  const btnSage: any = {
    background: 'var(--sage)', color: 'white', border: 'none',
    borderRadius: '4px', padding: '9px 18px', fontSize: '12px',
    fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans), sans-serif',
    letterSpacing: '0.06em',
  };

  const btnDanger: any = {
    background: 'white', color: '#C0392B', border: '1px solid #C0392B',
    borderRadius: '4px', padding: '6px 14px', fontSize: '12px',
    fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans), sans-serif',
  };

  const btnGhost: any = {
    background: 'white', color: 'var(--warm-gray)', border: '1px solid var(--border)',
    borderRadius: '4px', padding: '9px 18px', fontSize: '12px',
    fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans), sans-serif',
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans), sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '2.5rem', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo-trasparente.png" alt="Verly" style={{ height: '36px', marginBottom: '1rem' }}/>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: 0 }}>Panel de administración</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} style={inputStyle}/>
          <input type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (user === 'admin@verlyoptical.com' && pass === 'verly2024' ? setAuthed(true) : alert('Credenciales incorrectas'))}
            style={inputStyle}/>
          <button onClick={() => user === 'admin@verlyoptical.com' && pass === 'verly2024' ? setAuthed(true) : alert('Credenciales incorrectas')}
            style={{ ...btnPrimary, padding: '12px', marginTop: '4px' }}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-sans), sans-serif', background: 'var(--cream)', color: 'var(--charcoal)' }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: sidebarOpen ? '220px' : '56px', flexShrink: 0,
        background: 'var(--charcoal)', color: 'white',
        transition: 'width 0.25s ease', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: sidebarOpen ? '1.5rem 1.25rem 1rem' : '1.5rem 0 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: '10px' }}>
          {sidebarOpen
            ? <img src="/logo-trasparente.png" alt="Verly" style={{ height: '28px', opacity: 0.9 }}/>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/></svg>
          }
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {MENU.map(m => (
            <button key={m.id} onClick={() => setModulo(m.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: sidebarOpen ? '10px 16px' : '10px 0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              border: 'none',
              background: modulo === m.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: modulo === m.id ? 'white' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer', fontSize: '13px', fontWeight: modulo === m.id ? 500 : 400,
              borderLeft: modulo === m.id ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
              textAlign: 'left', fontFamily: 'var(--font-sans), sans-serif',
              transition: 'all 0.15s',
            }}>
              <span style={{ flexShrink: 0 }}>{m.icon}</span>
              {sidebarOpen && <span>{m.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {sidebarOpen ? <><polyline points="15 18 9 12 15 6"/></> : <><polyline points="9 18 15 12 9 6"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0.85rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--charcoal)', letterSpacing: '0.02em' }}>
            {MENU.find(m => m.id === modulo)?.label}
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="/" target="_blank" style={{ fontFamily: 'var(--font-sans)', color: 'var(--warm-gray)', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.04em' }}>Ver sitio →</a>
            <button onClick={() => setAuthed(false)} style={{ ...btnGhost, padding: '6px 12px', fontSize: '11px' }}>Salir</button>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>

          {/* ── DASHBOARD ── */}
          {modulo === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Ventas totales', valor: `$${totalVentas.toFixed(0)}`, sub: 'USD' },
                  { label: 'Ganancia neta', valor: `$${ganancia.toFixed(0)}`, sub: 'USD' },
                  { label: 'Pedidos', valor: pedidos.length, sub: 'total' },
                  { label: 'Pendientes', valor: pedidosPendientes, sub: 'por atender' },
                  { label: 'Clientes', valor: clientes.length, sub: 'registrados' },
                  { label: 'Armazones', valor: armazones.length, sub: 'en catálogo' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--warm-gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1 }}>{m.valor}</div>
                    <div style={{ fontSize: '11px', color: 'var(--warm-gray)', marginTop: '4px' }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>Pedidos recientes</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--cream)' }}>
                      {['#', 'Cliente', 'Armazón', 'Total', 'Estado', 'Fecha'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.slice(0, 8).map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)', fontWeight: 500 }}>#{p.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.clientes?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--warm-gray)' }}>{p.armazones?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>${p.precio_venta || 0}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: ESTADO_COLORS[p.estado]?.bg, color: ESTADO_COLORS[p.estado]?.text, border: `1px solid ${ESTADO_COLORS[p.estado]?.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {p.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: '13px' }}>Sin pedidos aún</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PEDIDOS ── */}
          {modulo === 'pedidos' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--warm-gray)' }}>{pedidos.length} pedidos</p>
                <button onClick={() => setShowNewPedido(true)} style={btnPrimary}>+ Nuevo pedido</button>
              </div>

              {showNewPedido && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Nuevo pedido</h3>
                      <button onClick={() => setShowNewPedido(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Cliente</label>
                        <select value={newPedido.cliente_id} onChange={e => setNewPedido({...newPedido, cliente_id: e.target.value})} style={inputStyle}>
                          <option value="">Seleccionar cliente</option>
                          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Armazón</label>
                        <select value={newPedido.armazon_id} onChange={e => setNewPedido({...newPedido, armazon_id: e.target.value})} style={inputStyle}>
                          <option value="">Seleccionar armazón</option>
                          {armazones.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Precio de venta ($)</label>
                        <input type="number" value={newPedido.precio_venta} onChange={e => setNewPedido({...newPedido, precio_venta: e.target.value})} style={inputStyle} placeholder="0"/>
                      </div>
                      <div>
                        <label style={labelStyle}>Estado</label>
                        <select value={newPedido.estado} onChange={e => setNewPedido({...newPedido, estado: e.target.value})} style={inputStyle}>
                          {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Receta óptica</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {[
                          { key: 'sph_od', label: 'SPH OD' }, { key: 'cyl_od', label: 'CYL OD' },
                          { key: 'axis_od', label: 'EJE OD' }, { key: 'sph_os', label: 'SPH OS' },
                          { key: 'cyl_os', label: 'CYL OS' }, { key: 'axis_os', label: 'EJE OS' },
                          { key: 'add_val', label: 'ADD' }, { key: 'dp', label: 'DP' },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={{...labelStyle, fontSize: '9px'}}>{f.label}</label>
                            <input type="number" step="0.25" value={newPedido.receta[f.key]}
                              onChange={e => setNewPedido({...newPedido, receta: {...newPedido.receta, [f.key]: e.target.value}})}
                              style={{...inputStyle, padding: '6px 8px'}} placeholder="—"/>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Costos</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        {[
                          { key: 'costo_armazon', label: 'Armazón' },
                          { key: 'costo_laboratorio', label: 'Laboratorio' },
                          { key: 'otros_costos', label: 'Otros' },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={{...labelStyle, fontSize: '9px'}}>{f.label}</label>
                            <input type="number" value={newPedido.finanzas[f.key]}
                              onChange={e => setNewPedido({...newPedido, finanzas: {...newPedido.finanzas, [f.key]: e.target.value}})}
                              style={{...inputStyle, padding: '6px 8px'}} placeholder="0"/>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Notas internas</label>
                        <textarea value={newPedido.notas_admin} onChange={e => setNewPedido({...newPedido, notas_admin: e.target.value})} style={{...inputStyle, resize: 'none'}} rows={2} placeholder="Notas del admin..."/>
                      </div>
                      <div>
                        <label style={labelStyle}>Notas del cliente</label>
                        <textarea value={newPedido.notas_cliente} onChange={e => setNewPedido({...newPedido, notas_cliente: e.target.value})} style={{...inputStyle, resize: 'none'}} rows={2} placeholder="Notas del cliente..."/>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setShowNewPedido(false)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        const { data: ped } = await supabase.from('pedidos').insert({
                          cliente_id: newPedido.cliente_id || null,
                          armazon_id: newPedido.armazon_id || null,
                          estado: newPedido.estado,
                          precio_venta: parseFloat(newPedido.precio_venta) || 0,
                          notas_admin: newPedido.notas_admin,
                          notas_cliente: newPedido.notas_cliente,
                        }).select().single();
                        if (ped) {
                          await supabase.from('recetas').insert({ pedido_id: ped.id, ...Object.fromEntries(Object.entries(newPedido.receta).map(([k,v]) => [k, parseFloat(v as string) || null])) });
                          await supabase.from('finanzas').insert({ pedido_id: ped.id, precio_venta: parseFloat(newPedido.precio_venta) || 0, ...Object.fromEntries(Object.entries(newPedido.finanzas).map(([k,v]) => [k, parseFloat(v as string) || 0])) });
                        }
                        setShowNewPedido(false);
                        cargarTodo();
                      }} style={btnSage}>Guardar pedido</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--cream)' }}>
                      {['#', 'Cliente', 'Armazón', 'Total', 'Estado', 'Dirección', 'Tracking', 'Fecha', ''].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)', fontWeight: 500 }}>#{p.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500 }}>{p.clientes?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--warm-gray)' }}>{p.armazones?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>${p.precio_venta || 0}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <select value={p.estado} onChange={async e => {
                            await supabase.from('pedidos').update({ estado: e.target.value }).eq('id', p.id);
                            cargarTodo();
                          }} style={{ padding: '4px 8px', borderRadius: '20px', border: `1px solid ${ESTADO_COLORS[p.estado]?.border}`, background: ESTADO_COLORS[p.estado]?.bg, color: ESTADO_COLORS[p.estado]?.text, fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.clientes?.direccion || '—'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)' }}>{p.tracking || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => setEditPedido(p)} style={{ ...btnGhost, padding: '4px 12px', fontSize: '11px' }}>Ver</button>
                        </td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && (
                      <tr><td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: '13px' }}>Sin pedidos aún</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {editPedido && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Pedido #{editPedido.id}</h3>
                      <button onClick={() => setEditPedido(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div><span style={labelStyle}>Cliente</span><p style={{ margin: 0, fontSize: '14px' }}>{editPedido.clientes?.nombre || '—'}</p></div>
                      <div><span style={labelStyle}>Armazón</span><p style={{ margin: 0, fontSize: '14px' }}>{editPedido.armazones?.nombre || '—'}</p></div>
                      <div><span style={labelStyle}>Total</span><p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>${editPedido.precio_venta}</p></div>
                      <div>
                        <label style={labelStyle}>Estado</label>
                        <select value={editPedido.estado} onChange={async e => {
                          await supabase.from('pedidos').update({ estado: e.target.value }).eq('id', editPedido.id);
                          setEditPedido({...editPedido, estado: e.target.value});
                          cargarTodo();
                        }} style={inputStyle}>
                          {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    {editPedido.clientes?.direccion && (
                      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                        <span style={labelStyle}>Dirección de envío</span>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--charcoal)' }}>{editPedido.clientes.direccion}</p>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Tracking</label>
                        <input value={editPedido.tracking || ''} onChange={e => setEditPedido({...editPedido, tracking: e.target.value})} style={inputStyle} placeholder="Número de tracking"/>
                      </div>
                      <div>
                        <label style={labelStyle}>Paquetería</label>
                        <input value={editPedido.paqueteria || ''} onChange={e => setEditPedido({...editPedido, paqueteria: e.target.value})} style={inputStyle} placeholder="FedEx, DHL..."/>
                      </div>
                    </div>
                    {editPedido.notas_cliente && (
                      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                        <span style={labelStyle}>Detalle del pedido</span>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--warm-gray)', lineHeight: 1.6 }}>{editPedido.notas_cliente}</p>
                      </div>
                    )}
                    {editPedido.recetas?.[0] && (
                      <div style={{ background: 'var(--cream)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Receta óptica</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '12px' }}>
                          {['sph_od','cyl_od','axis_od','sph_os','cyl_os','axis_os','add_val','dp'].map(k => (
                            <div key={k}>
                              <span style={{ color: 'var(--warm-gray)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</span>
                              <br/><strong>{editPedido.recetas[0][k] ?? '—'}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button onClick={async () => {
                        await supabase.from('pedidos').update({ tracking: editPedido.tracking, paqueteria: editPedido.paqueteria, estado: editPedido.estado }).eq('id', editPedido.id);
                        setEditPedido(null);
                        cargarTodo();
                      }} style={btnSage}>Guardar cambios</button>
                      <button onClick={async () => {
                        if (confirm('¿Eliminar pedido?')) {
                          await supabase.from('recetas').delete().eq('pedido_id', editPedido.id);
                          await supabase.from('finanzas').delete().eq('pedido_id', editPedido.id);
                          await supabase.from('pedidos').delete().eq('id', editPedido.id);
                          setEditPedido(null);
                          cargarTodo();
                        }
                      }} style={btnDanger}>Eliminar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CLIENTES ── */}
          {modulo === 'clientes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--warm-gray)' }}>{clientes.length} clientes</p>
                <button onClick={() => setShowNewCliente(true)} style={btnPrimary}>+ Nuevo cliente</button>
              </div>

              {showNewCliente && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Nuevo cliente</h3>
                      <button onClick={() => setShowNewCliente(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { key: 'nombre', label: 'Nombre', placeholder: 'Juan García' },
                        { key: 'email', label: 'Email', placeholder: 'juan@email.com' },
                        { key: 'telefono', label: 'Teléfono', placeholder: '+1 (555) 000-0000' },
                        { key: 'direccion', label: 'Dirección', placeholder: 'Ciudad, Estado' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={labelStyle}>{f.label}</label>
                          <input value={(newCliente as any)[f.key]} onChange={e => setNewCliente({...newCliente, [f.key]: e.target.value})} style={inputStyle} placeholder={f.placeholder}/>
                        </div>
                      ))}
                      <div>
                        <label style={labelStyle}>Notas</label>
                        <textarea value={newCliente.notas} onChange={e => setNewCliente({...newCliente, notas: e.target.value})} style={{...inputStyle, resize: 'none'}} rows={2}/>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button onClick={() => setShowNewCliente(false)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        await supabase.from('clientes').insert(newCliente);
                        setNewCliente({ nombre: '', email: '', telefono: '', direccion: '', notas: '' });
                        setShowNewCliente(false);
                        cargarTodo();
                      }} style={btnSage}>Guardar</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--cream)' }}>
                      {['Nombre', 'Email', 'Teléfono', 'Dirección', 'Pedidos', ''].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map(c => (
                      <tr key={c.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500 }}>{c.nombre}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--warm-gray)' }}>{c.email || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--warm-gray)' }}>{c.telefono || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--warm-gray)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.direccion || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{pedidos.filter(p => p.cliente_id === c.id).length}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => setEditCliente(c)} style={{ ...btnGhost, padding: '4px 12px', fontSize: '11px' }}>Ver</button>
                        </td>
                      </tr>
                    ))}
                    {clientes.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: '13px' }}>Sin clientes aún</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {editCliente && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{editCliente.nombre}</h3>
                      <button onClick={() => setEditCliente(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                      {['nombre','email','telefono','direccion'].map(k => (
                        <div key={k}>
                          <label style={labelStyle}>{k}</label>
                          <input value={editCliente[k] || ''} onChange={e => setEditCliente({...editCliente, [k]: e.target.value})} style={inputStyle}/>
                        </div>
                      ))}
                      <div>
                        <label style={labelStyle}>Notas</label>
                        <textarea value={editCliente.notas || ''} onChange={e => setEditCliente({...editCliente, notas: e.target.value})} style={{...inputStyle, resize: 'none'}} rows={3}/>
                      </div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Pedidos del cliente</div>
                      {pedidos.filter(p => p.cliente_id === editCliente.id).map(p => (
                        <div key={p.id} style={{ background: 'var(--cream)', borderRadius: '6px', padding: '10px 14px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span>#{p.id} — {p.armazones?.nombre}</span>
                          <span style={{ fontWeight: 600 }}>${p.precio_venta}</span>
                        </div>
                      ))}
                      {pedidos.filter(p => p.cliente_id === editCliente.id).length === 0 && (
                        <p style={{ fontSize: '13px', color: 'var(--warm-gray)', margin: 0 }}>Sin pedidos</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={async () => {
                        await supabase.from('clientes').update(editCliente).eq('id', editCliente.id);
                        setEditCliente(null);
                        cargarTodo();
                      }} style={btnSage}>Guardar</button>
                      <button onClick={async () => {
                        if (confirm('¿Eliminar cliente?')) {
                          await supabase.from('clientes').delete().eq('id', editCliente.id);
                          setEditCliente(null);
                          cargarTodo();
                        }
                      }} style={btnDanger}>Eliminar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── CATÁLOGO ── */}
          {modulo === 'catalogo' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--warm-gray)' }}>{armazones.length} armazones</p>
                <button onClick={() => setShowNewArmazon(true)} style={btnPrimary}>+ Nuevo armazón</button>
              </div>

              {showNewArmazon && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Nuevo armazón</h3>
                      <button onClick={() => setShowNewArmazon(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                      {[
                        { key: 'nombre', label: 'Nombre', placeholder: 'Clásico Negro' },
                        { key: 'marca', label: 'Marca', placeholder: 'Verly' },
                        { key: 'precio', label: 'Precio ($)', placeholder: '13' },
                        { key: 'stock', label: 'Stock', placeholder: '10' },
                        { key: 'badge', label: 'Badge', placeholder: 'Nuevo / Popular' },
                        { key: 'color', label: 'Color hex', placeholder: '#1A1A2E' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={labelStyle}>{f.label}</label>
                          <input value={(newArmazon as any)[f.key]} onChange={e => setNewArmazon({...newArmazon, [f.key]: e.target.value})} style={inputStyle} placeholder={f.placeholder}/>
                        </div>
                      ))}
                      <div>
                        <label style={labelStyle}>Forma</label>
                        <select value={newArmazon.forma} onChange={e => setNewArmazon({...newArmazon, forma: e.target.value})} style={inputStyle}>
                          {['cuadrada','ovalada','rectangular','redonda'].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Género</label>
                        <select value={newArmazon.genero} onChange={e => setNewArmazon({...newArmazon, genero: e.target.value})} style={inputStyle}>
                          {['hombre','mujer','unisex'].map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Tipo</label>
                        <select value={newArmazon.tipo} onChange={e => setNewArmazon({...newArmazon, tipo: e.target.value})} style={inputStyle}>
                          <option value="optico">Óptico</option>
                          <option value="solar">Solar</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                        <input type="checkbox" checked={newArmazon.activo} onChange={e => setNewArmazon({...newArmazon, activo: e.target.checked})} id="activo"/>
                        <label htmlFor="activo" style={{ fontSize: '13px', fontWeight: 500 }}>Activo</label>
                      </div>
                    </div>

                    {/* Subida de foto */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={labelStyle}>Foto del armazón</label>
                      {newArmazon.imagen_url ? (
                        <div style={{ marginBottom: '8px' }}>
                          <img src={newArmazon.imagen_url} alt="" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}/>
                          <button onClick={() => setNewArmazon({...newArmazon, imagen_url: ''})} style={{ background: 'none', border: 'none', color: '#C0392B', fontSize: '12px', cursor: 'pointer', marginTop: '4px', fontFamily: 'var(--font-sans)' }}>Quitar foto</button>
                        </div>
                      ) : (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px dashed var(--border)', cursor: 'pointer', background: 'var(--cream)' }}>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await subirFoto(file);
                            if (url) setNewArmazon({...newArmazon, imagen_url: url});
                          }}/>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warm-gray)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <span style={{ fontSize: '13px', color: 'var(--warm-gray)' }}>{uploadingImg ? 'Subiendo...' : 'Subir foto'}</span>
                        </label>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setShowNewArmazon(false)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        await supabase.from('armazones').insert({ ...newArmazon, precio: parseInt(newArmazon.precio), stock: parseInt(newArmazon.stock) });
                        setShowNewArmazon(false);
                        cargarTodo();
                      }} style={btnSage}>Guardar</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {armazones.map(a => (
                  <div key={a.id} style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '160px', background: `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {a.imagen_url
                        ? <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <svg width="100" height="56" viewBox="0 0 160 90" fill="none">
                            <rect x="4" y="12" width="64" height="66" rx="14" fill="none" stroke={a.color} strokeWidth="3.5"/>
                            <rect x="92" y="12" width="64" height="66" rx="14" fill="none" stroke={a.color} strokeWidth="3.5"/>
                            <path d="M68 38 C72 32, 88 32, 92 38" stroke={a.color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                          </svg>
                      }
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: a.activo ? '#D1FAE5' : '#FEE2E2', color: a.activo ? '#065F46' : '#991B1B', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 500 }}>
                        {a.activo ? 'Activo' : 'Inactivo'}
                      </div>
                      {a.tipo === 'solar' && (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--charcoal)', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 500 }}>
                          Solar
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px' }}>{a.nombre}</div>
                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginBottom: '10px', textTransform: 'capitalize' }}>{a.forma} · {a.genero}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '16px' }}>${a.precio}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setEditArmazon({...a})} style={{ ...btnGhost, padding: '4px 12px', fontSize: '11px' }}>Editar</button>
                          <button onClick={async () => {
                            if (confirm('¿Eliminar armazón?')) {
                              await supabase.from('armazones').delete().eq('id', a.id);
                              cargarTodo();
                            }
                          }} style={{ ...btnDanger, padding: '4px 12px', fontSize: '11px' }}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {editArmazon && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Editando: {editArmazon.nombre}</h3>
                      <button onClick={() => setEditArmazon(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--warm-gray)' }}>×</button>
                    </div>

                    {/* Foto */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={labelStyle}>Foto del armazón</label>
                      {editArmazon.imagen_url ? (
                        <div>
                          <img src={editArmazon.imagen_url} alt="" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '6px' }}/>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '12px', color: 'var(--warm-gray)', background: 'var(--cream)' }}>
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = await subirFoto(file, editArmazon.id);
                                if (url) {
                                  setEditArmazon({...editArmazon, imagen_url: url});
                                  await supabase.from('armazones').update({ imagen_url: url }).eq('id', editArmazon.id);
                                  cargarTodo();
                                }
                              }}/>
                              {uploadingImg ? 'Subiendo...' : 'Cambiar foto'}
                            </label>
                            <button onClick={() => setEditArmazon({...editArmazon, imagen_url: ''})} style={{ ...btnDanger, padding: '6px 12px', fontSize: '11px' }}>Quitar</button>
                          </div>
                        </div>
                      ) : (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px dashed var(--border)', cursor: 'pointer', background: 'var(--cream)' }}>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await subirFoto(file, editArmazon.id);
                            if (url) {
                              setEditArmazon({...editArmazon, imagen_url: url});
                              await supabase.from('armazones').update({ imagen_url: url }).eq('id', editArmazon.id);
                              cargarTodo();
                            }
                          }}/>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warm-gray)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <span style={{ fontSize: '13px', color: 'var(--warm-gray)' }}>{uploadingImg ? 'Subiendo...' : 'Subir foto'}</span>
                        </label>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                      {[
                        { key: 'nombre', label: 'Nombre' },
                        { key: 'marca', label: 'Marca' },
                        { key: 'precio', label: 'Precio ($)' },
                        { key: 'stock', label: 'Stock' },
                        { key: 'badge', label: 'Badge' },
                        { key: 'color', label: 'Color hex' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={labelStyle}>{f.label}</label>
                          <input value={editArmazon[f.key] || ''} onChange={e => setEditArmazon({...editArmazon, [f.key]: e.target.value})} style={inputStyle}/>
                        </div>
                      ))}
                      <div>
                        <label style={labelStyle}>Forma</label>
                        <select value={editArmazon.forma} onChange={e => setEditArmazon({...editArmazon, forma: e.target.value})} style={inputStyle}>
                          {['cuadrada','ovalada','rectangular','redonda'].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Género</label>
                        <select value={editArmazon.genero} onChange={e => setEditArmazon({...editArmazon, genero: e.target.value})} style={inputStyle}>
                          {['hombre','mujer','unisex'].map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Tipo</label>
                        <select value={editArmazon.tipo || 'optico'} onChange={e => setEditArmazon({...editArmazon, tipo: e.target.value})} style={inputStyle}>
                          <option value="optico">Óptico</option>
                          <option value="solar">Solar</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                        <input type="checkbox" checked={editArmazon.activo} onChange={e => setEditArmazon({...editArmazon, activo: e.target.checked})} id="editActivo"/>
                        <label htmlFor="editActivo" style={{ fontSize: '13px', fontWeight: 500 }}>Activo</label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditArmazon(null)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        await supabase.from('armazones').update({ ...editArmazon, precio: parseInt(editArmazon.precio), stock: parseInt(editArmazon.stock) }).eq('id', editArmazon.id);
                        setEditArmazon(null);
                        cargarTodo();
                      }} style={btnSage}>Guardar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── FINANZAS ── */}
          {modulo === 'finanzas' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Ingresos totales', valor: `$${totalVentas.toFixed(2)}` },
                  { label: 'Costos totales', valor: `$${totalCostos.toFixed(2)}` },
                  { label: 'Ganancia bruta', valor: `$${ganancia.toFixed(2)}` },
                  { label: 'Margen', valor: totalVentas > 0 ? `${((ganancia/totalVentas)*100).toFixed(1)}%` : '0%' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--warm-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--charcoal)' }}>{m.valor}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>Desglose por pedido</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--cream)' }}>
                      {['Pedido', 'Venta', 'C. Armazón', 'C. Lab', 'Otros', 'Ganancia', 'Margen'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.filter(p => p.finanzas?.[0]).map(p => {
                      const f = p.finanzas[0];
                      const costos = (f.costo_armazon || 0) + (f.costo_laboratorio || 0) + (f.otros_costos || 0);
                      const gan = (p.precio_venta || 0) - costos;
                      const margen = p.precio_venta > 0 ? ((gan / p.precio_venta) * 100).toFixed(1) : '0';
                      return (
                        <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--warm-gray)', fontWeight: 500 }}>#{p.id}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600 }}>${p.precio_venta}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#C0392B' }}>${f.costo_armazon || 0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#C0392B' }}>${f.costo_laboratorio || 0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#C0392B' }}>${f.otros_costos || 0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: gan >= 0 ? '#065F46' : '#C0392B' }}>${gan.toFixed(2)}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 500, color: 'var(--sage)' }}>{margen}%</td>
                        </tr>
                      );
                    })}
                    {pedidos.filter(p => p.finanzas?.[0]).length === 0 && (
                      <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--warm-gray)', fontSize: '13px' }}>Sin datos financieros aún</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PROMOCIONES ── */}
          {modulo === 'promociones' && (
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: '1rem' }}>
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>Promociones</p>
              <p style={{ fontSize: '13px', color: 'var(--warm-gray)' }}>Disponible en la siguiente fase de desarrollo.</p>
            </div>
          )}

          {/* ── MARKETING ── */}
          {modulo === 'marketing' && (
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: '1rem' }}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>Marketing & UTM</p>
              <p style={{ fontSize: '13px', color: 'var(--warm-gray)' }}>Disponible en la siguiente fase de desarrollo.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}