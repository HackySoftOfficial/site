import { Metadata } from 'next';
import { getAllPosts, generateBlogPost } from '@/lib/blog';
import { BlogList } from '@/components/blog-list';

export const metadata: Metadata = {
  title: 'Python Programming Blog - HackySoftX',
  description: 'Learn Python programming through our AI-generated tutorials and insights',
};

// Revalidate every 12 hours
export const revalidate = 43200;

export default async function BlogPage() {
  let posts = await getAllPosts();
  
  // Generate a new post if there are none
  if (posts.length === 0) {
    const newPost = await generateBlogPost();
    posts = [newPost];
  }

  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Python Programming Blog</h1>
      <div className="max-w-4xl mx-auto">
        <BlogList posts={posts} />
      </div>
    </main>
  );
} 