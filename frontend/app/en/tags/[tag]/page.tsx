import { TagPage } from '@/app/_localized-pages';
import { getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type TagPageParams = {
  params: Promise<{ tag: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts('en');
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return tags.map((tag) => ({ tag: routeSegment(tag) }));
}

export default async function Page({ params }: TagPageParams) {
  const { tag } = await params;

  return <TagPage lang="en" tag={tag} />;
}
