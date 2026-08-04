import { authorSchema } from '@/lib/content/schema';
import type { Lang } from '@/lib/content/posts';

export const authorConfig = authorSchema.parse({
  name: 'JaoHun',
  bio: 'A personal space for notes, things worth remembering, new technology learning, Agent systems, LLM development, technical writing, and project retrospectives.',
  bioByLang: {
    zh: '记录各种随笔和想记的东西，不断学习了解新技术，关注 Agent 智能体、大模型开发、技术笔记和项目复盘。',
    en: 'A personal space for notes, things worth remembering, new technology learning, Agent systems, LLM development, technical writing, and project retrospectives.',
  },
  skills: ['Agent', 'LLM Development', 'Next.js', 'TypeScript', 'MDX', 'Project Review'],
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
