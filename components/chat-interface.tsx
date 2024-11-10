"use client";

import { useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const ChatContent = dynamic(() => import('./chat-content'), { ssr: false });

// Using a constant since this is a public site key
const HCAPTCHA_SITE_KEY = '2d4a6528-6638-4142-811c-f4ceff6af7e0';

export default function ChatInterface() {
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState<string>('');
  const captchaRef = useRef<HCaptcha>(null);

  const onLoad = useCallback(() => {
    // This callback is called once the hCaptcha script has loaded
    setError(null);
  }, []);

  const onVerify = useCallback(async (token: string) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await fetch('/api/verify-hcaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data: { success: boolean; error?: string } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Verification failed');
      }

      setHcaptchaToken(token);
      setIsVerified(true);
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const onError = useCallback((err: any) => {
    console.error('hCaptcha Error:', err);
    setError('Verification failed. Please try again.');
    setIsVerified(false);
  }, []);

  const onExpire = useCallback(() => {
    setError('Verification expired. Please verify again.');
    setIsVerified(false);
    setHcaptchaToken('');
  }, []);

  return (
    <div className="flex flex-col h-[70vh] rounded-lg border bg-card">
      <div className="flex items-center justify-center p-4 border-b">
        <HCaptcha
          ref={captchaRef}
          sitekey={HCAPTCHA_SITE_KEY}
          onLoad={onLoad}
          onVerify={onVerify}
          onError={onError}
          onExpire={onExpire}
          theme="light"
          size="normal"
          languageOverride="en"
          reCaptchaCompat={false}
        />
      </div>
      
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {isVerifying && (
        <div className="p-4 text-muted-foreground text-sm text-center">
          <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
          Verifying...
        </div>
      )}

      {isVerified ? (
        <ChatContent hcaptchaToken={hcaptchaToken} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            Please complete the verification above to start chatting
          </div>
        </div>
      )}
    </div>
  );
}