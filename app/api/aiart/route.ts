import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Define request and response types
interface RequestBody {
  prompt: string;
  numSteps?: number;
}

interface CloudflareResponse {
  result: {
    image: string;
  };
  success: boolean;
  errors: string[];
}

interface ErrorResponse {
  error: string;
}

// Securely store API keys in the API route
const CLOUDFLARE_API_TOKEN = "vlvbCX0owz79UAGJUvoRcOg1vnCQkVWNffKnBOOm";

if (!CLOUDFLARE_API_TOKEN) {
  throw new Error('CLOUDFLARE_API_TOKEN environment variable is required');
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;
    const { prompt, numSteps = 4 } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' } satisfies ErrorResponse, { status: 400 });
    }

    const response = await fetch('https://api.cloudflare.com/client/v4/ai/run/@cf/black-forest-labs/flux-1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        num_steps: Math.min(8, Math.max(1, numSteps))
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Cloudflare API error:', error);
      throw new Error('Failed to generate image');
    }

    const data = await response.json() as CloudflareResponse;
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI Art Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}