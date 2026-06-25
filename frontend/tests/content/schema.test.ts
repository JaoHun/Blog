import { describe, expect, it } from 'vitest';

import {
  authorSchema,
  navItemSchema,
  postFrontmatterSchema,
  projectSchema,
  siteSchema,
} from '@/lib/content/schema';

describe('content schemas', () => {
  it('parses valid post frontmatter and keeps updated', () => {
    const frontmatter = postFrontmatterSchema.parse({
      title: 'Shipping a reliable blog content pipeline',
      date: '2026-06-20',
      updated: '2026-06-25',
      excerpt:
        'A practical note on validating blog content before rendering it in the frontend.',
      category: 'Engineering',
      tags: ['nextjs', 'content'],
      cover: '/images/blog/content-pipeline.png',
      slug: 'content-pipeline',
    });

    expect(frontmatter.updated).toBe('2026-06-25');
    expect(frontmatter.featured).toBe(false);
    expect(frontmatter.sticky).toBe(false);
    expect(frontmatter.draft).toBe(false);
    expect(frontmatter.type).toBe('tech');
  });

  it('rejects Date object frontmatter dates', () => {
    const result = postFrontmatterSchema.safeParse({
      title: 'Shipping a reliable blog content pipeline',
      date: new Date('2026-06-20T00:00:00.000Z'),
      updated: new Date('2026-06-25T00:00:00.000Z'),
      excerpt:
        'A practical note on validating blog content before rendering it in the frontend.',
      category: 'Engineering',
      tags: ['nextjs', 'content'],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain(
      'Dates must be quoted YYYY-MM-DD strings',
    );
  });

  it('rejects invalid calendar dates', () => {
    const result = postFrontmatterSchema.safeParse({
      title: 'Shipping a reliable blog content pipeline',
      date: '2026-02-30',
      excerpt:
        'A practical note on validating blog content before rendering it in the frontend.',
      category: 'Engineering',
      tags: ['nextjs', 'content'],
    });

    expect(result.success).toBe(false);
  });

  it('rejects updated dates earlier than the publish date', () => {
    const result = postFrontmatterSchema.safeParse({
      title: 'Shipping a reliable blog content pipeline',
      date: '2026-06-20',
      updated: '2026-06-19',
      excerpt:
        'A practical note on validating blog content before rendering it in the frontend.',
      category: 'Engineering',
      tags: ['nextjs', 'content'],
    });

    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only required post and config strings', () => {
    expect(
      postFrontmatterSchema.safeParse({
        title: '   ',
        date: '2026-06-20',
        excerpt:
          'A practical note on validating blog content before rendering it in the frontend.',
        category: 'Engineering',
        tags: ['nextjs', 'content'],
      }).success,
    ).toBe(false);

    expect(
      postFrontmatterSchema.safeParse({
        title: 'Shipping a reliable blog content pipeline',
        date: '2026-06-20',
        excerpt:
          'A practical note on validating blog content before rendering it in the frontend.',
        category: '   ',
        tags: ['nextjs', 'content'],
      }).success,
    ).toBe(false);

    expect(
      siteSchema.safeParse({
        name: '   ',
        description: 'A focused personal publishing site for technical notes.',
        url: 'https://example.com',
        defaultOgImage: '/images/og/default.png',
      }).success,
    ).toBe(false);

    expect(
      authorSchema.safeParse({
        name: 'MJH',
        bio: '   ',
        links: [{ label: 'GitHub', href: 'https://github.com/example' }],
      }).success,
    ).toBe(false);

    expect(navItemSchema.safeParse({ label: '   ', href: '/posts' }).success).toBe(
      false,
    );

    expect(
      projectSchema.safeParse({
        name: 'Blog MVP',
        description: '   ',
        techStack: ['Next.js'],
        status: 'active',
      }).success,
    ).toBe(false);
  });

  it('rejects excessive site page sizes', () => {
    const result = siteSchema.safeParse({
      name: 'Blog MVP',
      description: 'A focused personal publishing site for technical notes.',
      url: 'https://example.com',
      defaultOgImage: '/images/og/default.png',
      pageSize: 100,
    });

    expect(result.success).toBe(false);
  });

  it('parses valid site, author, nav item, and project configs', () => {
    expect(
      siteSchema.parse({
        name: 'Blog MVP',
        description: 'A focused personal publishing site for technical notes.',
        url: 'https://example.com',
        defaultOgImage: '/images/og/default.png',
      }).pageSize,
    ).toBe(10);

    expect(
      authorSchema.parse({
        name: 'MJH',
        bio: 'Developer writing about product engineering and practical systems.',
        links: [{ label: 'GitHub', href: 'https://github.com/example' }],
      }).links,
    ).toHaveLength(1);

    expect(navItemSchema.parse({ label: 'Articles', href: '/posts' })).toEqual({
      label: 'Articles',
      href: '/posts',
    });

    expect(
      projectSchema.parse({
        name: 'Blog MVP',
        description: 'A statically exported blog built with Next.js.',
        techStack: ['Next.js', 'TypeScript', 'Zod'],
        status: 'active',
        sourceUrl: 'https://github.com/example/blog',
        demoUrl: 'https://blog.example.com',
        articleUrl: '/posts/blog-mvp',
      }).featured,
    ).toBe(false);
  });
});
