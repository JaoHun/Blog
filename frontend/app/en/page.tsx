import type { Metadata } from 'next';

import { HomePage } from '../_localized-pages';

export const metadata: Metadata = {
  title: 'Personal notes and essays',
  description: 'Casual notes, daily thoughts, reading reflections, and lightweight personal sharing.',
};

export default async function Page() {
  return HomePage({ lang: 'en' });
}
