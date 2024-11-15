import { Metadata } from 'next';
import { getPostBySlug } from '@/lib/blog';
import { BlogPost } from '@/components/blog-post';
import { notFound } from 'next/navigation';

export const revalidate = 43200;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}

export default async function BlogPostPage({ 
  params,
  searchParams 
}: Props) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <BlogPost post={post} />
      </div>
    </main>
  );
}

export async function generateMetadata({ 
  params,
  searchParams 
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - HackySoftX',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - HackySoftX Blog`,
    description: `Read about ${post.title} and learn more about Python programming.`,
  };
} 