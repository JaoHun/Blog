import type { Metadata } from 'next';

import { TagsPage } from '@/app/_localized-pages';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all post tags.',
};

export default async function Page() {
  return TagsPage({ lang: 'en' });
}
