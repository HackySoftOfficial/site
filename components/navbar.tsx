"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldDestroy, setShouldDestroy] = useState(false);

  useEffect(() => {
    // Start entrance animation after component mounts
    setIsVisible(true);
    
    // Mark as loaded after initial delay
    const loadTimer = setTimeout(() => setIsVisible(true), 500);
    
    // Start destruction sequence after 5 seconds
    const destroyTimer = setTimeout(() => {
      setShouldDestroy(true);
      // Actually destroy after showing the warning
      setTimeout(() => setIsVisible(false), 2000);
    }, 5000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(destroyTimer);
    };
  }, []);

  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/30 overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="container mx-auto flex h-14 items-center justify-between px-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
              }
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.9,
              transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.05
              }
            }}
          >
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              exit={{
                opacity: 0,
                x: -50,
                transition: { duration: 0.3 }
              }}
            >
              <NavigationMenuItem className="font-bold hover:bg-accent/30 rounded-md transition-colors">
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="bg-transparent">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        color: shouldDestroy ? 'hsl(var(--destructive))' : 'currentColor'
                      }}
                      transition={{ 
                        delay: 0.5,
                        color: { duration: 0.3 }
                      }}
                      className="flex items-center px-3 py-2"
                    >
                      HackySoft
                      <Sparkles className={cn(
                        "ml-2 h-4 w-4",
                        shouldDestroy ? "text-destructive animate-pulse" : "text-primary/70"
                      )} />
                    </motion.span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </motion.div>

            <NavigationMenu className="bg-transparent">
              <NavigationMenuList className="bg-transparent flex justify-center space-x-4">
                {[
                  { href: "/services", text: "Services" },
                  { href: "/projects", text: "Projects" },
                  { href: "/about", text: "About" },
                  { href: "/menu", text: "Menu" }
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }}
                    exit={{
                      opacity: 0,
                      y: -50,
                      rotate: Math.random() * 20 - 10,
                      transition: { duration: 0.3 }
                    }}
                    custom={index}
                  >
                    <NavigationMenuItem className={cn(
                      "hover:bg-accent/30 rounded-md transition-colors"
                    )}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className="bg-transparent">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: 1,
                              color: shouldDestroy ? 'hsl(var(--destructive))' : 'currentColor'
                            }}
                            transition={{ 
                              delay: index * 0.2 + 0.5,
                              color: { duration: 0.3 }
                            }}
                            className="flex items-center px-3 py-2"
                          >
                            {item.text}
                          </motion.span>
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </motion.div>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              exit={{
                opacity: 0,
                x: 50,
                transition: { duration: 0.3 }
              }}
            >
              <Button 
                variant="ghost" 
                asChild
                className="bg-background/50 hover:bg-accent/30 backdrop-blur-sm"
              >
                <Link href="/contact">Contact</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning message before destruction */}
      <AnimatePresence>
        {shouldDestroy && (
          <motion.div
            className="fixed top-2 left-1/2 -translate-x-1/2 bg-destructive/80 backdrop-blur-lg text-destructive-foreground px-4 py-2 rounded-md shadow-lg border border-destructive/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Self-destruct sequence initiated...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}