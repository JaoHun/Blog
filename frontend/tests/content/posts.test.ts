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

  it('provides a valid unpublished photo essay template', async () => {
    const posts = await getAllPosts({ includeDrafts: true });

    expect(posts).toContainEqual(
      expect.objectContaining({
        cover: undefined,
        draft: true,
        lang: 'zh',
        slug: 'photo-essay-template',
        type: 'essay',
      }),
    );
  });

  it('generates unique slugs and normalized tags', async () => {
    const posts = await getAllPosts({ includeDrafts: true });
    const slugs = posts.map((post) => `${post.lang}:${post.slug}`);
    const uniqueSlugs = new Set(slugs);

    expect(uniqueSlugs.size).toBe(slugs.length);
    expect(posts.flatMap((post) => post.tags).every((tag) => tag === tag.toLowerCase())).toBe(
      true,
    );
  });

  it('sorts sticky posts before regular posts and then by date descending', async () => {
    const posts = await getAllPosts({ includeDrafts: true });

    expect(posts[0]?.slug).toBe('static-blog-mvp');
    expect(posts[0]?.sticky).toBe(true);
  });

  it('filters featured, category, and tag collections from published posts', async () => {
    await expect(getFeaturedPosts()).resolves.toEqual([
      expect.objectContaining({ slug: 'static-blog-mvp', featured: true }),
    ]);
    await expect(getPostsByCategory('博客')).resolves.toEqual([
      expect.objectContaining({ slug: 'static-blog-mvp' }),
    ]);
    await expect(getPostsByTag('MDX')).resolves.toEqual([
      expect.objectContaining({ slug: 'static-blog-mvp' }),
    ]);
  });

  it('computes adjacent posts against the published post order', async () => {
    const published = await getPublishedPosts();
    const adjacent = getAdjacentPosts(published, 'static-blog-mvp');

    expect(adjacent.previous).toBeUndefined();
    expect(adjacent.next).toBeUndefined();
  });
});
