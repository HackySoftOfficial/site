export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';

interface SoftwareCheckoutData {
  type: 'software';
  productId: string;
  price: number;
  contactMethod: string;
  contactValue: string;
}

interface CustomCheckoutData {
  type: 'custom';
  serviceType: string;
  projectSize: string;
  teamSize: number;
  duration: number;
  price: number;
  contactMethod: string;
  contactValue: string;
}

type CheckoutData = SoftwareCheckoutData | CustomCheckoutData;

interface CoinbaseChargeResponse {
  data: {
    id: string;
    hosted_url: string;
    [key: string]: any;
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as CheckoutData;
    const orderId = nanoid();
    const now = Date.now();

    // Prepare charge data based on checkout type
    const chargeData = {
      name: data.type === 'software' ? data.productId : `${data.serviceType.toUpperCase()} Development Service`,
      description: data.type === 'software' 
        ? `Payment for ${data.productId}`
        : `${data.projectSize} project with ${data.teamSize} developer${data.teamSize > 1 ? 's' : ''} for ${data.duration} month${data.duration > 1 ? 's' : ''}`,
      pricing_type: 'fixed_price',
      local_price: {
        amount: data.price.toString(),
        currency: 'USD'
      },
      metadata: {
        orderId,
        type: data.type,
        ...(data.type === 'software' 
          ? { productId: data.productId }
          : {
              serviceType: data.serviceType,
              projectSize: data.projectSize,
              teamSize: data.teamSize.toString(),
              duration: data.duration.toString(),
            }
        ),
        contactMethod: data.contactMethod,
        contactValue: data.contactValue
      },
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancel?orderId=${orderId}`
    };

    // Create charge using Coinbase Commerce API directly
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY!,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify(chargeData)
    });

    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.statusText}`);
    }

    const responseData = await response.json() as CoinbaseChargeResponse;
    const chargeResponse = responseData.data;

    // Store order in database
    await db.orders.create({
      id: orderId,
      productId: data.type === 'software' ? data.productId : `custom_${data.serviceType}`,
      amount: data.price,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      coinbaseChargeId: chargeResponse.id,
      contactMethod: data.contactMethod,
      contactValue: data.contactValue,
      customer: {
        name: data.contactValue,
        email: data.contactValue
      },
      product: {
        name: data.type === 'software' ? data.productId : `Custom ${data.serviceType} Service`,
        price: data.price
      },
      ...(data.type === 'custom' && {
        metadata: {
          serviceType: data.serviceType,
          projectSize: data.projectSize,
          teamSize: data.teamSize.toString(),
          duration: data.duration.toString()
        }
      })
    });

    return NextResponse.json({ 
      orderId,
      checkoutUrl: chargeResponse.hosted_url 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}