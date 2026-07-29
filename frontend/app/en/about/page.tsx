import type { Metadata } from 'next';

import { AboutPage } from '@/app/_localized-pages';
import { authorConfig } from '@/config/author';

export const metadata: Metadata = {
  title: 'About',
  description: authorConfig.bio,
};

export default function Page() {
  return <AboutPage lang="en" />;
}
