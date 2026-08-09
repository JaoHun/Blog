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
  projectSchema.parse({
    name: 'Agent 与大模型学习记录',
    description:
      'A long-running learning record for Agent systems, LLM development, tool usage, notes, and small experiments.',
    descriptionByLang: {
      zh: '围绕 Agent 智能体、大模型开发、工具使用和小实验持续沉淀学习记录，先以笔记和复盘为主，后续再补真实项目产出。',
      en: 'A long-running learning record for Agent systems, LLM development, tool usage, notes, and small experiments.',
    },
    techStack: ['Agent', 'LLM', 'Prompting', 'Notes'],
    status: 'planned',
    featured: false,
  }),
  projectSchema.parse({
    name: '生活影像记录',
    description:
      'A lightweight photo and essay collection for travel moments, daily fragments, and personal records.',
    descriptionByLang: {
      zh: '用生活随笔和照片记录游玩片段、日常观察和想留下来的内容，先保持轻量，用 MDX 文章承载图片和文字。',
      en: 'A lightweight photo and essay collection for travel moments, daily fragments, and personal records.',
    },
    techStack: ['MDX', 'Photography', 'Static Content'],
    status: 'active',
    featured: false,
    articleUrl: '/moments',
  }),
];

export type ProjectConfig = (typeof projectConfig)[number];

export function getProjectDescription(project: ProjectConfig, lang: Lang) {
  return project.descriptionByLang?.[lang] ?? project.description;
}
