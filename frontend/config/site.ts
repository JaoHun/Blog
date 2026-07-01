import { siteSchema } from '@/lib/content/schema';

export const siteConfig = siteSchema.parse({
  name: 'Blog MVP',
  description: 'A focused personal publishing site for technical notes and essays.',
  url: 'https://blog-nu-wine-76.vercel.app',
  defaultOgImage: '/images/og/default.png',
  pageSize: 10,
});
