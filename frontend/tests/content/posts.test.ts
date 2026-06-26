import { describe, expect, it } from 'vitest';

import {
  getAllPosts,
  getFeaturedPosts,
  getPostsByCategory,
  getPostsByTag,
  getPublishedPosts,
} from '@/lib/content/posts';
import { getAdjacentPosts } from '@/lib/content/relations';

describe('post content pipeline', () => {
  it('includes drafts only when requested', async () => {
    const withDrafts = await getAllPosts({ includeDrafts: true });
    const published = await getPublishedPosts();

    expect(withDrafts.some((post) => post.draft)).toBe(true);
    expect(published.every((post) => !post.draft)).toBe(true);
  });

  it('generates unique slugs and normalized tags', async () => {
    const posts = await getAllPosts({ includeDrafts: true });
    const slugs = posts.map((post) => post.slug);
    const uniqueSlugs = new Set(slugs);

    expect(uniqueSlugs.size).toBe(slugs.length);
    expect(posts.flatMap((post) => post.tags).every((tag) => tag === tag.toLowerCase())).toBe(
      true,
    );
  });

  it('sorts sticky posts before regular posts and then by date descending', async () => {
    const posts = await getAllPosts({ includeDrafts: true });

    expect(posts[0]?.slug).toBe('hello-next-mdx');
    expect(posts[0]?.sticky).toBe(true);
  });

  it('filters featured, category, and tag collections from published posts', async () => {
    await expect(getFeaturedPosts()).resolves.toEqual([
      expect.objectContaining({ slug: 'hello-next-mdx', featured: true }),
    ]);
    await expect(getPostsByCategory('Next.js')).resolves.toEqual([
      expect.objectContaining({ slug: 'hello-next-mdx' }),
    ]);
    await expect(getPostsByTag('MDX')).resolves.toEqual([
      expect.objectContaining({ slug: 'hello-next-mdx' }),
    ]);
  });

  it('computes adjacent posts against the published post order', async () => {
    const published = await getPublishedPosts();
    const adjacent = getAdjacentPosts(published, 'hello-next-mdx');

    expect(adjacent.previous).toBeUndefined();
    expect(adjacent.next).toBeUndefined();
  });
});
