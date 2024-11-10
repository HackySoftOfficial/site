import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1305247175684522015/-8-zySdCt2olpy2Ca4CKKc28_AjOFCYUK0yblX1CZZhDIVypnI-eymmaf3PRlKqXaNrY';

// Simple in-memory rate limiting using a Map
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 30000; // 30 seconds in milliseconds

export async function POST(req: Request) {
  try {
    // Get IP address from Cloudflare headers
    const ip = req.headers.get('cf-connecting-ip') || 'unknown';
    const now = Date.now();
    const lastSubmission = rateLimitMap.get(ip);

    // Check if user is rate limited
    if (lastSubmission && (now - lastSubmission) < RATE_LIMIT_WINDOW) {
      const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - lastSubmission)) / 1000);
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          remainingTime 
        },
        { status: 429 }
      );
    }

    const data = await req.json() as ContactFormData;

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

    // Update rate limit timestamp
    rateLimitMap.set(ip, now);

    // Clean up old entries every so often
    if (rateLimitMap.size > 10000) { // Prevent memory leaks
      const thirtyMinutesAgo = now - 1800000;
      for (const [key, timestamp] of rateLimitMap.entries()) {
        if (timestamp < thirtyMinutesAgo) {
          rateLimitMap.delete(key);
        }
      }
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