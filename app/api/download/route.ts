import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { R2Bucket } from '@cloudflare/workers-types';

interface DownloadRequest {
  repoName: string;
  sessionId: string;
}

declare global {
  const STORAGE: R2Bucket;
}

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { repoName, sessionId } = await req.json() as DownloadRequest;

    // Verify order exists and is paid
    const order = await db.orders.findFirst(sessionId);
    if (!order || order.status !== 'completed') {
      return NextResponse.json({ error: 'Payment required' }, { status: 402 });
    }

    // Get file from R2 using the bound bucket
    const file = await STORAGE.get(`${repoName}.zip`);

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', `attachment; filename=${repoName}.zip`);

    // Convert the R2 object body to an array buffer and create a new Response
    const arrayBuffer = await file.arrayBuffer();
    return new Response(arrayBuffer, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}