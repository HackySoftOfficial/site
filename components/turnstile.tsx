"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export function Turnstile({ onSuccess, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const loadTurnstile = async () => {
      if (!containerRef.current) return;

      // Reset container if widget was previously rendered
      containerRef.current.innerHTML = "";

      // @ts-ignore - Turnstile is loaded via script
      window.turnstile.render(containerRef.current, {
        sitekey: "0x4AAAAAAAzsUquHurDSPtR_", // Replace with your actual site key
        theme: theme === "dark" ? "dark" : "light",
        callback: (token: string) => {
          onSuccess(token);
        },
        "error-callback": () => {
          onError?.();
        },
      });
    };

    // Load Turnstile if not already loaded
    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = loadTurnstile;
    } else {
      loadTurnstile();
    }

    return () => {
      // Cleanup on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [onSuccess, onError, theme]);

  return <div ref={containerRef} />;
} 