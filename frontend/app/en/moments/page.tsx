import type { Metadata } from 'next';

import { MomentsPage } from '@/app/_localized-pages';

export const metadata: Metadata = {
  title: 'Life notes and photo records',
  description: 'Travel photos, daily fragments, reading notes, and lightweight personal records.',
};

export default async function Page() {
  return MomentsPage({ lang: 'en' });
}
