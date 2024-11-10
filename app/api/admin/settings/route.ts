import { NextResponse } from 'next/server';

interface SiteSettings {
  siteName: string;
  supportEmail: string;
  enableNotifications: boolean;
  apiKey: string;
}

export async function POST(req: Request) {
  try {
    const data = await req.json() as SiteSettings;
    
    // Save settings to Cloudflare KV
    await ORDERS_KV.put('site-settings', JSON.stringify(data));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get settings from Cloudflare KV
    const settings = await ORDERS_KV.get('site-settings', { type: 'json' });
    
    if (!settings) {
      const defaultSettings: SiteSettings = {
        siteName: '',
        supportEmail: '',
        enableNotifications: false,
        apiKey: '',
      };
      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(settings as SiteSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
} 