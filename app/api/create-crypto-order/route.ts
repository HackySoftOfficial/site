import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';

export const runtime = 'edge';

interface CreateOrderRequest {
  productId: string;
  amount: number;
  contactMethod: string;
  contactValue: string;
  selectedItem: {
    name: string;
    description: string;
    price: number;
  };
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as CreateOrderRequest;
    const orderId = nanoid();
    const now = Date.now();

    // Create a charge using Coinbase Commerce API
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY!,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name: data.selectedItem.name,
        description: data.selectedItem.description,
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
          itemName: data.selectedItem.name,
          itemDescription: data.selectedItem.description
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancel?orderId=${orderId}`
      })
    });

    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.statusText}`);
    }

    const chargeData = await response.json();

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
        name: data.selectedItem.name,
        price: data.amount
      },
      metadata: {
        itemDescription: data.selectedItem.description
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