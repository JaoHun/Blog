import type { Metadata } from 'next';

import { AboutPage } from '@/app/_localized-pages';
import { getAuthorBio } from '@/config/author';

export const metadata: Metadata = {
  title: 'About',
  description: getAuthorBio('en'),
};

export default function Page() {
  return <AboutPage lang="en" />;
}
