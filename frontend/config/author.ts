import { authorSchema } from '@/lib/content/schema';

export const authorConfig = authorSchema.parse({
  name: 'MJH',
  bio: 'Developer writing about product engineering, web systems, and practical software delivery.',
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/example',
    },
  ],
});
