import { EmptyState } from '@/components/common/EmptyState';
import { PostCard } from '@/components/post/PostCard';
import type { Post } from '@/lib/content/posts';

type PostListProps = {
  posts: Post[];
};

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <EmptyState title="No posts found" description="No posts match the current conditions." />;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
