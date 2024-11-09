import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createDb } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { nanoid } from 'nanoid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = createDb(process.env.DB as unknown as D1Database);

    const orderId = nanoid();
    const now = Date.now();

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
        metadata: {
          orderId,
          productId: data.productId,
          type: 'software',
        },
      });

      await db.insert(orders).values({
        id: orderId,
        customerId: session.customer as string,
        customerName: '', // Will be updated after payment
        customerEmail: '', // Will be updated after payment
        productId: data.productId,
        productName: data.productId,
        productPrice: Math.round(data.price * 100),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
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
        metadata: {
          orderId,
          type: 'custom',
          serviceType: data.serviceType,
          projectSize: data.projectSize,
          teamSize: data.teamSize,
          duration: data.duration,
        },
      });

      await db.insert(orders).values({
        id: orderId,
        customerId: session.customer as string,
        customerName: '', // Will be updated after payment
        customerEmail: '', // Will be updated after payment
        productId: `custom_${data.serviceType}`,
        productName: `${data.serviceType.toUpperCase()} Development Service`,
        productPrice: Math.round(data.price * 100),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
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