import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (data.type === 'software') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: data.productId,
              },
              unit_amount: Math.round(data.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/services`,
      });

      return NextResponse.json({ sessionId: session.id });
    }

    if (data.type === 'custom') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${data.serviceType.toUpperCase()} Development Service`,
                description: `${data.projectSize} project with ${data.teamSize} developer${
                  data.teamSize > 1 ? 's' : ''
                } for ${data.duration} month${data.duration > 1 ? 's' : ''}`,
              },
              unit_amount: Math.round(data.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/services`,
      });

      return NextResponse.json({ sessionId: session.id });
    }

    return NextResponse.json(
      { error: 'Invalid checkout type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}