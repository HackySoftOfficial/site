import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

const WEBHOOK_SECRET = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-cc-webhook-signature');

    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    // Verify webhook signature using Web Crypto API
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(rawBody)
    );

    const computedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (computedSignature !== signature) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event.type === 'charge:confirmed') {
      const metadata = event.event.data.metadata;
      const { orderId, contactMethod, contactValue, itemName, itemDescription } = metadata;
      const amount = event.event.data.pricing.local.amount;
      const currency = event.event.data.pricing.local.currency;

      // Update order status in database
      await db.orders.update(orderId, {
        status: 'completed',
        updatedAt: Date.now(),
      });

      // Send notification to Discord with enhanced information
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [{
            title: '🎉 New Order Completed!',
            color: 0x00ff00,
            fields: [
              {
                name: 'Order ID',
                value: orderId,
                inline: true
              },
              {
                name: 'Product',
                value: itemName,
                inline: true
              },
              {
                name: 'Amount',
                value: `${amount} ${currency}`,
                inline: true
              },
              {
                name: 'Description',
                value: itemDescription || 'No description provided',
                inline: false
              },
              {
                name: 'Contact Information',
                value: `Method: ${contactMethod}\nValue: ${contactValue}`,
                inline: false
              }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 