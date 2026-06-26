import type { Metadata } from 'next';

import { Pagination } from '@/components/common/Pagination';
import { PostList } from '@/components/post/PostList';
import { SearchBox } from '@/components/search/SearchBox';
import { siteConfig } from '@/config/site';
import { paginate } from '@/lib/content/pagination';
import { getPublishedPosts } from '@/lib/content/posts';

export const metadata: Metadata = {
  title: '文章',
  description: '按时间倒序浏览全部技术文章。',
};

export default async function PostsPage() {
  const posts = await getPublishedPosts();
  const page = paginate(posts, 1, siteConfig.pageSize);

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">文章</h1>
        <p className="mt-3 text-muted">按时间倒序浏览技术笔记，并支持客户端搜索与筛选。</p>
      </div>
      <SearchBox />
      <PostList posts={page.items} />
      <Pagination basePath="/posts" currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  );
}
