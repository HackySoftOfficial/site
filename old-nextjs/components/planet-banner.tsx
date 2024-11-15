"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the Spline component
const ThreePlanet = dynamic(() => import('./three-planet').then(mod => mod.ThreePlanet), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-gradient-to-br from-zinc-900 to-zinc-800" />
  )
});

interface PlanetBannerProps {
  sceneUrl: string;
  muted?: boolean;
}

export function PlanetBanner({ sceneUrl, muted = true }: PlanetBannerProps) {
  return (
    <div className="w-full h-[200px] relative overflow-hidden">
      <iframe
        src={sceneUrl}
        className="w-full h-full border-none"
        allow={muted ? "autoplay" : undefined}
      />
    </div>
  );
} 