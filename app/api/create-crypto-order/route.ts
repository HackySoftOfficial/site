import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import { Client, resources } from 'coinbase-commerce-node';

const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY!;
Client.init(COINBASE_API_KEY);
const { Charge } = resources;

interface CreateOrderRequest {
  productId: string;
  amount: number;
  contactMethod: string;
  contactValue: string;
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as CreateOrderRequest;
    const orderId = nanoid();
    const now = Date.now();

    // Create a charge using the Coinbase Commerce SDK
    const chargeData = await Charge.create({
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
    });

    // Store order in KV
    await db.orders.create({
      id: orderId,
      productId: data.productId,
      amount: data.amount,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      coinbaseChargeId: chargeData.id,
      contactMethod: data.contactMethod,
      contactValue: data.contactValue,
      customer: {
        name: data.contactValue,
        email: data.contactValue
      },
      product: {
        name: data.productId,
        price: data.amount
      }
    });

    return new Response(JSON.stringify({ 
      orderId,
      checkoutUrl: chargeData.hosted_url
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