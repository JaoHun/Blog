import type { Metadata } from 'next';

import { CategoriesPage } from '../_localized-pages';

export const metadata: Metadata = {
  title: '分类',
  description: '浏览全部文章分类。',
};

export default async function Page() {
  return CategoriesPage({ lang: 'zh' });
}
