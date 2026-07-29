import { projectSchema } from '@/lib/content/schema';

export const projectConfig = [
  projectSchema.parse({
    name: 'JaoHun Blog',
    description:
      'A statically exported personal technical blog with MDX writing, content validation, search, theme switching, RSS, and sitemap support.',
    techStack: ['Next.js', 'TypeScript', 'MDX', 'Zod'],
    status: 'active',
    featured: true,
    sourceUrl: 'https://github.com/JaoHun/Blog',
    demoUrl: 'https://blog-nu-wine-76.vercel.app',
    articleUrl: '/posts/static-blog-mvp',
  }),
];
