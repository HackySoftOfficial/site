export const runtime = 'edge';

import OpenAI from 'openai';

// Initialize GLHF client
const glhfClient = new OpenAI({
  apiKey: process.env.GLHF_API_KEY || 'glhf_02dbcee04bd1e813861b466fee17f590',
  baseURL: 'https://glhf.chat/api/openai/v1',
});

// Initialize GitHub client
const githubClient = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN || '',
  baseURL: 'https://models.inference.ai.azure.com'
});

// Helper function to create a streaming response for GLHF
function createGLHFStreamResponse(response: AsyncIterable<any>) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        controller.enqueue(new TextEncoder().encode('\n\nError: Failed to process response stream.'));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    }
  });
}

// Helper function to create a streaming response for GitHub
function createGitHubStreamResponse(response: AsyncIterable<any>) {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          // Handle raw text response
          if (typeof chunk === 'string') {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          // Handle JSON response if any
          else if (chunk.choices?.[0]?.text) {
            controller.enqueue(new TextEncoder().encode(chunk.choices[0].text));
          }
          else if (chunk.choices?.[0]?.delta?.content) {
            controller.enqueue(new TextEncoder().encode(chunk.choices[0].delta.content));
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        controller.enqueue(new TextEncoder().encode('\n\nError: Failed to process response stream.'));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    }
  });
}

// Validate model availability
async function validateModel(client: OpenAI, model: string): Promise<boolean> {
  try {
    const models = await client.models.list();
    return models.data.some(m => m.id === model);
  } catch (error) {
    console.error('Model validation error:', error);
    return false;
  }
}

// Default models as fallbacks
const DEFAULT_GITHUB_MODEL = 'gpt-4o-mini';
const DEFAULT_GLHF_MODEL = 'hf:mistralai/Mixtral-8x7B-Instruct-v0.1';

export async function POST(req: Request) {
  try {
    const { messages, model, provider } = await req.json() as { messages: any, model: string, provider: string };

    if (provider === 'github') {
      // Validate GitHub model
      const isValidModel = await validateModel(githubClient, model);
      const selectedModel = isValidModel ? model : DEFAULT_GITHUB_MODEL;

      if (!isValidModel) {
        console.warn(`Invalid GitHub model: ${model}, falling back to ${DEFAULT_GITHUB_MODEL}`);
      }

      const response = await githubClient.chat.completions.create({
        model: selectedModel,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1.0
      });

      return createGitHubStreamResponse(response);

    } else {
      // Validate GLHF model
      const isValidModel = await validateModel(glhfClient, model);
      const selectedModel = isValidModel ? model : DEFAULT_GLHF_MODEL;

      if (!isValidModel) {
        console.warn(`Invalid GLHF model: ${model}, falling back to ${DEFAULT_GLHF_MODEL}`);
      }

      const response = await glhfClient.chat.completions.create({
        model: selectedModel,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return createGLHFStreamResponse(response);
    }
    
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Return a more detailed error response
    const errorMessage = error.error?.message || error.message || 'Unknown error occurred';
    const errorCode = error.error?.code || error.code || 'unknown_error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response', 
        details: errorMessage,
        code: errorCode
      }), 
      { 
        status: error.status || 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 