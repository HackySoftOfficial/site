export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { Order } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const dateRange = searchParams.get('dateRange');
    const search = searchParams.get('search');

    // Get all orders from KV
    const { keys } = await ORDERS_KV.list();
    const orderPromises = keys.map(async key => {
      const data = await ORDERS_KV.get(key.name);
      if (!data) return null;
      try {
        return JSON.parse(data) as Order;
      } catch {
        return null;
      }
    });
    
    // Filter out null values and type as Order[]
    let orders = (await Promise.all(orderPromises))
      .filter((order): order is Order => 
        order !== null && 
        typeof order === 'object' &&
        'id' in order
      );

    // Apply filters
    if (status && status !== 'all') {
      orders = orders.filter(order => order.status === status);
    }

    if (dateRange && dateRange !== 'all') {
      const now = Date.now();
      let startDate = now;

      switch (dateRange) {
        case 'today':
          startDate = now - 24 * 60 * 60 * 1000;
          break;
        case 'week':
          startDate = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          startDate = now - 30 * 24 * 60 * 60 * 1000;
          break;
      }

      orders = orders.filter(order => order.createdAt >= startDate);
    }

    // Sort by createdAt desc
    orders.sort((a, b) => b.createdAt - a.createdAt);

    if (search) {
      const searchLower = search.toLowerCase();
      orders = orders.filter(order => {
        return order.id.toLowerCase().includes(searchLower) ||
               (order.contactValue?.toLowerCase() || '').includes(searchLower) ||
               (order.contactMethod?.toLowerCase() || '').includes(searchLower);
      });
    }

    // Add limit parameter handling
    const limit = searchParams.get('limit');
    if (limit) {
      orders = orders.slice(0, parseInt(limit));
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}