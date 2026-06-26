import { siteConfig } from '@/config/site';

import { joinSiteUrl } from './route';

export function buildRobotsTxt() {
  return [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${joinSiteUrl(siteConfig.url, '/sitemap.xml')}`,
    '',
  ].join('\n');
}
