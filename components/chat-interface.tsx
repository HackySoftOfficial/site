"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Turnstile } from '@/components/turnstile';

const ChatContent = dynamic(() => import('./chat-content'), { 
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-muted-foreground">Loading chat...</p>
    </div>
  )
});

interface VerificationResponse {
  success: boolean;
}

export default function ChatInterface() {
  const [token, setToken] = useState<string | null>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);

  // Move the development check to useEffect
  useEffect(() => {
    const isDevEnvironment = 
      process.env.NODE_ENV === 'development' || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';
    
    setIsDevelopment(isDevEnvironment);
    
    if (isDevEnvironment) {
      setToken('development');
    }
  }, []);

  const handleVerification = async (token: string) => {
    if (isDevelopment) {
      setToken('development');
      return;
    }

    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data: VerificationResponse = await response.json();

      if (data.success) {
        setToken('verified');
      }
    } catch (error) {
      console.error('Error verifying captcha:', error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto bg-background">
      <div className="flex-1 overflow-hidden rounded-lg border shadow-sm">
        {token ? (
          <ChatContent 
            token={token} 
            onVerify={handleVerification}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-muted-foreground">Please complete verification to continue</p>
            <Turnstile
              onSuccess={handleVerification}
              onError={() => {
                console.error("Verification failed");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}