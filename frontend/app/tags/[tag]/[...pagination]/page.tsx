import { notFound } from 'next/navigation';

import { Pagination } from '@/components/common/Pagination';
import { PostList } from '@/components/post/PostList';
import { siteConfig } from '@/config/site';
import { paginate } from '@/lib/content/pagination';
import { getPostsByTag, getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type TagPageParams = {
  params: Promise<{ tag: string; pagination: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const params: Array<{ tag: string; pagination: string[] }> = [];

  for (const tag of tags) {
    const tagPosts = posts.filter((post) => post.tags.includes(tag));
    const totalPages = Math.ceil(tagPosts.length / siteConfig.pageSize);
    const pagesToGenerate = Math.max(1, totalPages);

    for (let page = 1; page <= pagesToGenerate; page += 1) {
      params.push({ tag: routeSegment(tag), pagination: ['page', String(page)] });
    }
  }

  return params;
}

export default async function PaginatedTagPage({ params }: TagPageParams) {
  const { tag, pagination } = await params;

  if (pagination.length !== 2 || pagination[0] !== 'page') {
    notFound();
  }

  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag);
  const page = paginate(posts, Number(pagination[1]), siteConfig.pageSize);
  const basePath = `/tags/${routeSegment(decodedTag)}`;

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">#{decodedTag}</h1>
        <p className="mt-3 text-muted">Page {page.currentPage}</p>
      </div>
      <PostList posts={page.items} />
      <Pagination basePath={basePath} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}
