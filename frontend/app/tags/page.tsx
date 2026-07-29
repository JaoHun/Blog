import type { Metadata } from 'next';

import { TagsPage } from '../_localized-pages';

export const metadata: Metadata = {
  title: '标签',
  description: '浏览全部文章标签。',
};

export default async function Page() {
  return TagsPage({ lang: 'zh' });
}
