import { projectSchema } from '@/lib/content/schema';
import type { Lang } from '@/lib/content/posts';

export const projectConfig = [
  projectSchema.parse({
    name: 'JaoHun Blog',
    description:
      'A statically exported personal blog used to organize notes, technical writing, learning records, and project retrospectives.',
    descriptionByLang: {
      zh: '一个静态导出的个人博客，用来整理随笔、技术笔记、学习记录和项目复盘，支持 MDX 写作、搜索、主题切换、RSS 和站点地图。',
      en: 'A statically exported personal blog used to organize notes, technical writing, learning records, and project retrospectives.',
    },
    techStack: ['Next.js', 'TypeScript', 'MDX', 'Static Export'],
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
