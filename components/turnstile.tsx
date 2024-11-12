"use client";

import { Turnstile as TurnstileComponent } from '@marsidev/react-turnstile';
import { useTheme } from "next-themes";

export interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  sitekey?: string;
}

export function Turnstile({ onSuccess, onError, sitekey }: TurnstileProps) {
  const { theme } = useTheme();

  return (
    <TurnstileComponent
      siteKey={sitekey || "0x4AAAAAAAzsPzeKVZCumamS"}
      options={{
        theme: theme === "dark" ? "dark" : "light",
      }}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
} 