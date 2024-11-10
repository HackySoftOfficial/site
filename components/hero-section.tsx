"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Code2, Rocket, Shield, ChevronDown, Terminal } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2]" />
        <div className="absolute inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute h-full w-full bg-gradient-to-r from-background via-muted to-background opacity-40" />

        {/* Content */}
        <div className="container relative z-10 px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <div className="inline-block">
                <span className="inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium bg-muted ring-1 ring-border">
                  <Terminal className="mr-1 h-3 w-3" />
                  Python Tools & Automation
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                HackySoft
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Two Python developers crafting powerful Discord tools and automation solutions that just work.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6"> {/* Center align items */}
              <Button size="lg" asChild>
                <Link href="/services">
                  View Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">Browse Projects</Link>
              </Button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <ChevronDown className="h-8 w-8 animate-bounce" />
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div 
          className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[
            {
              icon: Code2,
              title: "Python Specialists",
              description: "We live and breathe Python. From automation to Discord tools, we build efficient solutions that actually work."
            },
            {
              icon: Rocket,
              title: "Small Team, Big Impact",
              description: "Two developers who know their craft. No corporate overhead, just clean code and direct communication."
            },
            {
              icon: Shield,
              title: "Battle-Tested Tools",
              description: "Every tool we release is thoroughly tested in real-world scenarios. If we sell it, it works."
            }
          ].map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="p-6">
                <feature.icon className="h-10 w-10 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="max-w-5xl mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { value: "7+", label: "Python Tools" },
            { value: "2", label: "Developers" },
            { value: "100%", label: "Working Code" },
            { value: "24/7", label: "Discord Support" }
          ].map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>
    </>
  );
}