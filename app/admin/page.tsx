"use client";

import { useEffect } from 'react';
import { AlertTriangle, Bomb } from 'lucide-react';

export default function AdminPage() {
  useEffect(() => {
    // Play explosion sound
    const audio = new Audio('/explosion.mp3');
    audio.volume = 0.5;
    
    const sequence = async () => {
      // Start with warning message
      document.body.style.transition = 'all 0.5s ease';
      
      // Red warning flash
      document.body.style.backgroundColor = '#ff0000';
      await new Promise(r => setTimeout(r, 100));
      document.body.style.backgroundColor = 'transparent';
      await new Promise(r => setTimeout(r, 100));
      
      // Play sound
      audio.play();

      // Screen shake effect
      document.body.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
      
      // Crash browser after effects
      setTimeout(() => {
        window.location.href = '/404';
      }, 1000);
    };

    sequence();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 animate-pulse">
      <Bomb className="h-24 w-24 text-red-500 animate-bounce" />
      <h1 className="text-4xl font-bold text-red-500 animate-pulse">SELF DESTRUCT SEQUENCE INITIATED</h1>
      <AlertTriangle className="h-16 w-16 text-red-500 animate-spin" />
      <style jsx global>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}