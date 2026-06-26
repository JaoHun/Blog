import type { SearchIndexItem } from '@/lib/content/search';

export type SearchFilters = {
  query?: string;
  category?: string;
  tag?: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function searchPosts(index: SearchIndexItem[], filters: SearchFilters) {
  const query = normalize(filters.query ?? '');
  const category = normalize(filters.category ?? '');
  const tag = normalize(filters.tag ?? '');

  return index.filter((item) => {
    const matchesQuery =
      !query ||
      [item.title, item.excerpt, item.category, ...item.tags].some((value) =>
        normalize(value).includes(query),
      );
    const matchesCategory = !category || normalize(item.category) === category;
    const matchesTag = !tag || item.tags.some((value) => normalize(value) === tag);

    return matchesQuery && matchesCategory && matchesTag;
  });
}

export function highlightMatch(text: string, query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return text;
  }

  const index = text.toLowerCase().indexOf(normalizedQuery.toLowerCase());

  if (index === -1) {
    return text;
  }

  return `${text.slice(0, index)}<mark>${text.slice(index, index + normalizedQuery.length)}</mark>${text.slice(
    index + normalizedQuery.length,
  )}`;
}
