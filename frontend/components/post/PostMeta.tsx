import Link from 'next/link';

import type { Post } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type PostMetaProps = {
  post: Post;
};

export function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
      <time dateTime={post.date}>发布于 {post.date}</time>
      {post.updated ? <span>更新于 {post.updated}</span> : null}
      <span>{post.readingTimeMinutes} 分钟阅读</span>
      <Link className="text-link" href={`/categories/${routeSegment(post.category)}`}>
        {post.category}
      </Link>
    </div>
  );
}
