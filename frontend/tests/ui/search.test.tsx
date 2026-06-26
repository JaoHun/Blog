import { describe, expect, it } from 'vitest';

import { searchPosts } from '@/components/search/search-client';

const index = [
  {
    slug: 'hello-next-mdx',
    title: 'Hello Next MDX',
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
});
