import { describe, expect, it } from 'vitest';

import { highlightMatch, searchPosts } from '@/components/search/search-client';

const index = [
  {
    slug: 'static-blog-mvp',
    title: 'Static Blog MVP',
    excerpt: 'Build a static blog with MDX.',
    category: 'Next.js',
    tags: ['nextjs', 'mdx'],
    date: '2026-06-26',
    type: 'tech' as const,
  },
];

describe('searchPosts', () => {
  it('matches title excerpt category and tags', () => {
    expect(searchPosts(index, { query: 'mdx' })).toHaveLength(1);
    expect(searchPosts(index, { query: 'static' })).toHaveLength(1);
    expect(searchPosts(index, { query: 'next.js' })).toHaveLength(1);
    expect(searchPosts(index, { query: 'missing' })).toHaveLength(0);
  });

  it('filters by category and tag', () => {
    expect(searchPosts(index, { category: 'Next.js' })).toHaveLength(1);
    expect(searchPosts(index, { tag: 'mdx' })).toHaveLength(1);
    expect(searchPosts(index, { tag: 'react' })).toHaveLength(0);
  });

  it('highlights matches and escapes unsafe HTML', () => {
    expect(highlightMatch('Static Blog MVP', 'blog')).toBe('Static <mark>Blog</mark> MVP');
    expect(highlightMatch('<script>alert(1)</script> MDX', 'mdx')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt; <mark>MDX</mark>',
    );
  });
});
