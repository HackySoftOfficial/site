import { db } from '@/lib/db';
import { nanoid } from 'nanoid';

const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY!;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const orderId = nanoid();
    const now = Date.now();

    // Create a charge in Coinbase Commerce
    const charge = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name: `Order ${orderId}`,
        description: `Payment for ${data.productId}`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: data.amount.toString(),
          currency: 'USD'
        },
        metadata: {
          orderId,
          productId: data.productId,
          contactMethod: data.contactMethod,
          contactValue: data.contactValue
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancel?orderId=${orderId}`
      })
    });

    if (!charge.ok) {
      throw new Error('Failed to create Coinbase charge');
    }

    const chargeData = await charge.json();

    // Store order in KV
    await db.orders.create({
      id: orderId,
      productId: data.productId,
      amount: data.amount,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      coinbaseChargeId: chargeData.data.id,
      contactMethod: data.contactMethod,
      contactValue: data.contactValue
    });

    return new Response(JSON.stringify({ 
      orderId,
      checkoutUrl: chargeData.data.hosted_url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating crypto order:', error);
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 