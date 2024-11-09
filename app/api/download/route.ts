import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { repoName, sessionId } = await req.json();

    // Verify order exists and is paid
    const order = await ORDERS_KV.get(sessionId, { type: 'json' });
    if (!order || order.status !== 'completed') {
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