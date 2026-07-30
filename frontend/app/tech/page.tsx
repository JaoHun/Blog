import type { Metadata } from 'next';

import { TechPage } from '../_localized-pages';

export const metadata: Metadata = {
  title: '技术笔记与项目记录',
  description: '集中展示技术文章、项目记录和工程实践内容。',
};

export default async function Page() {
  return TechPage({ lang: 'zh' });
}
