import path from 'node:path';

import fg from 'fast-glob';

import { parsePostFile } from './parser';

export type Post = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  sticky: boolean;
  draft: boolean;
  cover?: string;
  type: 'tech' | 'essay';
  body: string;
  readingTimeMinutes: number;
};

function sortPosts(posts: Post[]) {
  return [...posts].sort((first, second) => {
    if (first.sticky !== second.sticky) {
      return first.sticky ? -1 : 1;
    }

    return Date.parse(second.date) - Date.parse(first.date);
  });
}

function assertUniqueSlugs(posts: Post[]) {
  const seen = new Set<string>();

  for (const post of posts) {
    if (seen.has(post.slug)) {
      throw new Error(`Duplicate post slug: ${post.slug}`);
    }

    seen.add(post.slug);
  }
}

export async function getAllPosts(options: { includeDrafts?: boolean } = {}) {
  const postPattern = path.join(process.cwd(), 'content/posts/**/*.mdx').replace(/\\/g, '/');
  const files = await fg(postPattern, { absolute: true });
  const posts = await Promise.all(files.map((file) => parsePostFile(file)));

  assertUniqueSlugs(posts);

  const visiblePosts = options.includeDrafts ? posts : posts.filter((post) => !post.draft);

  return sortPosts(visiblePosts);
}

export async function getPublishedPosts() {
  return getAllPosts({ includeDrafts: false });
}

export async function getFeaturedPosts() {
  const posts = await getPublishedPosts();

  return posts.filter((post) => post.featured);
}

export async function getPostsByCategory(category: string) {
  const posts = await getPublishedPosts();

  return posts.filter((post) => post.category.toLowerCase() === category.trim().toLowerCase());
}

export async function getPostsByTag(tag: string) {
  const posts = await getPublishedPosts();
  const normalizedTag = tag.trim().toLowerCase();

  return posts.filter((post) => post.tags.includes(normalizedTag));
}
