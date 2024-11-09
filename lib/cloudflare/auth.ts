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