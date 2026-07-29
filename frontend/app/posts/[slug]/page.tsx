import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { mdxComponents } from '@/components/post/MdxComponents';
import { PostMeta } from '@/components/post/PostMeta';
import { PostToc } from '@/components/post/PostToc';
import { siteConfig } from '@/config/site';
import { getPostBySlug, getPublishedPosts } from '@/lib/content/posts';
import { getAdjacentPosts } from '@/lib/content/relations';

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/posts/${post.slug}`,
      images: [post.cover ?? siteConfig.defaultOgImage],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPostBySlug(slug), getPublishedPosts()]);

  if (!post) {
    notFound();
  }

  const adjacent = getAdjacentPosts(posts, post.slug);

  return (
    <article className="grid gap-8 lg:grid-cols-[1fr_220px]">
      <div className="min-w-0">
        <Link className="text-sm text-link" href="/posts">
          Back to posts
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{post.excerpt}</p>
        <PostMeta post={post} />
        <div className="post-content mt-10">
          <MDXRemote components={mdxComponents} source={post.body} />
        </div>
        <nav className="mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          {adjacent.previous ? (
            <Link className="text-link" href={`/posts/${adjacent.previous.slug}`}>
              Previous: {adjacent.previous.title}
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link className="text-link sm:text-right" href={`/posts/${adjacent.next.slug}`}>
              Next: {adjacent.next.title}
            </Link>
          ) : null}
        </nav>
      </div>
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <PostToc headings={post.headings} />
      </aside>
    </article>
  );
}
