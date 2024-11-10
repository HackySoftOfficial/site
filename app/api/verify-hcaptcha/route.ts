import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface VerifyRequest {
  token: string;
}

// Using a constant since this is a public site key
const HCAPTCHA_SECRET_KEY = 'ES_98291cd9d012455f8f8137f067285a7e';

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<VerifyRequest>;
    
    if (!body.token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: HCAPTCHA_SECRET_KEY,
        response: body.token,
      }),
    });

    const data: { success: boolean } = await response.json();
    
    if (!data.success) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
} 