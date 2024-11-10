import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

// Update the REPOS object to include all projects with their full data
const REPOS = {
  'account_backup': {
    name: 'Account Backup',
    description: 'Get all info from your discord account in a nice txt file',
    longDescription: 'A comprehensive tool for backing up and exporting all your Discord account information into an organized text file format.',
    features: [
      'Complete account data export',
      'Organized file structure',
      'Server information backup',
      'Message history export',
      'Friend list backup',
      'Settings configuration export'
    ],
    techStack: [
      'Python 3.x',
      'Discord API',
      'JSON processing',
      'File handling'
    ],
    price: 7.99,
    category: 'Utility Tools',
    image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80'
  },
  'linux_rooter': {
    name: 'Linux Rooter',
    description: 'Control all your discord hosting at once',
    longDescription: 'Advanced Discord hosting management tool for Linux systems, providing centralized control and automation capabilities.',
    features: [
      'Centralized hosting control',
      'Multi-server management',
      'Automated deployment',
      'Resource monitoring',
      'Performance optimization',
      'Backup management'
    ],
    techStack: [
      'Python 3.x',
      'Linux System Calls',
      'Discord API',
      'Process Management',
      'Shell Scripting'
    ],
    price: 37.99,
    category: 'Management Tools',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80'
  },
  'gen_token': {
    name: 'Gen Token',
    description: 'Mass token discord token',
    longDescription: 'Advanced token generation utility with support for mass operations and management capabilities.',
    features: [
      'Mass token generation',
      'Token validation',
      'Proxy support',
      'Automated verification',
      'Token management',
      'Export capabilities'
    ],
    techStack: [
      'Python 3.x',
      'Discord API',
      'Proxy Handling',
      'Token Management',
      'Automation Tools'
    ],
    price: 14.99,
    category: 'Security Tools',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80'
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
              <Image 
                src={project.image || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80'} 
                alt={project.name}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-200"
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