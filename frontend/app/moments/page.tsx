import type { Metadata } from 'next';

import { MomentsPage } from '../_localized-pages';

export const metadata: Metadata = {
  title: '生活随笔与影像记录',
  description: '记录游玩照片、日常片段、阅读感受和一些想留下来的生活内容。',
};

export default async function Page() {
  return MomentsPage({ lang: 'zh' });
}
