import path from 'node:path';

import fg from 'fast-glob';

import { parsePostFile } from './parser';

export type Lang = 'zh' | 'en';

export type Post = {
  slug: string;
  lang: Lang;
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
  headings: Array<{ id: string; text: string; level: number }>;
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
    const key = `${post.lang}:${post.slug}`;

    if (seen.has(key)) {
      throw new Error(`Duplicate post slug: ${key}`);
    }

    seen.add(key);
  }
}

export async function getAllPosts(options: { includeDrafts?: boolean; lang?: Lang } = {}) {
  const postPattern = path.join(process.cwd(), 'content/posts/**/*.mdx').replace(/\\/g, '/');
  const files = await fg(postPattern, { absolute: true });
  const posts = await Promise.all(files.map((file) => parsePostFile(file)));

  assertUniqueSlugs(posts);

  const languagePosts = options.lang ? posts.filter((post) => post.lang === options.lang) : posts;
  const visiblePosts = options.includeDrafts
    ? languagePosts
    : languagePosts.filter((post) => !post.draft);

  return sortPosts(visiblePosts);
}

export async function getPublishedPosts(lang: Lang = 'zh') {
  return getAllPosts({ includeDrafts: false, lang });
}

export async function getPostBySlug(slug: string, lang: Lang = 'zh') {
  const posts = await getPublishedPosts(lang);

  return posts.find((post) => post.slug === slug);
}

export async function getFeaturedPosts(lang: Lang = 'zh') {
  const posts = await getPublishedPosts(lang);

  return posts.filter((post) => post.featured);
}

export async function getPostsByType(type: Post['type'], lang: Lang = 'zh') {
  const posts = await getPublishedPosts(lang);

  return posts.filter((post) => post.type === type);
}

export async function getPostsByCategory(category: string, lang: Lang = 'zh') {
  const posts = await getPublishedPosts(lang);

  return posts.filter((post) => post.category.toLowerCase() === category.trim().toLowerCase());
}

export async function getPostsByTag(tag: string, lang: Lang = 'zh') {
  const posts = await getPublishedPosts(lang);
  const normalizedTag = tag.trim().toLowerCase();

  return posts.filter((post) => post.tags.includes(normalizedTag));
}
