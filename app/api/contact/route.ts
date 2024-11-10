import { NextResponse } from 'next/server';
export const runtime = 'edge';
import fetch from 'node-fetch'; // Ensure fetch is available in the edge runtime

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  turnstileToken: string; // Added turnstile token to the data interface
}

const TURNSTILE_SECRET_KEY = "0x4AAAAAAAzsP9F6rERuhc7Y-mKEYJRsB3k";

interface TurnstileVerifyResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
  action?: string;
  cdata?: string;
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const data = await response.json() as TurnstileVerifyResponse;
  return data.success;
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1305247175684522015/-8-zySdCt2olpy2Ca4CKKc28_AjOFCYUK0yblX1CZZhDIVypnI-eymmaf3PRlKqXaNrY';
const TURNSTILE_SECRET_KEY = '0x4AAAAAAAzsUvYHCn18A-lriGZhMNtCVFg';

interface TurnstileResponse {
  success: boolean;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  
  // Ensure the response is valid and contains the expected structure
  const data = await response.json() as TurnstileResponse;
  if (!data || typeof data.success !== 'boolean') {
    throw new Error('Invalid Turnstile response');
  }
  
  return data.success; // Return true if verification is successful
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as ContactFormData;

    // Verify Turnstile token
    const isVerified = await verifyTurnstile(data.turnstileToken);
    if (!isVerified) {
      return NextResponse.json(
        { error: 'Turnstile verification failed' },
        { status: 400 }
      );
    }

    // Send to Discord webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [{
          title: '📬 New Contact Form Submission',
          color: 0x00ff00,
          fields: [
            {
              name: 'Name',
              value: data.name,
              inline: true
            },
            {
              name: 'Email',
              value: data.email,
              inline: true
            },
            {
              name: 'Message',
              value: data.message,
              inline: false
            }
          ],
          timestamp: new Date().toISOString()
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send to Discord webhook');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 