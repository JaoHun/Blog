import { getPublishedPosts } from './posts';
import type { Lang } from './posts';

export type SearchIndexItem = {
  slug: string;
  lang: Lang;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  updated?: string;
  type?: 'tech' | 'essay';
};

export async function buildSearchIndex(lang: Lang = 'zh'): Promise<SearchIndexItem[]> {
  const posts = await getPublishedPosts(lang);

  return posts.map(({ slug, lang, title, excerpt, category, tags, date, updated, type }) => ({
    slug,
    lang,
    title,
    excerpt,
    category,
    tags,
    date,
    updated,
    type,
  }));
}
