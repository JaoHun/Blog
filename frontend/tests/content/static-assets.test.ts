import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/config/site';
import { buildRobotsTxt } from '@/lib/content/robots';
import { buildRssXml } from '@/lib/content/rss';
import { buildSearchIndex } from '@/lib/content/search';
import { buildSitemapXml } from '@/lib/content/sitemap';

describe('static asset generation', () => {
  it('generates search index without drafts or body content', async () => {
    const index = await buildSearchIndex();

    expect(index).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: 'static-blog-mvp',
          title: '为什么搭建这个个人博客',
          category: '博客',
          lang: 'zh',
          tags: ['nextjs', 'mdx', 'static-site'],
        }),
        expect.objectContaining({
          slug: 'bipenggou-2024',
          title: '川西游',
          category: '生活',
          lang: 'zh',
          tags: ['旅行', '照片', '毕棚沟'],
        }),
        expect.objectContaining({
          slug: 'personal-agent-learning',
          title: '从零开始学习开发个人智能体',
          category: '技术',
          lang: 'zh',
        }),
        expect.objectContaining({
          slug: 'summer-part-time-food-2025',
          title: '暑假兼职时吃到的味道',
          category: '生活',
          lang: 'zh',
          type: 'essay',
        }),
      ]),
    );
    expect(index.every((item) => !('body' in item))).toBe(true);
    expect(index.some((item) => item.slug === 'draft-example')).toBe(false);

    await expect(buildSearchIndex('en')).resolves.toEqual([
      expect.objectContaining({
        slug: 'static-blog-mvp',
        title: 'Why I Built This Personal Blog',
        category: 'Blog',
        lang: 'en',
      }),
    ]);
  });

  it('generates RSS, Sitemap, and robots text from published content', async () => {
    const rss = await buildRssXml();
    const englishRss = await buildRssXml('en');
    const sitemap = await buildSitemapXml();
    const robots = buildRobotsTxt();

    expect(rss).toContain('<rss');
    expect(rss).toContain('为什么搭建这个个人博客');
    expect(rss).toContain('川西游');
    expect(rss).toContain('一个轻量个人博客');
    expect(rss).not.toContain('Draft Example');

    expect(englishRss).toContain('Why I Built This Personal Blog');
    expect(englishRss).toContain(`${siteConfig.url}/en/`);
    expect(englishRss).not.toContain('为什么搭建这个个人博客');

    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('/posts/static-blog-mvp');
    expect(sitemap).toContain('/posts/bipenggou-2024');
    expect(sitemap).toContain('/en/posts/static-blog-mvp');
    expect(sitemap).toContain('/moments');
    expect(sitemap).toContain('/en/moments');
    expect(sitemap).toContain('/categories');
    expect(sitemap).toContain('/tags');
    expect(sitemap).not.toContain('/posts/draft-example');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain(`Sitemap: ${siteConfig.url}/sitemap.xml`);
  });
});
