import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessJWT } from './lib/cloudflare/auth';

export async function middleware(request: NextRequest) {
  // Skip authentication for public routes
  if (request.nextUrl.pathname.startsWith('/api/chat') || 
      request.nextUrl.pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  // Only apply to /admin and /api routes
  if (!request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.headers.get('cf-access-jwt-assertion');
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No Access Token' },
      { status: 401 }
    );
  }

  try {
    await verifyAccessJWT(token);
    const response = NextResponse.next();
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid Token' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};