import { CategoryPage } from '@/app/_localized-pages';
import { getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';

type CategoryPageParams = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts('en');
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return categories.map((category) => ({ category: routeSegment(category) }));
}

export default async function Page({ params }: CategoryPageParams) {
  const { category } = await params;

  return <CategoryPage category={category} lang="en" />;
}
