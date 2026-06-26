import Link from 'next/link';

import { ProjectList } from '@/components/project/ProjectList';
import { PostList } from '@/components/post/PostList';
import { authorConfig } from '@/config/author';
import { getFeaturedPosts, getPublishedPosts } from '@/lib/content/posts';

export default async function Home() {
  const [featuredPosts, posts] = await Promise.all([getFeaturedPosts(), getPublishedPosts()]);
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="space-y-14">
      <section className="flex min-h-[45vh] flex-col justify-center gap-5">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">Blog MVP</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          个人技术笔记与项目记录
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">{authorConfig.bio}</p>
        <div className="flex flex-wrap gap-4 text-sm text-link">
          <Link href="/posts">浏览文章</Link>
          <Link href="/projects">查看项目</Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">精选文章</h2>
          <Link className="text-sm text-link" href="/posts">
            全部文章
          </Link>
        </div>
        <PostList posts={featuredPosts.length > 0 ? featuredPosts : latestPosts} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">精选项目</h2>
          <Link className="text-sm text-link" href="/projects">
            全部项目
          </Link>
        </div>
        <ProjectList featuredOnly />
      </section>
    </div>
  );
}
