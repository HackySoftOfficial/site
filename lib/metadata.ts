interface Metadata {
  siteName: string | null;
  supportEmail: string | null;
}

const DEFAULT_METADATA: Metadata = {
  siteName: null,
  supportEmail: null
};

export async function getDynamicMetadata(): Promise<Metadata> {
  try {
    const data = await ORDERS_KV.get('site-settings');
    if (!data) return DEFAULT_METADATA;
    
    const settings = JSON.parse(data);
    return {
      siteName: settings.siteName || null,
      supportEmail: settings.supportEmail || null,
    };
  } catch (error) {
    console.error("Error loading metadata:", error);
    return DEFAULT_METADATA;
  }
} 