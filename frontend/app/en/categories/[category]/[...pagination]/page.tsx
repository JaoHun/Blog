import { notFound } from 'next/navigation';

import { PaginatedCategoryPage } from '@/app/_localized-pages';
import { siteConfig } from '@/config/site';
import { getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type CategoryPageParams = {
  params: Promise<{ category: string; pagination: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts('en');
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const params: Array<{ category: string; pagination: string[] }> = [];

  for (const category of categories) {
    const totalPages = Math.ceil(posts.filter((post) => post.category === category).length / siteConfig.pageSize);

    for (let page = 1; page <= Math.max(1, totalPages); page += 1) {
      params.push({ category: routeSegment(category), pagination: ['page', String(page)] });
    }
  }

  return params;
}

export default async function Page({ params }: CategoryPageParams) {
  const { category, pagination } = await params;

  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  return <PaginatedCategoryPage category={category} lang="en" pagination={pagination} />;
}
