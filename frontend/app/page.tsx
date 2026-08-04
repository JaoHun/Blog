import type { Metadata } from 'next';

import { HomePage } from './_localized-pages';

export const metadata: Metadata = {
  title: '个人杂谈与分享',
  description: '记录各种随笔和想记的东西，也关注 Agent 智能体、大模型开发、技术笔记和项目复盘。',
};

export default async function Page() {
  return HomePage({ lang: 'zh' });
}
