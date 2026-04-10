import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const protectedRoutes = ['/dashboard', '/projects', '/templates', '/settings', '/onboarding'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for session via cookie
  const authToken =
    req.cookies.get('sb-nipwrfsiiajddhisqkex-auth-token')?.value ||
    req.cookies.get('supabase-auth-token')?.value;

  // Try to get the session from Authorization header or cookie
  const accessToken = req.cookies.get('sb-nipwrfsiiajddhisqkex-auth-token.0')?.value;

  if (!authToken && !accessToken) {
    // Check all cookies for supabase tokens
    const allCookies = req.cookies.getAll();
    const hasSupabaseCookie = allCookies.some(
      (c) => c.name.includes('sb-') && c.name.includes('auth-token')
    );

    if (!hasSupabaseCookie) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|auth).*)'],
};
