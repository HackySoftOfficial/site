import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '@/lib/blog';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <Card className="p-6 hover:bg-muted/50 transition-colors">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
              </div>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 