const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: "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" });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              { 
                role: "user", 
                content: "You are a helpful assistant. Keep responses professional and family-friendly." 
              },
              ...messages.filter(msg => msg.role !== 'system')
            ],
            model: "mixtral-8x7b-32768",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: true,
            stop: null
          });

          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = {
                id: Date.now().toString(),
                role: 'assistant',
                content: content
              };
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
            }
          }

          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error: any) {
          console.error("Streaming error:", error);
          
          // Check if it's a content filtering error
          if (error.message?.includes('content policy') || 
              error.message?.includes('safety')) {
            const filterMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: "I apologize, but I cannot provide a response to that query. Please try rephrasing your question."
            };
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(filterMessage)}\n\n`));
          } else {
            const errorMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: "I apologize, but there was an error processing your request. Please try again."
            };
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(errorMessage)}\n\n`));
          }
          
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    
    let errorMessage = error.message || 'Unknown error occurred';
    let userMessage = 'Failed to generate response';
    
    // Handle Groq-specific errors
    if (error.message?.includes('content policy') || 
        error.message?.includes('safety')) {
      userMessage = 'This content cannot be processed. Please rephrase your message.';
      
      return new Response(
        JSON.stringify({ 
          error: userMessage,
          details: errorMessage,
          type: 'content_filtered'
        }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: userMessage,
        details: errorMessage,
        type: 'general_error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
