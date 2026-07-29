import type { Metadata } from 'next';

import { AboutPage } from '../_localized-pages';
import { authorConfig } from '@/config/author';

export const metadata: Metadata = {
  title: '关于',
  description: authorConfig.bio,
};

export default function Page() {
  return <AboutPage lang="zh" />;
}
