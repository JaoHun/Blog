import { authorSchema } from '@/lib/content/schema';
import type { Lang } from '@/lib/content/posts';

export const authorConfig = authorSchema.parse({
  name: 'JaoHun',
  bio: 'Developer focused on practical web engineering, static publishing workflows, and long-term technical note taking.',
  bioByLang: {
    zh: '关注实用 Web 工程、静态发布流程和长期技术笔记沉淀，持续记录项目实践与工程取舍。',
    en: 'Developer focused on practical web engineering, static publishing workflows, and long-term technical note taking.',
  },
  skills: ['Next.js', 'TypeScript', 'MDX', 'Static Sites', 'Content Workflow', 'Frontend Engineering'],
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/JaoHun',
    },
  ],
});

export function getAuthorBio(lang: Lang) {
  return authorConfig.bioByLang?.[lang] ?? authorConfig.bio;
}
