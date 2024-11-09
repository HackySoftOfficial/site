import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Update the REPOS object to include all projects with their full data
const REPOS = {
  'webhook-spammer': {
    name: 'Webhook Spammer',
    description: 'Professional webhook testing and automation tool for Discord',
    longDescription: 'A powerful and efficient tool designed for testing Discord webhooks. Features an intuitive interface for managing multiple webhooks, customizable message templates, and automated sending capabilities.',
    features: [
      'Multi-webhook support',
      'Customizable message templates',
      'Rate limit handling',
      'Proxy support',
      'Message queue system',
      'Real-time status monitoring'
    ],
    techStack: [
      'Python 3.x',
      'Discord.py',
      'aiohttp',
      'SQLite',
      'PyQt6 (GUI version)'
    ],
    price: 29.99,
    category: 'Development Tools',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'
  },
  'discord-token-generator': {
    name: 'Discord Token Generator',
    description: 'Advanced discord account generation utility with proxy support',
    longDescription: 'A sophisticated tool for generating and managing Discord tokens. Implements advanced algorithms for bypassing security measures and includes comprehensive proxy support for distributed operations.',
    features: [
      'Advanced token generation algorithms',
      'Integrated proxy support (HTTP/SOCKS4/SOCKS5)',
      'Email verification handling',
      'Phone verification support',
      'Token checker and validator',
      'Mass generation capabilities'
    ],
    techStack: [
      'Python 3.x',
      'Selenium',
      'Requests',
      'BeautifulSoup4',
      'SQLite3'
    ],
    price: 49.99,
    category: 'Automation Tools',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80'
  },
  'pycompiler': {
    name: 'PyCompiler',
    description: 'Python to executable compiler',
    longDescription: 'A comprehensive Python compilation tool that converts Python scripts into standalone executables. Features advanced obfuscation techniques and custom dependency handling.',
    features: [
      'Python to EXE conversion',
      'Advanced code obfuscation',
      'Custom icon support',
      'Dependency auto-detection',
      'Multi-platform support',
      'Console/GUI mode selection'
    ],
    techStack: [
      'Python 3.x',
      'PyInstaller',
      'Py2exe',
      'Custom obfuscation engine',
      'UPX compression'
    ],
    price: 39.99,
    category: 'Development Tools',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80'
  },
  'scam-bot': {
    name: 'Security Testing Bot',
    description: 'Educational security testing tool for Discord',
    longDescription: 'A comprehensive Discord bot designed for security testing and educational purposes. Helps server administrators identify potential vulnerabilities and implement better security practices.',
    features: [
      'Server security analysis',
      'Permission auditing',
      'Anti-raid protection',
      'Vulnerability scanning',
      'Real-time monitoring',
      'Detailed security reports'
    ],
    techStack: [
      'Python 3.x',
      'Discord.py',
      'MongoDB',
      'aiohttp',
      'cryptography'
    ],
    price: 34.99,
    category: 'Security Tools',
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80'
  },
  'dead-lavaraider': {
    name: 'DEAD-LavaRaider',
    description: 'Advanced Discord server management and automation suite',
    longDescription: 'A comprehensive Discord automation toolkit featuring server management, token handling, and advanced interaction capabilities. Includes features for server raids, mass messaging, automated reactions, and sophisticated proxy support.',
    features: [
      'Multi-token management system',
      'Advanced server joining/leaving automation',
      'Mass message and reaction capabilities',
      'Proxy support with rotation',
      'Voice channel automation',
      'Token validation and management',
      'Button interaction automation',
      'Status management for multiple accounts',
      'Advanced user targeting system',
      'Anti-detection mechanisms'
    ],
    techStack: [
      'Python 3.x',
      'Discord API',
      'WebSocket protocol',
      'MySQL database',
      'HTTP/HTTPS protocols',
      'Custom encryption modules',
      'Threading support',
      'GUI interface (tkinter)'
    ],
    price: 44.99,
    category: 'Automation Tools',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80'
  },
  'lazysafe': {
    name: 'LazySafe',
    description: 'Automated security testing framework',
    longDescription: 'An advanced automated security testing framework designed to identify vulnerabilities and security weaknesses in web applications and network systems. Features comprehensive scanning capabilities and detailed reporting.',
    features: [
      'Automated vulnerability scanning',
      'Custom exploit development',
      'Network penetration testing',
      'Web application security testing',
      'Detailed security reports',
      'Customizable scanning profiles'
    ],
    techStack: [
      'Python 3.x',
      'Nmap',
      'SQLite',
      'Requests',
      'Beautiful Soup',
      'Custom security modules'
    ],
    price: 39.99,
    category: 'Security Tools',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80'
  },
  'music-bot': {
    name: 'Music Bot',
    description: 'Feature-rich Discord music bot',
    longDescription: 'A sophisticated Discord music bot with high-quality audio playback, playlist management, and advanced queue controls. Supports multiple audio sources and provides an exceptional music listening experience.',
    features: [
      'High-quality audio streaming',
      'Multiple platform support (YouTube, Spotify, SoundCloud)',
      'Advanced queue management',
      'Custom playlist creation',
      'Audio filters and effects',
      'Voice channel controls'
    ],
    techStack: [
      'Python 3.x',
      'Discord.py',
      'youtube-dl',
      'FFmpeg',
      'Wavelink',
      'Lavalink'
    ],
    price: 24.99,
    category: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80'
  },
  'equipdroid': {
    name: 'Equipdroid',
    description: 'Tjos is a custom Discord client for Android. The way it works is that it loads the discord.com website and injects Vencord.',
    longDescription: 'A specialized Android application for Discord automation and management. Provides advanced features for mobile Discord usage and automation capabilities.',
    features: [
      'Mobile automation',
      'Custom notifications',
      'Message management',
      'Server monitoring',
      'Account switching',
      'Offline functionality'
    ],
    techStack: [
      'Java',
      'Android SDK',
      'Discord API',
      'SQLite',
      'OkHttp',
      'Custom Android modules'
    ],
    price: 34.99,
    category: 'Mobile Apps',
    image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80'
  }
};

export default function ProjectsPage() {
  return (
    <main className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Projects</h1>
        <p className="text-xl text-muted-foreground">
          Explore our portfolio of innovative software solutions and tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(REPOS).map(([slug, project]) => (
          <Card key={slug} className="overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={project.image || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80'} 
                alt={project.name}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-6">
              <div className="text-sm text-muted-foreground mb-2">{project.category || 'Development Tools'}</div>
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">${project.price}</span>
                <Link 
                  href={`/projects/${slug}`}
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
} 