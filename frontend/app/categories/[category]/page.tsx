import { Pagination } from '@/components/common/Pagination';
import { PostList } from '@/components/post/PostList';
import { siteConfig } from '@/config/site';
import { paginate } from '@/lib/content/pagination';
import { getPostsByCategory, getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type CategoryPageParams = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return categories.map((category) => ({ category: routeSegment(category) }));
}

export default async function CategoryPage({ params }: CategoryPageParams) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = await getPostsByCategory(decodedCategory);
  const page = paginate(posts, 1, siteConfig.pageSize);
  const basePath = `/categories/${routeSegment(decodedCategory)}`;

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{decodedCategory}</h1>
        <p className="mt-3 text-muted">该分类下共有 {posts.length} 篇文章。</p>
      </div>
      <PostList posts={page.items} />
      <Pagination basePath={basePath} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}
