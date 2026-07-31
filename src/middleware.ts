import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    let role = '';
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      role = decoded.role || decoded.user?.role || '';
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    if (!role && isDashboardRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const rolePath = role.toLowerCase();

    if (isAuthRoute) {
      return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, request.url));
    }

    if (isDashboardRoute) {
      if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, request.url));
      }
      if (pathname.startsWith('/dashboard/landlord') && role !== 'LANDLORD') {
        return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, request.url));
      }
      if (pathname.startsWith('/dashboard/tenant') && role !== 'TENANT') {
        return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};