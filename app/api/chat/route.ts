import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const response = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/acb7d77b6f9433aa6109e40b25170148/ai/run/@cf/meta/llama-3-8b-instruct',
      {
        headers: {
          'Authorization': `Bearer Tq6RZpw1Wy0aGEojY88uQlopo3jJirDJomKob4vC`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    
    // Return in the expected format
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