import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
}

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

interface DiscordWebhookEmbed {
  title: string;
  color: number;
  fields: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  timestamp: string;
}

interface DiscordWebhookPayload {
  embeds: DiscordWebhookEmbed[];
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1305531529472118855/EegPmCEEoOUsFIURZeNs4rLg4ZhCCq1Wa6NAlljhDJwN_GaXBB86VsLzFWynoZE70zsj';
const TURNSTILE_SECRET_KEY = '0x4AAAAAAAzsP9F6rERuhc7Y-mKEYJRsB3k';

export async function POST(req: Request) {
  try {
    const data = await req.json() as ContactFormData;

    // Validate required fields
    if (!data.name || !data.email || !data.message || !data.turnstileToken) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', data.turnstileToken);

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const verifyData = await verifyResponse.json() as TurnstileResponse;
    if (!verifyData.success) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // Prepare Discord webhook payload
    const webhookPayload: DiscordWebhookPayload = {
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
    };

    // Send to Discord webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      throw new Error(`Failed to send to Discord webhook: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
