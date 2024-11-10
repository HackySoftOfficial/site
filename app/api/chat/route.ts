import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';

export const runtime = 'edge';

interface RequestBody {
  messages: Array<{ role: string; content: string }>;
  turnstileToken: string;
}

interface CloudflareAIResponse {
  result: {
    response: string;
  };
  success: boolean;
  errors: string[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;
    
    // Verify Turnstile token on every request
    const isValid = await verifyTurnstileToken(body.turnstileToken);
    if (!isValid) {
      return NextResponse.json({
        result: { response: '' },
        success: false,
        errors: ['Verification expired. Please verify again.'],
        messages: []
      }, { status: 401 });
    }
    
    const response = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/acb7d77b6f9433aa6109e40b25170148/ai/run/@cf/meta/llama-3.1-70b-instruct',
      {
        headers: {
          'Authorization': `Bearer Tq6RZpw1Wy0aGEojY88uQlopo3jJirDJomKob4vC`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ messages: body.messages }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get AI response: ${response.statusText}`);
    }

    const data = await response.json() as CloudflareAIResponse;
    
    if (!data.result?.response) {
      throw new Error('Invalid response format from AI service');
    }
    
    return NextResponse.json({
      result: {
        response: data.result.response
      },
      success: true,
      errors: [],
      messages: []
    });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({
      result: { response: '' },
      success: false,
      errors: [(error as Error).message],
      messages: []
    }, { status: 500 });
  }
} 