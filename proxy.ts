// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('verly_admin')?.value;
    if (token !== process.env.ADMIN_TOKEN_SECRET) {
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