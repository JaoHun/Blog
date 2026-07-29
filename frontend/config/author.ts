import { authorSchema } from '@/lib/content/schema';

export const authorConfig = authorSchema.parse({
  name: 'JaoHun',
  bio: 'Developer focused on practical web engineering, static publishing workflows, and long-term technical note taking.',
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/JaoHun',
    },
  ],
});
