import type { Metadata } from 'next';

import { CategoriesPage } from '@/app/_localized-pages';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all post categories.',
};

export default async function Page() {
  return CategoriesPage({ lang: 'en' });
}
