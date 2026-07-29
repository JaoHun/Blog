import { footerSchema } from '@/lib/content/schema';

export const footerConfig = footerSchema.parse({
  copyright: 'Built for notes and projects.',
  icpText: '',
  links: [],
});
