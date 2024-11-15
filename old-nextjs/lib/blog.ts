import Together from "together-ai";
import { marked } from 'marked';
import type { Marked } from 'marked';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  readingTime: string;
  slug: string;
}

const topics = [
  'Python Data Structures and Algorithms',
  'Python Web Development with FastAPI',
  'Python Machine Learning Basics',
  'Python Automation Scripts',
  'Python Best Practices and Tips',
  'Python for Data Science',
  'Python Testing Strategies',
  'Python Design Patterns',
  'Python Performance Optimization',
  'Python Security Best Practices',
];

// File-based storage for development
const DEV_STORAGE_PATH = path.join(process.cwd(), '.blog-posts.json');

export async function generateBlogPost(): Promise<BlogPost> {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  const prompt = `Write a detailed technical blog post about "${topic}". 
    Include code examples, best practices, and practical tips. 
    Format the content in markdown with proper headings, code blocks, and explanations.
    The tone should be professional but approachable.
    Do not include any CSS classes or HTML attributes in the markdown.`;

  const together = new Together({ 
    apiKey: "4439b00dfd6aa4476f3977a8aeaf645830ec1d9da261f2c5897cf20e7bbbe610"
  });

  const completion = await together.completions.create({
    prompt,
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    max_tokens: 2000,
    temperature: 0.7,
  });

  let markdown = completion.choices[0].text || '';
  
  // Clean up the markdown
  markdown = markdown
    // Remove any {: .text-center} or similar classes
    .replace(/\{:\s*\.[^\}]+\}/g, '')
    // Remove any HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove any trailing whitespace
    .trim();

  const content = marked(markdown);

  const wordCount = markdown.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  const id = nanoid();
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const post: BlogPost = {
    id,
    title: topic,
    content,
    date: new Date().toISOString(),
    readingTime: readingTime.toString(),
    slug,
  };

  await saveBlogPost(post);
  return post;
}

export async function saveBlogPost(post: BlogPost) {
  const env = process.env.NODE_ENV;
  if (env === 'development') {
    try {
      let posts: BlogPost[] = [];
      if (fs.existsSync(DEV_STORAGE_PATH)) {
        const data = fs.readFileSync(DEV_STORAGE_PATH, 'utf8');
        posts = JSON.parse(data);
      }
      posts.push(post);
      fs.writeFileSync(DEV_STORAGE_PATH, JSON.stringify(posts, null, 2));
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  } else {
    const KV = (globalThis as any).BLOG_KV;
    if (KV) {
      await KV.put(`post:${post.id}`, JSON.stringify(post));
      const postList = await KV.get('post_list');
      const posts = postList ? JSON.parse(postList) : [];
      posts.push({ id: post.id, title: post.title, date: post.date, slug: post.slug });
      await KV.put('post_list', JSON.stringify(posts));
    }
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const env = process.env.NODE_ENV;
  if (env === 'development') {
    try {
      if (fs.existsSync(DEV_STORAGE_PATH)) {
        const data = fs.readFileSync(DEV_STORAGE_PATH, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error reading blog posts:', error);
      return [];
    }
  } else {
    const KV = (globalThis as any).BLOG_KV;
    if (KV) {
      const postList = await KV.get('post_list');
      if (!postList) return [];
      const posts = JSON.parse(postList);
      return Promise.all(
        posts.map(async (p: any) => {
          const postData = await KV.get(`post:${p.id}`);
          return JSON.parse(postData);
        })
      );
    }
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}