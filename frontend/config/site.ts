import { siteSchema } from '@/lib/content/schema';
import { resolveSiteUrl } from '@/config/site-url';

export const siteConfig = siteSchema.parse({
  name: 'Blog MVP',
  description: 'A focused personal publishing site for technical notes and essays.',
  url: resolveSiteUrl(),
  defaultOgImage: '/images/og/default.png',
  pageSize: 10,
});
