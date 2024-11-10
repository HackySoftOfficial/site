import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';

export const runtime = 'edge';

interface CreateOrderRequest {
  productId: string;
  amount: number;
  contactMethod: string;
  contactValue: string;
}

interface CoinbaseChargeResponse {
  data: {
    id: string;
    hosted_url: string;
    code: string;
    name: string;
    description: string;
    pricing: {
      local: { amount: string; currency: string };
    };
    [key: string]: any;
  };
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as CreateOrderRequest;
    const orderId = nanoid();
    const now = Date.now();

    // Validate required fields
    if (!data.productId || !data.amount || !data.contactMethod || !data.contactValue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a charge using Coinbase Commerce API
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY!,
        'X-CC-Version': '2018-03-22',
        'Accept': 'application/json'
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
          contactValue: data.contactValue,
          itemName: data.productId, // For Discord notification
          itemDescription: `Payment for ${data.productId}` // For Discord notification
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancel?orderId=${orderId}`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Coinbase API error:', errorText);
      throw new Error(`Coinbase API error: ${response.statusText}`);
    }

    const chargeData = await response.json() as CoinbaseChargeResponse;

    // Store order details in database
    await db.orders.create({
      id: orderId,
      productId: data.productId,
      amount: data.amount,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      coinbaseChargeId: chargeData.data.id,
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

    return NextResponse.json({ 
      orderId,
      checkoutUrl: chargeData.data.hosted_url
    });
  } catch (error) {
    console.error('Error creating crypto order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 