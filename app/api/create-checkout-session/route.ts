import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import { Client, resources } from 'coinbase-commerce-node';

const COINBASE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY!;
Client.init(COINBASE_API_KEY);
const { Charge } = resources;

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

export async function POST(req: Request) {
  try {
    const data = await req.json() as CheckoutData;
    const orderId = nanoid();
    const now = Date.now();

    if (data.type === 'software') {
      const chargeData = await Charge.create({
        name: data.productId,
        description: `Payment for ${data.productId}`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: data.price.toString(),
          currency: 'USD'
        },
        metadata: {
          orderId,
          productId: data.productId,
          type: 'software',
          contactMethod: data.contactMethod,
          contactValue: data.contactValue
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancel?orderId=${orderId}`
      });

      await db.orders.create({
        id: orderId,
        productId: data.productId,
        amount: data.price,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        coinbaseChargeId: chargeData.id,
        contactMethod: data.contactMethod,
        contactValue: data.contactValue
      });

      return NextResponse.json({ 
        orderId,
        checkoutUrl: chargeData.hosted_url 
      });
    }

    if (data.type === 'custom') {
      const description = `${data.projectSize} project with ${data.teamSize} developer${
        data.teamSize > 1 ? 's' : ''
      } for ${data.duration} month${data.duration > 1 ? 's' : ''}`;

      const chargeData = await Charge.create({
        name: `${data.serviceType.toUpperCase()} Development Service`,
        description,
        pricing_type: 'fixed_price',
        local_price: {
          amount: data.price.toString(),
          currency: 'USD'
        },
        metadata: {
          orderId,
          type: 'custom',
          serviceType: data.serviceType,
          projectSize: data.projectSize,
          teamSize: data.teamSize.toString(),
          duration: data.duration.toString(),
          contactMethod: data.contactMethod,
          contactValue: data.contactValue
        },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancel?orderId=${orderId}`
      });

      await db.orders.create({
        id: orderId,
        productId: `custom_${data.serviceType}`,
        amount: data.price,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        coinbaseChargeId: chargeData.id,
        contactMethod: data.contactMethod,
        contactValue: data.contactValue,
        metadata: {
          serviceType: data.serviceType,
          projectSize: data.projectSize,
          teamSize: data.teamSize.toString(),
          duration: data.duration.toString()
        }
      });

      return NextResponse.json({ 
        orderId,
        checkoutUrl: chargeData.hosted_url 
      });
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