import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // In production, authentication is handled by Cloudflare Access
    // This endpoint is just for development/testing purposes
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}