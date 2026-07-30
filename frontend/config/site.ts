import { resolveSiteUrl } from '@/config/site-url';
import type { Lang } from '@/lib/content/posts';
import { siteSchema } from '@/lib/content/schema';

export const siteConfig = siteSchema.parse({
  name: 'JaoHun Blog',
  description:
    'A lightweight personal technical blog for engineering notes, project records, and practical web development writing.',
  descriptionByLang: {
    zh: '一个轻量个人技术博客，用于沉淀工程笔记、项目记录和实用 Web 开发经验。',
    en: 'A lightweight personal technical blog for engineering notes, project records, and practical web development writing.',
  },
  url: resolveSiteUrl(),
  defaultOgImage: '/images/og/default.png',
  pageSize: 10,
});

export function getSiteDescription(lang: Lang) {
  return siteConfig.descriptionByLang?.[lang] ?? siteConfig.description;
}
