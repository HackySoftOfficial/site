import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const { name, email, message } = await request.json();

    // Check if required fields are present
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare the payload for the Discord webhook
    const payload = {
      content: `**New Message Received**\n**Name**: ${name}\n**Email**: ${email}\n**Message**: ${message}`,
    };

    // Send the payload to the Discord webhook
    const response = await fetch(DISCORD_WEBHOOK_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Check for successful response
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to send message to Discord' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
