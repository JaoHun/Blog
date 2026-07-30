import type { Metadata } from 'next';

import { TechPage } from '@/app/_localized-pages';

export const metadata: Metadata = {
  title: 'Technical notes and project records',
  description: 'A focused section for technical articles, project records, and engineering practice.',
};

export default async function Page() {
  return TechPage({ lang: 'en' });
}
