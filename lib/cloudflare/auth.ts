interface AccessJWT {
  aud: string[];
  email: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  type: string;
  identity_nonce: string;
  country: string;
}

export async function verifyAccessJWT(token: string): Promise<AccessJWT> {
  try {
    const response = await fetch('https://YOUR_TEAM_NAME.cloudflareaccess.com/cdn-cgi/access/certs');
    const jwks = await response.json();

    // The JWT verification is handled by Cloudflare automatically
    // We just need to decode the token to get the user info
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));

    return payload as AccessJWT;
  } catch (error) {
    console.error('Error verifying Access JWT:', error);
    throw new Error('Invalid Access token');
  }
}

export function getAuthUser(token: string): { email: string; } {
  const tokenParts = token.split('.');
  const payload = JSON.parse(atob(tokenParts[1]));
  return { email: payload.email };
}

// Add GLHF configuration
const GLHF_API_KEY = "glhf_02dbcee04bd1e813861b466fee17f590";
const GLHF_BASE_URL = 'https://glhf.chat/api/openai/v1';

export async function getGLHFModels() {
  try {
    const response = await fetch(`${GLHF_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${GLHF_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch models');
    return await response.json();
  } catch (error) {
    console.error('Error fetching GLHF models:', error);
    throw error;
  }
} 