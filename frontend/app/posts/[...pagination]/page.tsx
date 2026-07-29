import { notFound } from 'next/navigation';

import { Pagination } from '@/components/common/Pagination';
import { PostList } from '@/components/post/PostList';
import { siteConfig } from '@/config/site';
import { paginate } from '@/lib/content/pagination';
import { getPublishedPosts } from '@/lib/content/posts';

type PostsPageParams = {
  params: Promise<{ pagination: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const totalPages = Math.ceil(posts.length / siteConfig.pageSize);
  const pagesToGenerate = Math.max(1, totalPages);

  return Array.from({ length: pagesToGenerate }, (_, index) => ({
    pagination: ['page', String(index + 1)],
  }));
}

export default async function PaginatedPostsPage({ params }: PostsPageParams) {
  const { pagination } = await params;

  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  const posts = await getPublishedPosts();
  const page = paginate(posts, Number(pagination[1]), siteConfig.pageSize);

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
        <p className="mt-3 text-muted">Page {page.currentPage}</p>
      </div>
      <PostList posts={page.items} />
      <Pagination basePath="/posts" currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}
