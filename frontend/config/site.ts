import { resolveSiteUrl } from '@/config/site-url';
import type { Lang } from '@/lib/content/posts';
import { siteSchema } from '@/lib/content/schema';

export const siteConfig = siteSchema.parse({
  name: 'JaoHun Blog',
  description:
    'A lightweight personal blog for essays, technical notes, Agent and LLM learning, and project retrospectives.',
  descriptionByLang: {
    zh: '一个轻量个人博客，用来记录随笔、想记的东西、Agent 智能体与大模型开发学习、技术笔记和项目复盘。',
    en: 'A lightweight personal blog for essays, technical notes, Agent and LLM learning, and project retrospectives.',
  },
  url: resolveSiteUrl(),
  defaultOgImage: '/images/og/default.png',
  pageSize: 10,
});

export function getSiteDescription(lang: Lang) {
  return siteConfig.descriptionByLang?.[lang] ?? siteConfig.description;
}
