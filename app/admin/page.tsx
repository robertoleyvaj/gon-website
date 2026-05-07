'use client';
import { useState } from 'react';

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [section, setSection] = useState('dashboard');
  const [frames, setFrames] = useState([
    { id: 1, nombre: 'Gafas Cloud', forma: 'Redondo', genero: 'Unisex', stock: 12, badge: 'Novedad', activo: true },
    { id: 2, nombre: 'Visión Perfecta', forma: 'Cuadrado', genero: 'Mujer', stock: 8, badge: 'Bestseller', activo: true },
    { id: 3, nombre: 'Sol Elegante', forma: 'Aviador', genero: 'Hombre', stock: 3, badge: 'Oferta', activo: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editFrame, setEditFrame] = useState<any>(null);
  const [form, setForm] = useState({ nombre: '', forma: 'Redondo', genero: 'Unisex', stock: '', badge: '', activo: true });

  const login = () => {
    if (user === 'admin@verlyoptical.com' && pass === 'verly2024') {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const openNew = () => {
    setEditFrame(null);
    setForm({ nombre: '', forma: 'Redondo', genero: 'Unisex', stock: '', badge: '', activo: true });
    setShowModal(true);
  };

  const openEdit = (f: any) => {
    setEditFrame(f);
    setForm({ nombre: f.nombre, forma: f.forma, genero: f.genero, stock: String(f.stock), badge: f.badge, activo: f.activo });
    setShowModal(true);
  };

  const saveFrame = () => {
    if (!form.nombre) return;
    if (editFrame) {
      setFrames(frames.map(f => f.id === editFrame.id ? { ...f, ...form, stock: Number(form.stock) } : f));
    } else {
      setFrames([...frames, { id: Date.now(), ...form, stock: Number(form.stock) }]);
    }
    setShowModal(false);
  };

  const deleteFrame = (id: number) => {
    setFrames(frames.filter(f => f.id !== id));
  };

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1A2535, #243044)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#2BBFB3' }}>Verly <span style={{ color: '#F5C518', fontSize: '11px', letterSpacing: '2px' }}>OPTICAL</span></div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '8px' }}>Panel de Admin</div>
          <div style={{ fontSize: '13px', color: '#8A97A8', marginTop: '4px' }}>Ingresa tus credenciales</div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '5px' }}>USUARIO</label>
          <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin@verlyoptical.com" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '5px' }}>CONTRASEÑA</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="••••••••" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', fontFamily: 'sans-serif', outline: 'none' }} />
        </div>
        {error && <div style={{ color: '#E53E3E', fontSize: '13px', marginBottom: '1rem' }}>{error}</div>}
        <button onClick={login} style={{ width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>Entrar</button>
        <div style={{ fontSize: '11px', color: '#8A97A8', textAlign: 'center', marginTop: '1rem' }}>admin@verlyoptical.com / verly2024</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <div style={{ width: '220px', background: '#1A2535', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#2BBFB3' }}>Verly <span style={{ color: '#F5C518', fontSize: '9px', letterSpacing: '2px' }}>OPTICAL</span></div>
        </div>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'frames', label: '👓 Armazones' },
          { id: 'orders', label: '📦 Pedidos' },
          { id: 'customers', label: '👤 Clientes' },
          { id: 'prices', label: '💰 Precios' },
        ].map(s => (
          <div key={s.id} onClick={() => setSection(s.id)} style={{ padding: '.7rem 1.25rem', cursor: 'pointer', color: section === s.id ? 'white' : 'rgba(255,255,255,.6)', background: section === s.id ? '#243044' : 'none', borderLeft: section === s.id ? '3px solid #2BBFB3' : '3px solid transparent', fontSize: '13px', fontWeight: 500 }}>
            {s.label}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <button onClick={() => setLoggedIn(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: '12px', fontFamily: 'sans-serif' }}>Cerrar sesión</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, background: '#F4F6F9' }}>
        {/* TOPBAR */}
        <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '.875rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '17px', fontWeight: 700 }}>
            {section === 'dashboard' && 'Dashboard'}
            {section === 'frames' && 'Armazones'}
            {section === 'orders' && 'Pedidos'}
            {section === 'customers' && 'Clientes'}
            {section === 'prices' && 'Precios'}
          </div>
          {section === 'frames' && (
            <button onClick={openNew} style={{ background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>+ Nuevo Armazón</button>
          )}
        </div>

        <div style={{ padding: '1.5rem 1.75rem' }}>

          {/* DASHBOARD */}
          {section === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Ventas (mes)', val: '$1,840', change: '↑ 12%', up: true },
                  { label: 'Pedidos', val: '24', change: '↑ 8 nuevos', up: true },
                  { label: 'Armazones', val: String(frames.length), change: 'activos', up: true },
                  { label: 'Clientes', val: '18', change: '↑ 5 nuevos', up: true },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.1rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A97A8', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.5rem' }}>{s.label}</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '.25rem', color: s.label === 'Ventas (mes)' ? '#2BBFB3' : '#1A1A2E' }}>{s.val}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: s.up ? '#38A169' : '#E53E3E' }}>{s.change}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '1rem' }}>Pedidos recientes</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['#', 'Cliente', 'Armazón', 'Total', 'Estado'].map(h => <th key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#8A97A8', textTransform: 'uppercase', padding: '.5rem .75rem', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[
                      { id: '#1024', cliente: 'María G.', armazon: 'Gafas Cloud', total: '$167', estado: 'Pagado', color: '#E6F4EA', tc: '#1e7e34' },
                      { id: '#1023', cliente: 'Carlos R.', armazon: 'Visión Perfecta', total: '$192', estado: 'Enviado', color: '#E0F7F4', tc: '#1a9990' },
                      { id: '#1022', cliente: 'Ana L.', armazon: 'Marco Retro', total: '$138', estado: 'Pendiente', color: '#FFF3CC', tc: '#856404' },
                    ].map(o => (
                      <tr key={o.id}>
                        <td style={{ padding: '.6rem .75rem', fontSize: '13px', color: '#2BBFB3', fontWeight: 700, borderBottom: '1px solid #E2E8F0' }}>{o.id}</td>
                        <td style={{ padding: '.6rem .75rem', fontSize: '13px', borderBottom: '1px solid #E2E8F0' }}>{o.cliente}</td>
                        <td style={{ padding: '.6rem .75rem', fontSize: '13px', color: '#4A5568', borderBottom: '1px solid #E2E8F0' }}>{o.armazon}</td>
                        <td style={{ padding: '.6rem .75rem', fontSize: '13px', fontWeight: 700, borderBottom: '1px solid #E2E8F0' }}>{o.total}</td>
                        <td style={{ padding: '.6rem .75rem', borderBottom: '1px solid #E2E8F0' }}><span style={{ background: o.color, color: o.tc, fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '10px' }}>{o.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ARMAZONES */}
          {section === 'frames' && (
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              {frames.map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '.875rem 1.25rem', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ width: '50px', height: '34px', borderRadius: '8px', background: '#E0F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>👓</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{f.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#8A97A8' }}>{f.forma} · {f.genero}</div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: f.stock <= 3 ? '#E53E3E' : '#4A5568' }}>📦 {f.stock} uds</div>
                  {f.badge && <span style={{ background: f.badge === 'Novedad' ? '#2BBFB3' : f.badge === 'Bestseller' ? '#FF9F1C' : '#E53E3E', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '18px' }}>{f.badge}</span>}
                  <button onClick={() => openEdit(f)} style={{ background: '#E0F7F4', color: '#2BBFB3', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>Editar</button>
                  <button onClick={() => deleteFrame(f.id)} style={{ background: '#FFF0F0', color: '#E53E3E', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* PEDIDOS */}
          {section === 'orders' && (
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              {[
                { id: '#1024', cliente: 'María García', ciudad: 'Los Ángeles, CA', producto: 'Gafas Cloud + Monofocal + Blue Light', total: '$167', estado: 'Pagado', color: '#E6F4EA', tc: '#1e7e34' },
                { id: '#1023', cliente: 'Carlos Ruiz', ciudad: 'Fresno, CA', producto: 'Visión Perfecta + Progresivo + AR Premium', total: '$192', estado: 'Enviado', color: '#E0F7F4', tc: '#1a9990' },
                { id: '#1022', cliente: 'Ana López', ciudad: 'San Diego, CA', producto: 'Marco Retro + Bifocal + CR-39', total: '$138', estado: 'Pendiente', color: '#FFF3CC', tc: '#856404' },
              ].map(o => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.875rem 1.25rem', borderBottom: '1px solid #E2E8F0', fontSize: '13px' }}>
                  <div style={{ color: '#2BBFB3', fontWeight: 700, minWidth: '60px' }}>{o.id}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{o.cliente}</div>
                    <div style={{ fontSize: '11px', color: '#8A97A8' }}>{o.ciudad}</div>
                  </div>
                  <div style={{ flex: 2, color: '#4A5568' }}>{o.producto}</div>
                  <div style={{ fontWeight: 700, minWidth: '60px' }}>{o.total}</div>
                  <span style={{ background: o.color, color: o.tc, fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '10px' }}>{o.estado}</span>
                </div>
              ))}
            </div>
          )}

          {/* CLIENTES */}
          {section === 'customers' && (
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Nombre', 'Email', 'Ciudad', 'Pedidos', 'Total'].map(h => <th key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#8A97A8', textTransform: 'uppercase', padding: '.6rem 1.25rem', textAlign: 'left', borderBottom: '1px solid #E2E8F0', background: '#FAFBFC' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { nombre: 'María García', email: 'maria@email.com', ciudad: 'Los Ángeles, CA', pedidos: 3, total: '$421' },
                    { nombre: 'Carlos Ruiz', email: 'carlos@email.com', ciudad: 'Fresno, CA', pedidos: 1, total: '$192' },
                    { nombre: 'Ana López', email: 'ana@email.com', ciudad: 'San Diego, CA', pedidos: 2, total: '$276' },
                  ].map((c, i) => (
                    <tr key={i}>
                      {[c.nombre, c.email, c.ciudad, c.pedidos, c.total].map((v, j) => (
                        <td key={j} style={{ padding: '.7rem 1.25rem', fontSize: '13px', borderBottom: '1px solid #E2E8F0', color: j === 0 ? '#1A1A2E' : '#4A5568', fontWeight: j === 0 ? 600 : 400 }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PRECIOS */}
          {section === 'prices' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { title: 'Armazón (fijo)', fields: [{ label: 'Precio base ($)', val: '43' }] },
                { title: 'Tipos de visión', fields: [{ label: 'Monofocal ($)', val: '5' }, { label: 'Bifocal ($)', val: '13' }, { label: 'Progresivo ($)', val: '48' }] },
                { title: 'Materiales', fields: [{ label: 'CR-39 (incluido)', val: '0' }, { label: 'PolyPlus ($)', val: '29' }, { label: 'HD Vision ($)', val: '39' }, { label: 'Hi-Index ($)', val: '59' }, { label: 'Súper Hi-Index ($)', val: '89' }] },
                { title: 'Filtros', fields: [{ label: 'AR Normal ($)', val: '9' }, { label: 'Blue Light ($)', val: '17' }, { label: 'AR Premium ($)', val: '39' }, { label: 'Fotocromático ($)', val: '39' }, { label: 'Antiempañante ($)', val: '15' }, { label: 'Polarizado ($)', val: '89' }] },
              ].map((panel, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '1rem', color: '#2BBFB3' }}>{panel.title}</div>
                  {panel.fields.map((f, j) => (
                    <div key={j} style={{ marginBottom: '.75rem' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>{f.label}</label>
                      <input defaultValue={f.val} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none' }} />
                    </div>
                  ))}
                </div>
              ))}
              <button style={{ gridColumn: '1/-1', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>Guardar cambios</button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '1.5rem' }}>{editFrame ? 'Editar Armazón' : 'Nuevo Armazón'}</div>
            {[
              { label: 'Nombre', key: 'nombre', type: 'text', placeholder: 'Ej: Gafas Cloud' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>{f.label}</label>
                <input value={form[f.key as keyof typeof form] as string} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none' }} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Forma</label>
                <select value={form.forma} onChange={e => setForm({ ...form, forma: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none' }}>
                  {['Redondo', 'Cuadrado', 'Cat-Eye', 'Aviador', 'Ovalado'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Género</label>
                <select value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none' }}>
                  {['Unisex', 'Mujer', 'Hombre'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Badge</label>
                <select value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2E8F0', borderRadius: '9px', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none' }}>
                  <option value="">Sin badge</option>
                  {['Novedad', 'Bestseller', 'Oferta'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif', color: '#4A5568' }}>Cancelar</button>
              <button onClick={saveFrame} style={{ background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}