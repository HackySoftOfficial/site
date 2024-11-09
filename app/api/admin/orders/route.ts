import { NextResponse } from 'next/server';
import { createDb } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const dateRange = searchParams.get('dateRange');
    const search = searchParams.get('search');

    const db = createDb(process.env.DB as unknown as D1Database);
    let query = db.select().from(orders).orderBy(desc(orders.createdAt));

    if (status && status !== 'all') {
      query = query.where(sql`${orders.status} = ${status}`);
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

      query = query.where(sql`${orders.createdAt} >= ${startDate}`);
    }

    let results = await query;

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        order =>
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ orders: results });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}