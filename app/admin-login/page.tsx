// app/admin-login/page.tsx
'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../supabase';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    // 1. Iniciar sesión en Supabase (para que las consultas pasen las RLS)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (authError) {
      setError('Credenciales incorrectas');
      setLoading(false);
      return;
    }

    // 2. Setear la cookie del proxy (para el guard del /admin)
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    setLoading(false);

    if (res.ok) {
      router.push(searchParams.get('from') || '/admin');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '2.5rem', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo-trasparente.png" alt="Verly" style={{ height: '36px', marginBottom: '1rem' }}/>
          <p style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--warm-gray)', margin: 0 }}>Panel de administración</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', background: 'var(--cream)' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${error ? '#fca5a5' : 'var(--border)'}`, fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', background: 'var(--cream)' }}
          />
          {error && <p style={{ fontSize: '12px', color: '#C0392B', margin: 0 }}>{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '13px', fontWeight: 500, cursor: loading ? 'wait' : 'pointer', marginTop: '4px', opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-sans)' }}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return <Suspense fallback={null}><LoginForm /></Suspense>;
}