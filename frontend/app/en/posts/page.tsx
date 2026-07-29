import type { Metadata } from 'next';

import { PostsPage } from '@/app/_localized-pages';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Browse technical notes in reverse chronological order with client-side search.',
};

export default async function Page() {
  return PostsPage({ lang: 'en' });
}
