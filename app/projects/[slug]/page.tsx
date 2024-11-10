export const runtime = 'edge';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// This would typically come from a database or API
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
    price: 29.99
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
    price: 49.99
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
    price: 39.99
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
    price: 34.99
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
    price: 44.99
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
    price: 39.99
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
    price: 24.99
  },
  'proxy-manager-extension': {
    name: 'Proxy Manager Extension',
    description: 'Advanced proxy management system',
    longDescription: 'A comprehensive proxy management solution that handles proxy rotation, testing, and validation. Includes support for multiple proxy types and automated health checking.',
    features: [
      'Multi-protocol proxy support',
      'Automated proxy rotation',
      'Proxy health monitoring',
      'Speed testing and latency checking',
      'IP geolocation filtering',
      'Export/Import functionality'
    ],
    techStack: [
      'Python 3.x',
      'aiohttp',
      'Requests',
      'SQLite',
      'ProxyChecker',
      'GeoIP2'
    ],
    price: 29.99
  },
  'kahoot-connect': {
    name: 'KahootConnect',
    description: 'Python API for Kahoot',
    longDescription: 'A powerful Python API wrapper for Kahoot that enables automated interaction with Kahoot games. Features comprehensive game management capabilities and bot prevention bypass.',
    features: [
      'Automated game joining',
      'Answer automation',
      'Multiple session handling',
      'Anti-bot bypass techniques',
      'Custom answer patterns',
      'Real-time game state tracking'
    ],
    techStack: [
      'Python 3.x',
      'Websockets',
      'Requests',
      'aiohttp',
      'JSON Web Tokens',
      'Custom encryption modules'
    ],
    price: 19.99
  },
  'equipdroid': {
    name: 'Equipdroid',
    description: 'Discord Android app',
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
    price: 34.99
  }
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = REPOS[params.slug as keyof typeof REPOS];

  if (!project) {
    return (
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <Button asChild className="mb-8">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
        <p className="text-xl text-muted-foreground mb-8">{project.description}</p>

        <div className="grid gap-8 mb-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">{project.longDescription}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {project.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {project.techStack.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </section>
        </div>

        <Button className="lg" asChild>
          <Link href={`/services?product=${params.slug}`}>
            Purchase (${project.price})
          </Link>
        </Button>
      </div>
    </main>
  );
}