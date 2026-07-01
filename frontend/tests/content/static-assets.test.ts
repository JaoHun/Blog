import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/config/site';
import { buildRobotsTxt } from '@/lib/content/robots';
import { buildRssXml } from '@/lib/content/rss';
import { buildSearchIndex } from '@/lib/content/search';
import { buildSitemapXml } from '@/lib/content/sitemap';

describe('static asset generation', () => {
  it('generates search index without drafts or body content', async () => {
    const index = await buildSearchIndex();

    expect(index).toEqual([
      expect.objectContaining({
        slug: 'hello-next-mdx',
        title: 'Hello Next MDX',
        category: 'Next.js',
        tags: ['nextjs', 'mdx'],
      }),
    ]);
    expect(index.every((item) => !('body' in item))).toBe(true);
    expect(index.some((item) => item.slug === 'draft-example')).toBe(false);
  });

  it('generates RSS, Sitemap, and robots text from published content', async () => {
    const rss = await buildRssXml();
    const sitemap = await buildSitemapXml();
    const robots = buildRobotsTxt();

    expect(rss).toContain('<rss');
    expect(rss).toContain('Hello Next MDX');
    expect(rss).not.toContain('Draft Example');

    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('/posts/hello-next-mdx');
    expect(sitemap).toContain('/categories');
    expect(sitemap).toContain('/tags');
    expect(sitemap).not.toContain('/posts/draft-example');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain(`Sitemap: ${siteConfig.url}/sitemap.xml`);
  });
});
