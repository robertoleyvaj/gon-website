'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'pedidos', label: 'Pedidos', icon: '🧾' },
  { id: 'clientes', label: 'Clientes', icon: '👤' },
  { id: 'catalogo', label: 'Catálogo', icon: '👓' },
  { id: 'finanzas', label: 'Finanzas', icon: '💰' },
  { id: 'promociones', label: 'Promociones', icon: '🏷️' },
  { id: 'marketing', label: 'Marketing', icon: '📣' },
];

const ESTADOS = ['pendiente', 'en proceso', 'enviado', 'entregado'];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [modulo, setModulo] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data
  const [armazones, setArmazones] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [finanzas, setFinanzas] = useState<any[]>([]);

  // Forms
  const [editArmazon, setEditArmazon] = useState<any>(null);
  const [editPedido, setEditPedido] = useState<any>(null);
  const [editCliente, setEditCliente] = useState<any>(null);
  const [showNewPedido, setShowNewPedido] = useState(false);
  const [showNewCliente, setShowNewCliente] = useState(false);
  const [showNewArmazon, setShowNewArmazon] = useState(false);

  // New forms state
  const [newPedido, setNewPedido] = useState<any>({
    cliente_id: '', armazon_id: '', estado: 'pendiente',
    precio_venta: '', notas_admin: '', notas_cliente: '',
    tracking: '', paqueteria: '',
    receta: { sph_od: '', cyl_od: '', axis_od: '', sph_os: '', cyl_os: '', axis_os: '', add_val: '', dp: '', notas: '' },
    finanzas: { costo_armazon: '', costo_laboratorio: '', otros_costos: '' },
  });
  const [newCliente, setNewCliente] = useState({ nombre: '', email: '', telefono: '', direccion: '', notas: '' });
  const [newArmazon, setNewArmazon] = useState({ nombre: '', forma: '', genero: '', precio: '43', stock: '10', badge: '', color: '#1A1A2E', activo: true, marca: '', imagen_url: '' });

  useEffect(() => {
    if (authed) cargarTodo();
  }, [authed]);

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

  // Login
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#F0FBF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>👓</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>Verly Admin</h1>
          <p style={{ color: '#7A8494', fontSize: '13px', marginTop: '4px' }}>Panel de administración</p>
        </div>
        <input placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #EAECF0', marginBottom: '12px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}/>
        <input type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (user === 'admin@verlyoptical.com' && pass === 'verly2024' ? setAuthed(true) : alert('Credenciales incorrectas'))}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #EAECF0', marginBottom: '16px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}/>
        <button onClick={() => user === 'admin@verlyoptical.com' && pass === 'verly2024' ? setAuthed(true) : alert('Credenciales incorrectas')}
          style={{ width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          Entrar
        </button>
      </div>
    </div>
  );

  // Métricas dashboard
  const totalVentas = pedidos.reduce((s, p) => s + (p.precio_venta || 0), 0);
  const totalCostos = finanzas.reduce((s, f) => s + (f.costo_armazon || 0) + (f.costo_laboratorio || 0) + (f.otros_costos || 0), 0);
  const ganancia = totalVentas - totalCostos;
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;

  const inputStyle: any = {
    width: '100%', padding: '8px 12px', borderRadius: '6px',
    border: '1.5px solid #EAECF0', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'sans-serif',
  };
  const labelStyle: any = { fontSize: '11px', fontWeight: 700, color: '#5A6478', letterSpacing: '0.5px', display: 'block', marginBottom: '4px', textTransform: 'uppercase' };
  const btnPrimary: any = { background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '6px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' };
  const btnDanger: any = { background: 'white', color: '#E05A5A', border: '1.5px solid #E05A5A', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' };
  const btnGhost: any = { background: 'white', color: '#5A6478', border: '1.5px solid #EAECF0', borderRadius: '6px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' };

  const estadoColor: any = {
    'pendiente': '#F5C518', 'en proceso': '#2BBFB3',
    'enviado': '#5B68C0', 'entregado': '#22C55E',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#F8F9FA', color: '#1A1A2E' }}>

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? '220px' : '60px', flexShrink: 0,
        background: '#1A1A2E', color: 'white',
        transition: 'width 0.25s', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>👓</span>
          {sidebarOpen && <span style={{ fontWeight: 800, fontSize: '16px', color: '#2BBFB3' }}>Verly Admin</span>}
        </div>
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {MENU.map(m => (
            <button key={m.id} onClick={() => setModulo(m.id)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              width: '100%', padding: '10px 16px', border: 'none',
              background: modulo === m.id ? 'rgba(43,191,179,0.15)' : 'transparent',
              color: modulo === m.id ? '#2BBFB3' : 'rgba(255,255,255,0.65)',
              cursor: 'pointer', fontSize: '13px', fontWeight: modulo === m.id ? 700 : 400,
              borderLeft: modulo === m.id ? '3px solid #2BBFB3' : '3px solid transparent',
              textAlign: 'left', fontFamily: 'sans-serif',
            }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{m.icon}</span>
              {sidebarOpen && m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: '18px', width: '100%', textAlign: 'center',
          }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #EAECF0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
            {MENU.find(m => m.id === modulo)?.icon} {MENU.find(m => m.id === modulo)?.label}
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="/" target="_blank" style={{ color: '#2BBFB3', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>← Ver sitio</a>
            <button onClick={() => setAuthed(false)} style={{ ...btnGhost, padding: '6px 14px', fontSize: '12px' }}>Salir</button>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>

          {/* ── DASHBOARD ── */}
          {modulo === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total ventas', valor: `$${totalVentas.toFixed(0)}`, color: '#2BBFB3' },
                  { label: 'Ganancia neta', valor: `$${ganancia.toFixed(0)}`, color: '#22C55E' },
                  { label: 'Pedidos totales', valor: pedidos.length, color: '#5B68C0' },
                  { label: 'Pendientes', valor: pedidosPendientes, color: '#F5C518' },
                  { label: 'Clientes', valor: clientes.length, color: '#E08A2A' },
                  { label: 'Armazones', valor: armazones.length, color: '#1A1A2E' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #EAECF0' }}>
                    <div style={{ fontSize: '11px', color: '#7A8494', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: m.color }}>{m.valor}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #EAECF0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #EAECF0', fontWeight: 700 }}>Pedidos recientes</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                      {['#', 'Cliente', 'Armazón', 'Total', 'Estado', 'Fecha'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#7A8494', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.slice(0, 5).map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid #F0F0F0' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#7A8494' }}>#{p.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.clientes?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.armazones?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700 }}>${p.precio_venta || 0}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: estadoColor[p.estado] + '22', color: estadoColor[p.estado], padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                            {p.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7A8494' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#7A8494' }}>Sin pedidos aún</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PEDIDOS ── */}
          {modulo === 'pedidos' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Todos los pedidos ({pedidos.length})</h3>
                <button onClick={() => setShowNewPedido(true)} style={btnPrimary}>+ Nuevo pedido</button>
              </div>

              {/* Modal nuevo pedido */}
              {showNewPedido && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>Nuevo pedido</h3>
                      <button onClick={() => setShowNewPedido(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
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

                    <div style={{ background: '#F0FBF8', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '0.75rem', color: '#2BBFB3' }}>📋 Receta óptica</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {[
                          { key: 'sph_od', label: 'SPH OD' }, { key: 'cyl_od', label: 'CYL OD' },
                          { key: 'axis_od', label: 'EJE OD' }, { key: 'sph_os', label: 'SPH OS' },
                          { key: 'cyl_os', label: 'CYL OS' }, { key: 'axis_os', label: 'EJE OS' },
                          { key: 'add_val', label: 'ADD' }, { key: 'dp', label: 'DP' },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={{...labelStyle, fontSize: '10px'}}>{f.label}</label>
                            <input type="number" step="0.25" value={newPedido.receta[f.key]}
                              onChange={e => setNewPedido({...newPedido, receta: {...newPedido.receta, [f.key]: e.target.value}})}
                              style={{...inputStyle, padding: '6px 8px'}} placeholder="0.00"/>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: '#FFF8E8', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '0.75rem', color: '#E08A2A' }}>💰 Costos</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        {[
                          { key: 'costo_armazon', label: 'Costo armazón' },
                          { key: 'costo_laboratorio', label: 'Costo laboratorio' },
                          { key: 'otros_costos', label: 'Otros costos' },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={{...labelStyle, fontSize: '10px'}}>{f.label}</label>
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
                      }} style={btnPrimary}>Guardar pedido</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista pedidos */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #EAECF0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                      {['#', 'Cliente', 'Armazón', 'Total', 'Estado', 'Tracking', 'Fecha', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#7A8494', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid #F0F0F0' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#7A8494' }}>#{p.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.clientes?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.armazones?.nombre || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#2BBFB3' }}>${p.precio_venta || 0}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <select value={p.estado} onChange={async e => {
                            await supabase.from('pedidos').update({ estado: e.target.value }).eq('id', p.id);
                            cargarTodo();
                          }} style={{ padding: '4px 8px', borderRadius: '6px', border: `1.5px solid ${estadoColor[p.estado]}`, background: estadoColor[p.estado] + '22', color: estadoColor[p.estado], fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7A8494' }}>{p.tracking || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7A8494' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => setEditPedido(p)} style={{ background: '#E0F7F4', color: '#2BBFB3', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Ver</button>
                        </td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#7A8494' }}>Sin pedidos aún</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modal ver pedido */}
              {editPedido && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>Pedido #{editPedido.id}</h3>
                      <button onClick={() => setEditPedido(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div><span style={labelStyle}>Cliente</span><p style={{ margin: 0 }}>{editPedido.clientes?.nombre || '—'}</p></div>
                      <div><span style={labelStyle}>Armazón</span><p style={{ margin: 0 }}>{editPedido.armazones?.nombre || '—'}</p></div>
                      <div><span style={labelStyle}>Total</span><p style={{ margin: 0, fontWeight: 700, color: '#2BBFB3' }}>${editPedido.precio_venta}</p></div>
                      <div><span style={labelStyle}>Estado</span>
                        <select value={editPedido.estado} onChange={async e => {
                          await supabase.from('pedidos').update({ estado: e.target.value }).eq('id', editPedido.id);
                          setEditPedido({...editPedido, estado: e.target.value});
                          cargarTodo();
                        }} style={inputStyle}>
                          {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
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
                    {editPedido.recetas?.[0] && (
                      <div style={{ background: '#F0FBF8', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px', color: '#2BBFB3' }}>Receta óptica</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '12px' }}>
                          {['sph_od','cyl_od','axis_od','sph_os','cyl_os','axis_os','add_val','dp'].map(k => (
                            <div key={k}><span style={{ color: '#7A8494', fontSize: '10px', textTransform: 'uppercase' }}>{k}</span><br/><strong>{editPedido.recetas[0][k] || '—'}</strong></div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button onClick={async () => {
                        await supabase.from('pedidos').update({ tracking: editPedido.tracking, paqueteria: editPedido.paqueteria, estado: editPedido.estado }).eq('id', editPedido.id);
                        setEditPedido(null);
                        cargarTodo();
                      }} style={btnPrimary}>Guardar cambios</button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Clientes ({clientes.length})</h3>
                <button onClick={() => setShowNewCliente(true)} style={btnPrimary}>+ Nuevo cliente</button>
              </div>

              {showNewCliente && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>Nuevo cliente</h3>
                      <button onClick={() => setShowNewCliente(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
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
                        <textarea value={newCliente.notas} onChange={e => setNewCliente({...newCliente, notas: e.target.value})} style={{...inputStyle, resize: 'none'}} rows={2} placeholder="Notas adicionales..."/>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button onClick={() => setShowNewCliente(false)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        await supabase.from('clientes').insert(newCliente);
                        setNewCliente({ nombre: '', email: '', telefono: '', direccion: '', notas: '' });
                        setShowNewCliente(false);
                        cargarTodo();
                      }} style={btnPrimary}>Guardar</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #EAECF0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                      {['Nombre', 'Email', 'Teléfono', 'Pedidos', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#7A8494', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map(c => (
                      <tr key={c.id} style={{ borderTop: '1px solid #F0F0F0' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700 }}>{c.nombre}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#7A8494' }}>{c.email || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#7A8494' }}>{c.telefono || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>{pedidos.filter(p => p.cliente_id === c.id).length}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => setEditCliente(c)} style={{ background: '#E0F7F4', color: '#2BBFB3', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Ver</button>
                        </td>
                      </tr>
                    ))}
                    {clientes.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#7A8494' }}>Sin clientes aún</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {editCliente && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>{editCliente.nombre}</h3>
                      <button onClick={() => setEditCliente(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
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
                      <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>Pedidos del cliente</div>
                      {pedidos.filter(p => p.cliente_id === editCliente.id).map(p => (
                        <div key={p.id} style={{ background: '#F8F9FA', borderRadius: '8px', padding: '10px 14px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span>#{p.id} — {p.armazones?.nombre}</span>
                          <span style={{ fontWeight: 700, color: '#2BBFB3' }}>${p.precio_venta}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={async () => {
                        await supabase.from('clientes').update(editCliente).eq('id', editCliente.id);
                        setEditCliente(null);
                        cargarTodo();
                      }} style={btnPrimary}>Guardar</button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Catálogo ({armazones.length})</h3>
                <button onClick={() => setShowNewArmazon(true)} style={btnPrimary}>+ Nuevo armazón</button>
              </div>

              {showNewArmazon && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>Nuevo armazón</h3>
                      <button onClick={() => setShowNewArmazon(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { key: 'nombre', label: 'Nombre', placeholder: 'Clásico Negro' },
                        { key: 'marca', label: 'Marca', placeholder: 'Verly' },
                        { key: 'forma', label: 'Forma', placeholder: 'cuadrada' },
                        { key: 'genero', label: 'Género', placeholder: 'hombre / mujer / unisex' },
                        { key: 'precio', label: 'Precio ($)', placeholder: '43' },
                        { key: 'stock', label: 'Stock', placeholder: '10' },
                        { key: 'badge', label: 'Badge', placeholder: 'Nuevo / Popular' },
                        { key: 'color', label: 'Color hex', placeholder: '#1A1A2E' },
                        { key: 'imagen_url', label: 'URL imagen', placeholder: 'https://...' },
                      ].map(f => (
                        <div key={f.key} style={{ gridColumn: f.key === 'imagen_url' ? '1 / -1' : undefined }}>
                          <label style={labelStyle}>{f.label}</label>
                          <input value={(newArmazon as any)[f.key]} onChange={e => setNewArmazon({...newArmazon, [f.key]: e.target.value})} style={inputStyle} placeholder={f.placeholder}/>
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" checked={newArmazon.activo} onChange={e => setNewArmazon({...newArmazon, activo: e.target.checked})} id="activo"/>
                        <label htmlFor="activo" style={{ fontSize: '13px', fontWeight: 600 }}>Activo</label>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button onClick={() => setShowNewArmazon(false)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        await supabase.from('armazones').insert({ ...newArmazon, precio: parseInt(newArmazon.precio), stock: parseInt(newArmazon.stock) });
                        setShowNewArmazon(false);
                        cargarTodo();
                      }} style={btnPrimary}>Guardar</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {armazones.map(a => (
                  <div key={a.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #EAECF0', overflow: 'hidden' }}>
                    <div style={{ height: '140px', background: a.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {a.imagen_url
                        ? <img src={a.imagen_url} alt={a.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <svg width="100" height="56" viewBox="0 0 160 90" fill="none">
                            <rect x="4" y="12" width="64" height="66" rx="14" fill="white" stroke={a.color} strokeWidth="4"/>
                            <rect x="92" y="12" width="64" height="66" rx="14" fill="white" stroke={a.color} strokeWidth="4"/>
                            <path d="M68 38 C72 32, 88 32, 92 38" stroke={a.color} strokeWidth="3" fill="none"/>
                          </svg>
                      }
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: a.activo ? '#22C55E' : '#E05A5A', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>
                        {a.activo ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>{a.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#7A8494', marginBottom: '10px', textTransform: 'capitalize' }}>{a.forma} · {a.genero}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '18px', color: '#2BBFB3' }}>${a.precio}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setEditArmazon({...a})} style={{ background: '#E0F7F4', color: '#2BBFB3', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Editar</button>
                          <button onClick={async () => {
                            if (confirm('¿Eliminar armazón?')) {
                              await supabase.from('armazones').delete().eq('id', a.id);
                              cargarTodo();
                            }
                          }} style={{ background: '#FFF0F0', color: '#E05A5A', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {editArmazon && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>Editando: {editArmazon.nombre}</h3>
                      <button onClick={() => setEditArmazon(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { key: 'nombre', label: 'Nombre' }, { key: 'marca', label: 'Marca' },
                        { key: 'forma', label: 'Forma' }, { key: 'genero', label: 'Género' },
                        { key: 'precio', label: 'Precio ($)' }, { key: 'stock', label: 'Stock' },
                        { key: 'badge', label: 'Badge' }, { key: 'color', label: 'Color hex' },
                        { key: 'imagen_url', label: 'URL imagen' },
                      ].map(f => (
                        <div key={f.key} style={{ gridColumn: f.key === 'imagen_url' ? '1 / -1' : undefined }}>
                          <label style={labelStyle}>{f.label}</label>
                          <input value={editArmazon[f.key] || ''} onChange={e => setEditArmazon({...editArmazon, [f.key]: e.target.value})} style={inputStyle}/>
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" checked={editArmazon.activo} onChange={e => setEditArmazon({...editArmazon, activo: e.target.checked})} id="editActivo"/>
                        <label htmlFor="editActivo" style={{ fontSize: '13px', fontWeight: 600 }}>Activo</label>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button onClick={() => setEditArmazon(null)} style={btnGhost}>Cancelar</button>
                      <button onClick={async () => {
                        await supabase.from('armazones').update({ ...editArmazon, precio: parseInt(editArmazon.precio), stock: parseInt(editArmazon.stock) }).eq('id', editArmazon.id);
                        setEditArmazon(null);
                        cargarTodo();
                      }} style={btnPrimary}>Guardar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── FINANZAS ── */}
          {modulo === 'finanzas' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Ingresos totales', valor: `$${totalVentas.toFixed(2)}`, color: '#2BBFB3' },
                  { label: 'Costos totales', valor: `$${totalCostos.toFixed(2)}`, color: '#E05A5A' },
                  { label: 'Ganancia bruta', valor: `$${ganancia.toFixed(2)}`, color: '#22C55E' },
                  { label: 'Margen', valor: totalVentas > 0 ? `${((ganancia/totalVentas)*100).toFixed(1)}%` : '0%', color: '#5B68C0' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #EAECF0' }}>
                    <div style={{ fontSize: '11px', color: '#7A8494', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: m.color }}>{m.valor}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #EAECF0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #EAECF0', fontWeight: 700 }}>Desglose por pedido</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                      {['Pedido', 'Venta', 'C. Armazón', 'C. Lab', 'Otros', 'Ganancia', 'Margen'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#7A8494', textTransform: 'uppercase' }}>{h}</th>
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
                        <tr key={p.id} style={{ borderTop: '1px solid #F0F0F0' }}>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 700, color: '#7A8494' }}>#{p.id}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 700 }}>${p.precio_venta}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#E05A5A' }}>${f.costo_armazon || 0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#E05A5A' }}>${f.costo_laboratorio || 0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#E05A5A' }}>${f.otros_costos || 0}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 700, color: gan >= 0 ? '#22C55E' : '#E05A5A' }}>${gan.toFixed(2)}</td>
                          <td style={{ padding: '10px 16px', fontSize: '13px', color: '#5B68C0', fontWeight: 700 }}>{margen}%</td>
                        </tr>
                      );
                    })}
                    {pedidos.filter(p => p.finanzas?.[0]).length === 0 && (
                      <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#7A8494' }}>Sin datos financieros aún</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PROMOCIONES ── */}
          {modulo === 'promociones' && (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #EAECF0', padding: '2rem', textAlign: 'center', color: '#7A8494' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🏷️</div>
              <h3 style={{ color: '#1A1A2E' }}>Promociones</h3>
              <p>Módulo disponible en la siguiente fase de desarrollo.</p>
            </div>
          )}

          {/* ── MARKETING ── */}
          {modulo === 'marketing' && (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #EAECF0', padding: '2rem', textAlign: 'center', color: '#7A8494' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📣</div>
              <h3 style={{ color: '#1A1A2E' }}>Marketing & UTM</h3>
              <p>Módulo disponible en la siguiente fase de desarrollo.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}