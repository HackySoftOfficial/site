import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MENU_CONTEXT = `
You are a helpful menu assistant for a restaurant. You can help customers with:
- Menu recommendations
- Dietary restrictions
- Ingredient information
- Pricing
- Special dishes
- Daily specials

Today's specials:
- Grilled salmon with asparagus ($24.99)
- Mushroom risotto ($18.99)
- Chocolate lava cake ($8.99)

Our regular menu includes various options for:
- Appetizers ($8-15)
- Main courses ($18-35)
- Desserts ($6-12)
- Beverages ($3-10)
`;

type ChatRequest = {
  message: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json() as ChatRequest;
    const { message } = body;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: MENU_CONTEXT },
        { role: "user", content: message }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false,
      stop: null
    });

    const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 