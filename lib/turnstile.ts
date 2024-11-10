interface TurnstileVerifyResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
  action: string;
  cdata: string;
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: "0x4AAAAAAAzsUvYHCn18A-lriGZhMNtCVFg",
        response: token,
      }),
    }
  );

  const data = await response.json() as TurnstileVerifyResponse;
  return data.success;
} 