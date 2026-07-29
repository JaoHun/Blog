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
        slug: 'static-blog-mvp',
        title: '构建一个轻量静态博客 MVP',
        category: '博客',
        lang: 'zh',
        tags: ['nextjs', 'mdx', 'static-site'],
      }),
    ]);
    expect(index.every((item) => !('body' in item))).toBe(true);
    expect(index.some((item) => item.slug === 'draft-example')).toBe(false);

    await expect(buildSearchIndex('en')).resolves.toEqual([
      expect.objectContaining({
        slug: 'static-blog-mvp',
        title: 'Building a Lightweight Static Blog MVP',
        category: 'Blog',
        lang: 'en',
      }),
    ]);
  });

  it('generates RSS, Sitemap, and robots text from published content', async () => {
    const rss = await buildRssXml();
    const sitemap = await buildSitemapXml();
    const robots = buildRobotsTxt();

    expect(rss).toContain('<rss');
    expect(rss).toContain('构建一个轻量静态博客 MVP');
    expect(rss).not.toContain('Draft Example');

    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('/posts/static-blog-mvp');
    expect(sitemap).toContain('/en/posts/static-blog-mvp');
    expect(sitemap).toContain('/categories');
    expect(sitemap).toContain('/tags');
    expect(sitemap).not.toContain('/posts/draft-example');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain(`Sitemap: ${siteConfig.url}/sitemap.xml`);
  });
});
