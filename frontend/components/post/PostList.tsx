import { EmptyState } from '@/components/common/EmptyState';
import { PostCard } from '@/components/post/PostCard';
import type { Post } from '@/lib/content/posts';
import type { Lang } from '@/lib/content/posts';
import { messages } from '@/lib/i18n';

type PostListProps = {
  lang?: Lang;
  posts: Post[];
};

export function PostList({ lang = 'zh', posts }: PostListProps) {
  if (posts.length === 0) {
    const t = messages[lang];

    return <EmptyState title={t.search.empty} description="" />;
  }

  return (
    <div className="space-y-4" data-testid="post-list">
      {posts.map((post) => (
        <PostCard key={post.slug} lang={lang} post={post} />
      ))}
    </div>
  );
}
