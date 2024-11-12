import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface VerifyRequest {
  token: string;
}

interface TurnstileResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

const TURNSTILE_SECRET_KEY = "0x4AAAAAAAzsP9F6rERuhc7Y-mKEYJRsB3k";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<VerifyRequest>;
    
    if (!body.token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', body.token);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const outcome = await result.json() as TurnstileResponse;
    
    if (!outcome.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
} 