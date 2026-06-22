// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
    const secret = process.env.ADMIN_TOKEN_SECRET;
    const token = request.cookies.get('gon_admin')?.value;

    // Si la variable no está definida O el token no coincide → login
    if (!secret || token !== secret) {
      const loginUrl = new URL('/admin-login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
