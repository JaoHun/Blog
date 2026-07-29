import Link from 'next/link';

import type { Post } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';
import { localizedPath, messages } from '@/lib/i18n';
import type { Lang } from '@/lib/content/posts';

type PostCardProps = {
  lang?: Lang;
  post: Post;
};

export function PostCard({ lang = 'zh', post }: PostCardProps) {
  const t = messages[lang];

  return (
    <article className="border-b border-border py-6">
      <div className="flex flex-wrap gap-3 text-sm text-muted">
        <time dateTime={post.date}>{post.date}</time>
        {post.updated ? <span>{t.posts.updated} {post.updated}</span> : null}
        <Link className="text-link" href={localizedPath(`/categories/${routeSegment(post.category)}`, lang)}>
          {post.category}
        </Link>
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        <Link className="transition hover:text-link" href={localizedPath(`/posts/${post.slug}`, lang)}>
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:text-foreground"
            href={localizedPath(`/tags/${routeSegment(tag)}`, lang)}
            key={tag}
          >
            #{tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
