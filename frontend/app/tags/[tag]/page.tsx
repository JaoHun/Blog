import { Pagination } from '@/components/common/Pagination';
import { PostList } from '@/components/post/PostList';
import { siteConfig } from '@/config/site';
import { paginate } from '@/lib/content/pagination';
import { getPostsByTag, getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type TagPageParams = {
  params: Promise<{ tag: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return tags.map((tag) => ({ tag: routeSegment(tag) }));
}

export default async function TagPage({ params }: TagPageParams) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag);
  const page = paginate(posts, 1, siteConfig.pageSize);
  const basePath = `/tags/${routeSegment(decodedTag)}`;

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">#{decodedTag}</h1>
        <p className="mt-3 text-muted">该标签下共有 {posts.length} 篇文章。</p>
      </div>
      <PostList posts={page.items} />
      <Pagination basePath={basePath} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}
