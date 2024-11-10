import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';

export const runtime = 'edge';

interface VerifyTurnstileRequest {
  token: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<VerifyTurnstileRequest>;
    
    if (!body.token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const isValid = await verifyTurnstileToken(body.token);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
} 