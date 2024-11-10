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
}

export function PlanetBanner({ sceneUrl }: PlanetBannerProps) {
  return (
    <div className="h-48 w-full relative overflow-hidden">
      <div className="h-48 w-full bg-gradient-to-br from-zinc-900 to-zinc-800" />
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <ThreePlanet sceneUrl={sceneUrl} />
        </Suspense>
      </div>
    </div>
  );
} 