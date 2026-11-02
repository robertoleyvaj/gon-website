// middleware.ts
// El panel /admin viejo de gonmx ya no se usa: todo (armazones, pedidos, precios) se maneja
// desde el sistema de las ópticas. Se apaga para que no quede una puerta de entrada abierta.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/admin-login', '/admin-login/:path*'],
};
