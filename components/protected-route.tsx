'use client';

import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to Cloudflare Access login
      window.location.href = `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_TEAM_NAME}.cloudflareaccess.com/cdn-cgi/access/login/${process.env.NEXT_PUBLIC_CLOUDFLARE_AUD_TAG}?redirect=${window.location.href}`;
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 