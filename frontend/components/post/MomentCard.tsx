import Link from 'next/link';

import { PostImage } from '@/components/post/PostImage';
import type { Lang, Post } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';
import { localizedPath, messages } from '@/lib/i18n';

type MomentCardProps = {
  lang?: Lang;
  post: Post;
};

export function MomentCard({ lang = 'zh', post }: MomentCardProps) {
  const href = localizedPath(`/posts/${post.slug}`, lang);
  const t = messages[lang].moments;

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-background/72 shadow-sm transition hover:border-accent hover:shadow-md">
      {post.cover ? (
        <Link className="relative block aspect-[4/3] overflow-hidden" href={href}>
          <PostImage
            alt={post.title}
            className="!m-0 !h-full !w-full !rounded-none !border-0 object-cover transition-transform duration-300 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
            src={post.cover}
          />
          <span className="absolute left-4 top-4 rounded-full bg-background/88 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            {t.photoBadge}
          </span>
        </Link>
      ) : (
        <div className="border-b border-border bg-code-bg px-5 py-8">
          <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted">
            {t.noteBadge}
          </span>
        </div>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <time dateTime={post.date}>{post.date}</time>
          <span>{post.category}</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">
          <Link className="transition hover:text-link" href={href}>
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 leading-7 text-muted">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-foreground"
              href={localizedPath(`/tags/${routeSegment(tag)}`, lang)}
              key={tag}
            >
              #{tag}
            </Link>
          ))}
        </div>
        <Link className="mt-5 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-medium text-background transition hover:opacity-90" href={href}>
          {t.viewRecord}
        </Link>
      </div>
    </article>
  );
}
