import type { Metadata } from 'next';

import { ProjectsPage } from '../_localized-pages';

export const metadata: Metadata = {
  title: '项目',
  description: '记录项目范围、技术选择、源码链接、实现过程和相关复盘。',
};

export default function Page() {
  return <ProjectsPage lang="zh" />;
}
