import { resolveSiteUrl } from '@/config/site-url';
import { siteSchema } from '@/lib/content/schema';

export const siteConfig = siteSchema.parse({
  name: 'JaoHun Blog',
  description:
    'A lightweight personal technical blog for engineering notes, project records, and practical web development writing.',
  url: resolveSiteUrl(),
  defaultOgImage: '/images/og/default.png',
  pageSize: 10,
});
