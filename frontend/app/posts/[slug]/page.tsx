import type { Metadata } from 'next';

import { PostPage } from '@/app/_localized-pages';
import { siteConfig } from '@/config/site';
import { getPostBySlug, getPublishedPosts } from '@/lib/content/posts';

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts('zh');

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, 'zh');

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

export default async function Page({ params }: PostPageProps) {
  const { slug } = await params;

  return <PostPage lang="zh" slug={slug} />;
}
