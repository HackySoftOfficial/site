import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessJWT } from '@/lib/cloudflare/auth';

export async function middleware(request: NextRequest) {
  // Skip authentication for public routes and static files
  if (request.nextUrl.pathname.startsWith('/api/chat') || 
      request.nextUrl.pathname.startsWith('/api/webhooks') ||
      request.nextUrl.pathname.startsWith('/api/create-crypto-order') ||
      request.nextUrl.pathname.startsWith('/api/create-checkout-session') ||
      request.nextUrl.pathname.startsWith('/api/check-payment-status')) {
    return NextResponse.next();
  }

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.headers.get('cf-access-jwt-assertion');
    
    if (!token) {
      // Redirect to Cloudflare Access login
      const teamName = process.env.NEXT_PUBLIC_CLOUDFLARE_TEAM_NAME;
      const audTag = process.env.NEXT_PUBLIC_CLOUDFLARE_AUD_TAG;
      const redirectUrl = `https://${teamName}.cloudflareaccess.com/cdn-cgi/access/login/${audTag}?redirect=${request.url}`;
      return NextResponse.redirect(redirectUrl);
    }

    try {
      await verifyAccessJWT(token);
      return NextResponse.next();
    } catch (error) {
      // Redirect back to Cloudflare Access login on invalid token
      const teamName = process.env.NEXT_PUBLIC_CLOUDFLARE_TEAM_NAME;
      const audTag = process.env.NEXT_PUBLIC_CLOUDFLARE_AUD_TAG;
      const redirectUrl = `https://${teamName}.cloudflareaccess.com/cdn-cgi/access/login/${audTag}?redirect=${request.url}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const token = request.headers.get('cf-access-jwt-assertion');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No Access Token' },
        { status: 401 }
      );
    }

    try {
      await verifyAccessJWT(token);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid Token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*'
  ]
};