import { notFound } from 'next/navigation';

import { PaginatedTagPage } from '@/app/_localized-pages';
import { siteConfig } from '@/config/site';
import { getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type TagPageParams = {
  params: Promise<{ tag: string; pagination: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts('en');
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const params: Array<{ tag: string; pagination: string[] }> = [];

  for (const tag of tags) {
    const totalPages = Math.ceil(posts.filter((post) => post.tags.includes(tag)).length / siteConfig.pageSize);

    for (let page = 1; page <= Math.max(1, totalPages); page += 1) {
      params.push({ tag: routeSegment(tag), pagination: ['page', String(page)] });
    }
  }

  return params;
}

export default async function Page({ params }: TagPageParams) {
  const { pagination, tag } = await params;

  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  return <PaginatedTagPage lang="en" pagination={pagination} tag={tag} />;
}
