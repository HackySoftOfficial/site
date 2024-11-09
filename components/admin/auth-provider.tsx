"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginDialog } from "./login-dialog";
import { auth } from "@/lib/firebase/client";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AdminLoginDialog />;
  }

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