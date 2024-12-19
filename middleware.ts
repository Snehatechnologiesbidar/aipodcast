import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/auth'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Protected paths that require authentication
  const protectedPaths = ['/create-podcast'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // Redirect to auth page if not authenticated and trying to access protected route
  if (!authCookie && isProtectedPath) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to create-podcast if authenticated and trying to access auth page
  if (authCookie && isPublicPath) {
    return NextResponse.redirect(new URL('/create-podcast', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};