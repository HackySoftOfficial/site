import { db } from '@/lib/db';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-cc-webhook-signature');

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(rawBody);
    const computedSignature = hmac.digest('hex');

    if (computedSignature !== signature) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const { orderId } = event.event.data.metadata;

    if (event.event.type === 'charge:confirmed') {
      await db.orders.update(orderId, {
        status: 'completed',
        transactionHash: event.event.data.payments[0].transaction_id
      });

      // Send notification to Discord webhook
      await fetch('https://discord.com/api/webhooks/1304843187772330056/DO2qCDK7R4JNZaDdQlcTo0cfn6bJBS8AuSoOozjvyqQYwpgMugMrefKhAmFg581W_JFq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Payment Confirmed via Coinbase Commerce!\nOrder ID: ${orderId}`
        })
      });
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing Coinbase webhook:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 