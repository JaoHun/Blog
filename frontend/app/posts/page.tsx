import type { Metadata } from 'next';

import { Pagination } from '@/components/common/Pagination';
import { PostList } from '@/components/post/PostList';
import { SearchBox } from '@/components/search/SearchBox';
import { siteConfig } from '@/config/site';
import { paginate } from '@/lib/content/pagination';
import { getPublishedPosts } from '@/lib/content/posts';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Browse all technical posts in reverse chronological order with client-side search.',
};

export default async function PostsPage() {
  const posts = await getPublishedPosts();
  const page = paginate(posts, 1, siteConfig.pageSize);

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
        <p className="mt-3 text-muted">
          Browse technical notes in reverse chronological order, with local search and filtering support.
        </p>
      </div>
      <SearchBox />
      <PostList posts={page.items} />
      <Pagination basePath="/posts" currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}
