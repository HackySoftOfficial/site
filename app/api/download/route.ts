import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface DownloadRequest {
  repoName: string;
  sessionId: string;
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

    // Return download URL or file data based on your new storage solution
    // This is a placeholder - implement based on your actual storage method
    return NextResponse.json({
      downloadUrl: `/downloads/${repoName}.zip`, // Example URL
      expiresIn: 3600 // Optional: URL expiration in seconds
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}