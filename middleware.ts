// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtToken } from './lib/auth'; // Using your auth helper

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`[MIDDLEWARE] Path: ${pathname}`);

  const protectedPaths = ["/my-bookings", "/payment", "/trains", "/api/bookings", "/api/my-bookings", "/api/userprofile"];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  console.log(`[MIDDLEWARE] Path is protected. Checking token...`);
  const token = request.cookies.get('session-token')?.value;

  if (!token) {
    console.log(`[MIDDLEWARE] No token. Redirecting to login.`);
    const signInUrl = new URL('/login', request.url); // Your login page
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  try {
    await verifyJwtToken(token);
    console.log(`[MIDDLEWARE] Token is valid. Allowing request to proceed.`);
    return NextResponse.next();
  } catch (error) {
    console.log(`[MIDDLEWARE] Token invalid/expired. Redirecting to login.`);
    const signInUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(signInUrl);
    response.cookies.delete('session-token'); // Clear the bad cookie
    return response;
  }
}

export const config = {
  matcher: ['/((?!api/login|_next/static|_next/image|favicon.ico).*)'],
};