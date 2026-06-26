import Link from 'next/link';
import type { Metadata } from 'next';

import { getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

export const metadata: Metadata = {
  title: '标签',
  description: '浏览全部文章标签。',
};

export default async function TagsPage() {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();

  posts.flatMap((post) => post.tags).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">标签</h1>
      <div className="mt-8 flex flex-wrap gap-3">
        {Array.from(counts.entries()).map(([tag, count]) => (
          <Link
            className="rounded-full border border-border px-4 py-2 text-sm transition hover:border-accent"
            href={`/tags/${routeSegment(tag)}`}
            key={tag}
          >
            #{tag} <span className="text-muted">{count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
