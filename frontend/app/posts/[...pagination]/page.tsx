import { notFound } from 'next/navigation';

import { PaginatedPostsPage } from '@/app/_localized-pages';
import { siteConfig } from '@/config/site';
import { getPublishedPosts } from '@/lib/content/posts';

type PostsPageParams = {
  params: Promise<{ pagination: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts('zh');
  const totalPages = Math.ceil(posts.length / siteConfig.pageSize);

  return Array.from({ length: Math.max(1, totalPages) }, (_, index) => ({
    pagination: ['page', String(index + 1)],
  }));
}

export default async function Page({ params }: PostsPageParams) {
  const { pagination } = await params;

  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  return <PaginatedPostsPage lang="zh" pagination={pagination} />;
}
