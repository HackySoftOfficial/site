"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  error: Error | undefined;
}

interface AuthResponse {
  user: { email: string } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json() as AuthResponse;
          setUser(data.user);
        } else {
          // Redirect to Cloudflare Access login
          window.location.href = `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_TEAM_NAME}.cloudflareaccess.com/cdn-cgi/access/login/${process.env.NEXT_PUBLIC_CLOUDFLARE_AUD_TAG}?redirect=${window.location.href}`;
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AdminAuthProvider");
  }
  return context;
};