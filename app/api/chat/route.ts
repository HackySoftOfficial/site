import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { headers } from 'next/headers';

const openai = new OpenAI({
  apiKey: "glhf_02dbcee04bd1e813861b466fee17f590",
  baseURL: "https://glhf.chat/api/openai/v1",
});

const RATE_LIMIT = {
  MAX_REQUESTS: 480,
  WINDOW_HOURS: 8
};

async function isRateLimited(identifier: string): Promise<boolean> {
  try {
    const now = Date.now();
    const windowStart = now - (RATE_LIMIT.WINDOW_HOURS * 60 * 60 * 1000);
    
    // Get the current count and timestamp from KV
    const rateData = await ORDERS_KV.get(`ratelimit:${identifier}`, { type: 'json' });
    
    if (!rateData) {
      // First request
      await ORDERS_KV.put(`ratelimit:${identifier}`, JSON.stringify({
        count: 1,
        timestamp: now
      }));
      return false;
    }

    if (rateData.timestamp < windowStart) {
      // Reset counter if window has passed
      await ORDERS_KV.put(`ratelimit:${identifier}`, JSON.stringify({
        count: 1,
        timestamp: now
      }));
      return false;
    }

    if (rateData.count >= RATE_LIMIT.MAX_REQUESTS) {
      return true;
    }

    // Increment counter
    await ORDERS_KV.put(`ratelimit:${identifier}`, JSON.stringify({
      count: rateData.count + 1,
      timestamp: rateData.timestamp
    }));

    return false;
  } catch (error) {
    console.error('Rate limit error:', error);
    return false; // Fail open if rate limiting fails
  }
}

export async function POST(req: Request) {
  try {
    // Use IP address as identifier for rate limiting
    const headersList = headers();
    const ip = headersList.get('cf-connecting-ip') || 'unknown';
    
    // Check rate limit
    const limited = await isRateLimited(ip);
    if (limited) {
      return new Response('Rate limit exceeded. Please try again later.', { 
        status: 429,
        headers: {
          'Retry-After': String(RATE_LIMIT.WINDOW_HOURS * 3600)
        }
      });
    }

    const { messages, model } = await req.json();

    const response = await openai.chat.completions.create({
      model: model || 'meta-llama/Llama-3.1-405b-Instruct',
      messages,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Error processing chat request', { status: 500 });
  }
} 