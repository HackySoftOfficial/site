import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatMessage } from '@/lib/types';

export const runtime = 'edge';

interface RequestBody {
  messages: ChatMessage[];
  token: string;
  model: string;
  type: 'text' | 'code' | 'image';
  provider: 'github' | 'cloudflare';
}

// Private credentials stored securely in API route
const CLOUDFLARE_ACCOUNT_ID = 'acb7d77b6f9433aa6109e40b25170148';
const CLOUDFLARE_API_TOKEN = 'l-LzejTZzisRvTnkDRobaEaFw5Q1-Imqsbl_2w3E';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;
    
    // Skip verification in development environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && body.token !== 'verified') {
      return NextResponse.json({
        result: { response: '' },
        success: false,
        errors: ['Verification failed'],
        messages: []
      }, { status: 403 });
    }

    let response;
    
    if (body.provider === 'github') {
      const client = new OpenAI({ 
        baseURL: 'https://models.inference.ai.azure.com',
        apiKey: GITHUB_TOKEN 
      });

      const messages: ChatCompletionMessageParam[] = body.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const completion = await client.chat.completions.create({
        messages,
        model: body.model,
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 1000,
      });

      return NextResponse.json({
        result: {
          response: completion.choices[0].message.content || ''
        },
        success: true,
        errors: [],
        messages: []
      });
    } 
    
    else if (body.provider === 'cloudflare') {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${body.model}`;
      
      const requestBody = {
        messages: body.messages
      };

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