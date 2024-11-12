"use client";

import { Turnstile as TurnstileComponent } from '@marsidev/react-turnstile';
import { useTheme } from "next-themes";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export function Turnstile({ onSuccess, onError }: TurnstileProps) {
  const { theme } = useTheme();

  return (
    <TurnstileComponent
      siteKey="0x4AAAAAAAzsPzeKVZCumamS"
      options={{
        theme: theme === "dark" ? "dark" : "light",
        size: "normal",
      }}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
} 