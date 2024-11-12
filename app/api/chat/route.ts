import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface RequestBody {
  messages: Array<{ role: string; content: string }>;
  token: string;
  model: string;
  type: 'text' | 'code' | 'image';
  provider: 'cloudflare' | 'huggingface';
}

// Private credentials stored securely in API route
const CLOUDFLARE_ACCOUNT_ID = 'acb7d77b6f9433aa6109e40b25170148';
const CLOUDFLARE_API_TOKEN = 'l-LzejTZzisRvTnkDRobaEaFw5Q1-Imqsbl_2w3E';

export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;
    
    // Accept both 'verified' and 'development' tokens
    if (body.token !== 'verified' && body.token !== 'development') {
      return NextResponse.json({
        result: { response: '' },
        success: false,
        errors: ['Verification failed'],
        messages: []
      }, { status: 403 });
    }

    let response;
    if (body.provider === 'cloudflare') {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${body.model}`;
      
      const requestBody = {
        messages: [
          {
            role: "system",
            content: "You are an expert software developer with deep knowledge of programming languages, software architecture, and best practices. Your role is to help with code review, debugging, architecture decisions, and implementation guidance. Please provide clear, detailed explanations with code examples when relevant. Focus on writing clean, maintainable, and efficient code while following industry standards and security best practices. If you need clarification about requirements or context, ask questions before providing solutions."
          },
          ...body.messages.slice(1).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ]
      };

      console.log('Sending request to Cloudflare:', {
        endpoint,
        model: body.model,
        type: body.type,
        requestBody
      });

      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Cloudflare API error: ${errorText}`);
        throw new Error(`Failed to get AI response: ${response.statusText}`);
      }

      const data = await response.json();
      
      return NextResponse.json({
        result: {
          response: data.result.response || ''
        },
        success: true,
        errors: [],
        messages: []
      });
    }

    throw new Error('Invalid provider specified');
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