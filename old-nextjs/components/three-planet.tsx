"use client";

import Spline from '@splinetool/react-spline';

export function ThreePlanet({ sceneUrl }: { sceneUrl: string }) {
  return (
    <div className="w-full h-full">
      <Spline 
        scene={sceneUrl}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
} 