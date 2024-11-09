"use client";

import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function SiteHeader() {
  const [siteName, setSiteName] = useState("DevForge");

  useEffect(() => {
    async function loadSettings() {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "general"));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          if (data.siteName) {
            setSiteName(data.siteName);
          }
        }
      } catch (error) {
        console.error("Error loading site settings:", error);
      }
    }

    loadSettings();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="font-bold">{siteName}</span>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <Button asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}