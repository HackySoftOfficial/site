import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export const dynamic = 'force-dynamic';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function POST(req: Request) {
  try {
    const { repoName, sessionId } = await req.json();

    // Verify payment session first
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment required' }, { status: 402 });
    }

    // Download from GitHub
    const response = await octokit.repos.downloadZipballArchive({
      owner: 'HackySoftOfficial',
      repo: repoName,
      ref: 'main'
    });

    // Forward the zip file to the client
    return new NextResponse(response.data as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${repoName}.zip`
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}