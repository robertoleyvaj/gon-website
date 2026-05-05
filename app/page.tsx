export default function Home() {
  return (
    <main style={{fontFamily: 'sans-serif', margin: 0, padding: 0, background: '#FAF7F2'}}>

      {/* NAVEGACIÓN */}
      <nav style={{background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '66px', position: 'sticky', top: 0, zIndex: 100}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <span style={{fontSize: '20px', fontWeight: 800, color: '#2BBFB3'}}>Verly</span>
          <span style={{fontSize: '10px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px'}}>OPTICAL</span>
        </div>
        <div style={{display: 'flex', gap: '2rem'}}>
          <a href="#" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500}}>Inicio</a>
          <a href="#" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500}}>Tienda</a>
          <a href="#" style={{color: '#2BBFB3', textDecoration: 'none', fontWeight: 500}}>FAQ</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background: 'linear-gradient(135deg, #FDF6EE 0%, #E0F7F4 100%)', padding: '4rem 2rem', textAlign: 'center'}}>
        <div style={{background: '#F5C518', color: '#1A1A2E', display: 'inline-block', padding: '8px 20px', borderRadius: '30px', fontWeight: 700, marginBottom: '1.5rem'}}>
          🔥 ¡Arma tus lentes desde solo $5 USD!
        </div>
        <h1 style={{fontSize: '3rem', fontWeight: 800, color: '#2BBFB3', marginBottom: '1rem', lineHeight: 1.1}}>
          Tu Visión Perfecta,<br/>Nuestro Diseño Único.
        </h1>
        <p style={{fontSize: '16px', color: '#4A5568', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem'}}>
          Lentes ópticos a tu medida, entrega rápida a California. Sin aseguranza.
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <button style={{background: '#2BBFB3', color: 'white', border: 'none', borderRadius: '30px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer'}}>
            Explorar Lentes
          </button>
          <button style={{background: 'transparent', color: '#2BBFB3', border: '2px solid #2BBFB3', borderRadius: '30px', padding: '12px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer'}}>
            Probar Virtualmente
          </button>
        </div>
      </div>

      {/* BARRA DE CONFIANZA */}
      <div style={{background: 'white', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap'}}>
        <span style={{color: '#4A5568', fontSize: '13px', fontWeight: 500}}>✓ Desde $5 USD</span>
        <span style={{color: '#4A5568', fontSize: '13px', fontWeight: 500}}>✓ Entrega 3–5 días</span>
        <span style={{color: '#4A5568', fontSize: '13px', fontWeight: 500}}>✓ Sin aseguranza</span>
        <span style={{color: '#4A5568', fontSize: '13px', fontWeight: 500}}>✓ 30 días de devolución</span>
      </div>

      {/* COLECCIONES */}
      <div style={{padding: '4rem 2rem', maxWidth: '1180px', margin: '0 auto'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 800, color: '#2BBFB3', textAlign: 'center', marginBottom: '2.5rem'}}>
          Nuestras Colecciones
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem'}}>
          <div style={{background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer'}}>
            <div style={{height: '180px', background: 'linear-gradient(135deg, #FFD6DC, #FFB8C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>👓</div>
            <div style={{padding: '1.25rem'}}>
              <div style={{fontSize: '17px', fontWeight: 700, marginBottom: '4px'}}>Lentes para Ella</div>
              <div style={{fontSize: '13px', color: '#4A5568', marginBottom: '12px'}}>Elegancia y estilo en cada diseño.</div>
              <div style={{color: '#2BBFB3', fontSize: '13px', fontWeight: 700}}>Explorar Lentes ›</div>
            </div>
          </div>
          <div style={{background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer'}}>
            <div style={{height: '180px', background: 'linear-gradient(135deg, #B3F0EB, #7DE8E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>🕶️</div>
            <div style={{padding: '1.25rem'}}>
              <div style={{fontSize: '17px', fontWeight: 700, marginBottom: '4px'}}>Estilo Masculino</div>
              <div style={{fontSize: '13px', color: '#4A5568', marginBottom: '12px'}}>Sofisticación y carácter.</div>
              <div style={{color: '#2BBFB3', fontSize: '13px', fontWeight: 700}}>Explorar Lentes ›</div>
            </div>
          </div>
          <div style={{background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer'}}>
            <div style={{height: '180px', background: 'linear-gradient(135deg, #E8F4FF, #B3D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>✨</div>
            <div style={{padding: '1.25rem'}}>
              <div style={{fontSize: '17px', fontWeight: 700, marginBottom: '4px'}}>Últimos Diseños</div>
              <div style={{fontSize: '13px', color: '#4A5568', marginBottom: '12px'}}>Descubre lo más reciente.</div>
              <div style={{color: '#2BBFB3', fontSize: '13px', fontWeight: 700}}>Explorar Lentes ›</div>
            </div>
          </div>
          <div style={{background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer'}}>
            <div style={{height: '180px', background: 'linear-gradient(135deg, #FFE8C8, #FFDDB3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>⭐</div>
            <div style={{padding: '1.25rem'}}>
              <div style={{fontSize: '17px', fontWeight: 700, marginBottom: '4px'}}>Los Favoritos</div>
              <div style={{fontSize: '13px', color: '#4A5568', marginBottom: '12px'}}>Nuestras opciones más populares.</div>
              <div style={{color: '#2BBFB3', fontSize: '13px', fontWeight: 700}}>Explorar Lentes ›</div>
            </div>
          </div>
        </div>
      </div>

      {/* BANNER PROMO */}
      <div style={{background: '#1a9990', color: 'white', textAlign: 'center', padding: '3rem 2rem'}}>
        <h2 style={{fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem'}}>Tu primer par. Nuestro mejor precio.</h2>
        <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem'}}>Usa el código <strong>VERLY10</strong> y obtén 10% de descuento en tu primer pedido.</p>
        <button style={{background: 'white', color: '#1a9990', border: 'none', borderRadius: '30px', padding: '13px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer'}}>
          Ir a la tienda
        </button>
      </div>

      {/* FOOTER */}
      <footer style={{background: '#1A2535', color: 'rgba(255,255,255,0.7)', padding: '3rem 2rem'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto 2rem'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'}}>
              <span style={{fontSize: '18px', fontWeight: 800, color: '#2BBFB3'}}>Verly</span>
              <span style={{fontSize: '9px', fontWeight: 700, color: '#F5C518', letterSpacing: '2px'}}>OPTICAL</span>
            </div>
            <p style={{fontSize: '13px', lineHeight: 1.7}}>Lentes accesibles para todos. Sirviendo a la comunidad latina en California.</p>
          </div>
          <div>
            <h4 style={{color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '12px'}}>Tienda</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Todos los armazones</a>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Hombre</a>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Mujer</a>
            </div>
          </div>
          <div>
            <h4 style={{color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '12px'}}>Ayuda</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Cómo leer tu receta</a>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Envíos</a>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Devoluciones</a>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Contáctanos</a>
            </div>
          </div>
          <div>
            <h4 style={{color: 'white', fontSize: '13px', fontWeight: 700, marginBottom: '12px'}}>Nosotros</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Nuestra historia</a>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Misión</a>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>Instagram</a>
              <a href="#" style={{color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px'}}>TikTok</a>
            </div>
          </div>
        </div>
        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '12px', maxWidth: '1100px', margin: '0 auto'}}>
          © 2024 Verly Optical LLC — verlyoptical.com
        </div>
      </footer>

    </main>
  );
}