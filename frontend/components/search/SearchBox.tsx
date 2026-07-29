'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { highlightMatch, searchPosts } from '@/components/search/search-client';
import type { Lang } from '@/lib/content/posts';
import type { SearchIndexItem } from '@/lib/content/search';
import { localizedPath, messages } from '@/lib/i18n';

type SearchBoxProps = {
  lang?: Lang;
};

export function SearchBox({ lang = 'zh' }: SearchBoxProps) {
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetch(lang === 'zh' ? '/search-index.json' : '/search-index.en.json')
      .then((response) => response.json() as Promise<SearchIndexItem[]>)
      .then((items) => {
        if (!cancelled) {
          setIndex(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIndex([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const categories = useMemo(() => Array.from(new Set(index.map((item) => item.category))), [index]);
  const tags = useMemo(() => Array.from(new Set(index.flatMap((item) => item.tags))), [index]);
  const hasFilters = Boolean(query.trim() || category || tag);
  const results = useMemo(
    () => searchPosts(index, { query, category, tag }),
    [category, index, query, tag],
  );
  const t = messages[lang].search;

  return (
    <section className="mb-8 rounded-lg border border-border p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <input
          className="rounded border border-border bg-background px-3 py-2 text-sm"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.placeholder}
          type="search"
          value={query}
        />
        <select
          className="rounded border border-border bg-background px-3 py-2 text-sm"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          <option value="">{t.allCategories}</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-border bg-background px-3 py-2 text-sm"
          onChange={(event) => setTag(event.target.value)}
          value={tag}
        >
          <option value="">{t.allTags}</option>
          {tags.map((item) => (
            <option key={item} value={item}>
              #{item}
            </option>
          ))}
        </select>
      </div>

      {hasFilters ? (
        <div className="mt-5">
          <p className="text-sm text-muted">{t.results(results.length)}</p>
          {results.length > 0 ? (
            <div className="mt-3 space-y-3">
              {results.map((item) => (
                <Link
                  className="block rounded border border-border p-4 transition hover:border-accent"
                  href={localizedPath(`/posts/${item.slug}`, lang)}
                  key={item.slug}
                >
                  <span
                    className="font-medium"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(item.title, query) }}
                  />
                  <span
                    className="mt-2 block text-sm text-muted"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(item.excerpt, query) }}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">{t.empty}</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
