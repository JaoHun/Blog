import Link from 'next/link';

import type { Lang, Post } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';
import { localizedPath, messages } from '@/lib/i18n';

type PostMetaProps = {
  lang?: Lang;
  post: Post;
};

export function PostMeta({ lang = 'zh', post }: PostMetaProps) {
  const t = messages[lang];

  return (
    <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
      <time dateTime={post.date}>{t.posts.published} {post.date}</time>
      {post.updated ? <span>{t.posts.updated} {post.updated}</span> : null}
      <span>{post.readingTimeMinutes} {t.posts.minRead}</span>
      <Link className="text-link" href={localizedPath(`/categories/${routeSegment(post.category)}`, lang)}>
        {post.category}
      </Link>
    </div>
  );
}
