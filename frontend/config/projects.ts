import { projectSchema } from '@/lib/content/schema';

export const projectConfig = [
  projectSchema.parse({
    name: 'Blog MVP',
    description: 'A statically exported personal blog built with Next.js and validated content schemas.',
    techStack: ['Next.js', 'TypeScript', 'Zod'],
    status: 'active',
    featured: true,
    sourceUrl: 'https://github.com/example/blog-mvp',
    demoUrl: 'https://blog.example.com',
    articleUrl: '/posts/blog-mvp',
  }),
];
