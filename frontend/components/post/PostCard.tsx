import Link from 'next/link';

import type { Post } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-border py-6">
      <div className="flex flex-wrap gap-3 text-sm text-muted">
        <time dateTime={post.date}>{post.date}</time>
        {post.updated ? <span>更新于 {post.updated}</span> : null}
        <Link className="text-link" href={`/categories/${routeSegment(post.category)}`}>
          {post.category}
        </Link>
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        <Link className="transition hover:text-link" href={`/posts/${post.slug}`}>
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:text-foreground"
            href={`/tags/${routeSegment(tag)}`}
            key={tag}
          >
            #{tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
