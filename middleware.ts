import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessJWT } from './lib/cloudflare/auth';

export async function middleware(request: NextRequest) {
  // Only apply to /api routes except webhooks
  if (!request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/api/webhooks')) {
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