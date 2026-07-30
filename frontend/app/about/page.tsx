import type { Metadata } from 'next';

import { AboutPage } from '../_localized-pages';
import { getAuthorBio } from '@/config/author';

export const metadata: Metadata = {
  title: '关于',
  description: getAuthorBio('zh'),
};

export default function Page() {
  return <AboutPage lang="zh" />;
}
