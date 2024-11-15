import { Card } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostProps {
  post: {
    title: string;
    content: string;
    date: string;
    readingTime: string;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <Card className="p-8">
      <article className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
          </div>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <div 
          className="leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </Card>
  );
} 