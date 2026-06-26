import { getPublishedPosts } from './posts';

export type SearchIndexItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  updated?: string;
  type?: 'tech' | 'essay';
};

export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const posts = await getPublishedPosts();

  return posts.map(({ slug, title, excerpt, category, tags, date, updated, type }) => ({
    slug,
    title,
    excerpt,
    category,
    tags,
    date,
    updated,
    type,
  }));
}
