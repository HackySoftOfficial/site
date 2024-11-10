import { NextResponse } from 'next/server';
import { z } from 'zod';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const messageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming request body
    const body = await request.json();
    const { name, email, message } = messageSchema.parse(body);

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
