"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="container relative z-10 mx-auto px-4 py-32 text-center">
        <motion.h1 
          className="text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your fastest path to
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> production</span>
        </motion.h1>
        <motion.p 
          className="mt-6 text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Build, deploy, and scale your applications with unparalleled ease – from your first user to your billionth.
        </motion.p>
        <motion.div 
          className="mt-10 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button size="lg" asChild>
            <Link href="/services">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}