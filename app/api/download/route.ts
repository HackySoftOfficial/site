import { NextResponse } from 'next/server';
import { createDb } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { repoName, sessionId } = await req.json();
    const db = createDb(process.env.DB as unknown as D1Database);

    // Verify order exists and is paid
    const order = await db.query.orders.findFirst({
      where: eq(orders.status, 'completed'),
    });
    
    if (!order) {
      return NextResponse.json({ error: 'Payment required' }, { status: 402 });
    }

    // Get file from R2
    const storage = process.env.STORAGE as unknown as R2Bucket;
    const file = await storage.get(`${repoName}.zip`);

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', `attachment; filename=${repoName}.zip`);

    return new NextResponse(file.body, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}