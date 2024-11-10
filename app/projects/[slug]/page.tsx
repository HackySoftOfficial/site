export const runtime = 'edge';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// This would typically come from a database or API
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
    price: 7.99
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
    price: 37.99
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
    price: 14.99
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