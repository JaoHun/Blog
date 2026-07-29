import Link from 'next/link';

import { PostList } from '@/components/post/PostList';
import { ProjectList } from '@/components/project/ProjectList';
import { authorConfig } from '@/config/author';
import { siteConfig } from '@/config/site';
import { getFeaturedPosts, getPublishedPosts } from '@/lib/content/posts';

export default async function Home() {
  const [featuredPosts, posts] = await Promise.all([getFeaturedPosts(), getPublishedPosts()]);
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="space-y-14">
      <section className="flex min-h-[45vh] flex-col justify-center gap-5">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Technical notes and project records
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">{authorConfig.bio}</p>
        <div className="flex flex-wrap gap-4 text-sm text-link">
          <Link href="/posts">Browse posts</Link>
          <Link href="/projects">View projects</Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Featured posts</h2>
          <Link className="text-sm text-link" href="/posts">
            All posts
          </Link>
        </div>
        <PostList posts={featuredPosts.length > 0 ? featuredPosts : latestPosts} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Featured projects</h2>
          <Link className="text-sm text-link" href="/projects">
            All projects
          </Link>
        </div>
        <ProjectList featuredOnly />
      </section>
    </div>
  );
}
