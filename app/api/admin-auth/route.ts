// app/api/admin-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting: max 10 intentos por IP cada 15 minutos
const loginAttempts = new Map<string, { count: number; resetAt: number; blockedUntil?: number }>();

function checkLoginRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const r = loginAttempts.get(ip);
  if (r?.blockedUntil && now < r.blockedUntil) {
    return { allowed: false, waitSeconds: Math.ceil((r.blockedUntil - now) / 1000) };
  }
  if (!r || now > r.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true };
  }
  r.count++;
  if (r.count > 10) {
    r.blockedUntil = now + 30 * 60 * 1000; // bloquear 30 min
    return { allowed: false, waitSeconds: 1800 };
  }
  return { allowed: true };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const { allowed, waitSeconds } = checkLoginRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: `Demasiados intentos. Intenta en ${Math.ceil((waitSeconds || 1800) / 60)} minutos.` },
      { status: 429 }
    );
  }

  const { email, password } = await req.json();

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    // Pequeño delay para dificultar timing attacks
    await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  }

  // Login exitoso — resetear contador
  loginAttempts.delete(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set('gon_admin', process.env.ADMIN_TOKEN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 horas
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('gon_admin');
  return response;
}