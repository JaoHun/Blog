import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { buildRobotsTxt } from '@/lib/content/robots';
import { buildRssXml } from '@/lib/content/rss';
import { buildSearchIndex } from '@/lib/content/search';
import { buildSitemapXml } from '@/lib/content/sitemap';

async function main() {
  const publicDir = path.join(process.cwd(), 'public');

  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, 'rss.xml'), await buildRssXml(), 'utf8');
  await writeFile(path.join(publicDir, 'sitemap.xml'), await buildSitemapXml(), 'utf8');
  await writeFile(path.join(publicDir, 'robots.txt'), buildRobotsTxt(), 'utf8');
  await writeFile(
    path.join(publicDir, 'search-index.json'),
    JSON.stringify(await buildSearchIndex()),
    'utf8',
  );

  console.log('static assets generated');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
