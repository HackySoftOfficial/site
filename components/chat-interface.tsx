"use client";

import { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const ChatContent = dynamic(() => import('./chat-content'), { ssr: false });

interface CaptchaResponse {
  success: boolean;
}

export default function ChatInterface() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);

  const handleCaptchaVerify = (token: string) => {
    setHcaptchaToken(token);
    verifyCaptcha(token);
  };

  const verifyCaptcha = useCallback(async (token: string) => {
    if (!token) {
      setError('Please complete the captcha verification.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/verify-hcaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data: CaptchaResponse = await response.json();
      if (!data.success) {
        throw new Error('Captcha verification failed');
      }
      setIsVerified(true);
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!isVerified) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <HCaptcha
            sitekey="2d4a6528-6638-4142-811c-f4ceff6af7e0"
            onVerify={handleCaptchaVerify}
            theme="light"
          />
          
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-muted-foreground text-sm text-center">
              <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              Verifying...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto bg-background">
      <div className="flex-1 overflow-hidden rounded-lg border shadow-sm">
        <ChatContent />
      </div>
    </div>
  );
}