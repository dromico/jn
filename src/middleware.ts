import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    // Create Supabase client with request/response context
    const supabase = createMiddlewareClient({ req, res });
    
    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    // Protected routes check
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');
    const isAuthRoute = ['/login', '/register'].includes(req.nextUrl.pathname);

    if (!session && isProtectedRoute) {
      // Redirect to login if accessing protected route while not authenticated
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (session && isAuthRoute) {
      // Redirect to dashboard if accessing auth routes while authenticated
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    return res;
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res;
  }
}

export const config = {
  // Apply middleware to dashboard routes and auth routes
  matcher: ['/dashboard/:path*', '/login', '/register'],
};