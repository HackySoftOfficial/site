"use client";

import { Turnstile as TurnstileComponent } from '@marsidev/react-turnstile';
import { useTheme } from "next-themes";

interface TurnstileProps {
  sitekey?: string;
  onSuccess: (token: string) => void;
  onError: () => void;
}

export function Turnstile({ sitekey = "0x4AAAAAAAzsPzeKVZCumamS", onSuccess, onError }: TurnstileProps) {
  const { theme } = useTheme();

  return (
    <TurnstileComponent
      siteKey={sitekey}
      options={{
        theme: theme === "dark" ? "dark" : "light",
        size: "normal",
      }}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
} 