import { db } from '@/lib/db';
import { Fetcher } from '@cloudflare/workers-types';

export const runtime = 'edge';

const WEBHOOK_SECRET = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!;

declare global {
  const DISCORD_WEBHOOK: Fetcher;
}

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
    const { orderId } = event.event.data.metadata;

    if (event.event.type === 'charge:confirmed') {
      await db.orders.update(orderId, {
        status: 'completed',
        updatedAt: Date.now(),
      });

      // Notify Discord
      await DISCORD_WEBHOOK.fetch('', {
        method: 'POST',
        body: JSON.stringify({
          content: `🎉 New order completed!\nOrder ID: ${orderId}\nAmount: $${event.event.data.pricing.local.amount} ${event.event.data.pricing.local.currency}`,
          username: 'Order Bot',
          avatar_url: 'https://your-domain.com/bot-avatar.png'
        })
      });
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing Coinbase webhook:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 