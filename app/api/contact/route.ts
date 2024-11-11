import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  hcaptchaToken: string;
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1305531529472118855/EegPmCEEoOUsFIURZeNs4rLg4ZhCCq1Wa6NAlljhDJwN_GaXBB86VsLzFWynoZE70zsj';
const HCAPTCHA_SECRET_KEY = 'ES_98291cd9d012455f8f8137f067285a7e';

export async function POST(req: Request) {
  try {
    const data = await req.json() as ContactFormData;

    // Validate required fields
    if (!data.name || !data.email || !data.message || !data.hcaptchaToken) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify hCaptcha token
    const hcaptchaResponse = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: HCAPTCHA_SECRET_KEY,
        response: data.hcaptchaToken,
      }),
    });

    const hcaptchaData: { success: boolean } = await hcaptchaResponse.json();
    if (!hcaptchaData.success) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 403 }
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
          title: '❓ New Support Email Received',
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
