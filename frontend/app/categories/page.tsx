import Link from 'next/link';
import type { Metadata } from 'next';

import { getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all post categories.',
};

export default async function CategoriesPage() {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();

  posts.forEach((post) => counts.set(post.category, (counts.get(post.category) ?? 0) + 1));

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {Array.from(counts.entries()).map(([category, count]) => (
          <Link
            className="rounded-lg border border-border p-5 transition hover:border-accent"
            href={`/categories/${routeSegment(category)}`}
            key={category}
          >
            <span className="font-medium">{category}</span>
            <span className="ml-3 text-sm text-muted">
              {count} {count === 1 ? 'post' : 'posts'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
