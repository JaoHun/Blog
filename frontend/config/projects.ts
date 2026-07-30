import { projectSchema } from '@/lib/content/schema';
import type { Lang } from '@/lib/content/posts';

export const projectConfig = [
  projectSchema.parse({
    name: 'JaoHun Blog',
    description:
      'A statically exported personal technical blog with MDX writing, content validation, search, theme switching, RSS, and sitemap support.',
    descriptionByLang: {
      zh: '一个静态导出的个人技术博客，支持 MDX 写作、内容校验、搜索、主题切换、RSS 和站点地图。',
      en: 'A statically exported personal technical blog with MDX writing, content validation, search, theme switching, RSS, and sitemap support.',
    },
    techStack: ['Next.js', 'TypeScript', 'MDX', 'Zod'],
    status: 'active',
    featured: true,
    sourceUrl: 'https://github.com/JaoHun/Blog',
    demoUrl: 'https://blog-nu-wine-76.vercel.app',
    articleUrl: '/posts/static-blog-mvp',
  }),
];

export type ProjectConfig = (typeof projectConfig)[number];

export function getProjectDescription(project: ProjectConfig, lang: Lang) {
  return project.descriptionByLang?.[lang] ?? project.description;
}
