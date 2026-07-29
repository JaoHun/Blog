import { notFound } from 'next/navigation';

import { Pagination } from '@/components/common/Pagination';
import { PostList } from '@/components/post/PostList';
import { siteConfig } from '@/config/site';
import { paginate } from '@/lib/content/pagination';
import { getPostsByCategory, getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type CategoryPageParams = {
  params: Promise<{ category: string; pagination: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const params: Array<{ category: string; pagination: string[] }> = [];

  for (const category of categories) {
    const categoryPosts = posts.filter((post) => post.category === category);
    const totalPages = Math.ceil(categoryPosts.length / siteConfig.pageSize);
    const pagesToGenerate = Math.max(1, totalPages);

    for (let page = 1; page <= pagesToGenerate; page += 1) {
      params.push({ category: routeSegment(category), pagination: ['page', String(page)] });
    }
  }

  return params;
}

export default async function PaginatedCategoryPage({ params }: CategoryPageParams) {
  const { category, pagination } = await params;

  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  const decodedCategory = decodeURIComponent(category);
  const posts = await getPostsByCategory(decodedCategory);
  const page = paginate(posts, Number(pagination[1]), siteConfig.pageSize);
  const basePath = `/categories/${routeSegment(decodedCategory)}`;

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{decodedCategory}</h1>
        <p className="mt-3 text-muted">Page {page.currentPage}</p>
      </div>
      <PostList posts={page.items} />
      <Pagination basePath={basePath} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}
