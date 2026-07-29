import type { Metadata } from 'next';

import { PostsPage } from '../_localized-pages';

export const metadata: Metadata = {
  title: '文章',
  description: '按时间倒序浏览技术笔记，支持本地搜索和筛选。',
};

export default async function Page() {
  return PostsPage({ lang: 'zh' });
}
