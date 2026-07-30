import type { Metadata } from 'next';

import { HomePage } from './_localized-pages';

export const metadata: Metadata = {
  title: '个人杂谈与分享',
  description: '记录日常思考、生活片段、阅读感受和轻量个人分享。',
};

export default async function Page() {
  return HomePage({ lang: 'zh' });
}
