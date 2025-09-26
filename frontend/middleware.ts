import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('admin_token')?.value;
  
  // Admin routes that require authentication (exclude login page)
  const isProtectedRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  
  // Login page
  const isLoginPage = pathname === '/admin/login';
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // If accessing login page with valid token, redirect to admin
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};
