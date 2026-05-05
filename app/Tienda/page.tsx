export default function Tienda() {
  const armazones = [
    { id: 1, nombre: 'Gafas Cloud', desc: 'Ligeras y duraderas', badge: 'Novedad', bg: '#FFE4E8', colores: ['#1A1A2E', '#8B4513', '#1565C0'] },
    { id: 2, nombre: 'Visión Perfecta', desc: 'Elegancia atemporal', badge: 'Bestseller', bg: '#FFF3CC', colores: ['#C2185B', '#1A1A2E'] },
    { id: 3, nombre: 'Sol Elegante', desc: 'Protección UV400', badge: 'Oferta', bg: '#E8F4FF', colores: ['#C0C0C0', '#D4A017'] },
    { id: 4, nombre: 'Marco Retro', desc: 'Estilo vintage', badge: 'Bestseller', bg: '#FFE4E8', colores: ['#6D4C41', '#1A1A2E'] },
    { id: 5, nombre: 'Urban Wave', desc: 'Para la ciudad', badge: 'Oferta', bg: '#FFF3CC', colores: ['#546E7A', '#1A1A2E'] },
    { id: 6, nombre: 'Clásica Plus', desc: 'Comodidad total', badge: 'Novedad', bg: '#E8F4FF', colores: ['#C2185B', '#2E7D32'] },
  ];

  const badgeColor: Record<string, string> = {
    'Novedad': '#2BBFB3',
    'Bestseller': '#FF9F1C',
    'Oferta': '#E53E3E',
  };

  return (
    <main style={{fontFamily: 'sans-serif', background: '#FAF7F2', minHeight: '100vh'}}>

      {/* NAV */}
      <nav style={{background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '66px', position: 'sticky', top: 0, zIndex: 100}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <a href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'}}>
            <span style={{fontSize: '20px', fontWeight: 800, color: '#2BBFB3'}}>Verly</span>
            <span style={{fontSize: '10px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px'}}>OPTICAL</span>
          </a>
        </div>
        <div style={{display: 'flex', gap: '2rem'}}>
          <a href="/" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500}}>Inicio</a>
          <a href="/Tienda" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 700, borderBottom: '2px solid #2BBFB3'}}>Tienda</a>
          <a href="#" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500}}>FAQ</a>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{padding: '3rem 2rem 1rem', textAlign: 'center'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 800, color: '#2BBFB3', marginBottom: '0.5rem'}}>Nuestra Tienda</h1>
        <p style={{color: '#4A5568', fontSize: '15px'}}>Elige tu armazón favorito y arma tus lentes a tu medida</p>
      </div>

      {/* GRID */}
      <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem'}}>
        {armazones.map((a) => (
          <div key={a.id} style={{background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'transform 0.2s'}}>
            
            {/* IMAGEN */}
            <div style={{height: '200px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <span style={{fontSize: '4rem'}}>👓</span>
              <div style={{position: 'absolute', top: '10px', left: '10px', background: badgeColor[a.badge], color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px'}}>
                {a.badge}
              </div>
            </div>

            {/* INFO */}
            <div style={{padding: '1.1rem'}}>
              <div style={{fontSize: '16px', fontWeight: 700, marginBottom: '4px'}}>{a.nombre}</div>
              <div style={{fontSize: '12px', color: '#8A97A8', marginBottom: '10px'}}>{a.desc}</div>
              
              {/* COLORES */}
              <div style={{display: 'flex', gap: '6px', marginBottom: '14px'}}>
                {a.colores.map((c, i) => (
                  <div key={i} style={{width: '16px', height: '16px', borderRadius: '50%', background: c, border: '2px solid white', boxShadow: '0 0 0 1.5px #E2E8F0'}}></div>
                ))}
              </div>

              <button style={{width: '100%', background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '20px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer'}}>
                Elegir este armazón →
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}