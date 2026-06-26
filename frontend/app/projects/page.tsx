import type { Metadata } from 'next';

import { ProjectList } from '@/components/project/ProjectList';

export const metadata: Metadata = {
  title: '项目',
  description: '配置化展示精选项目和完整项目列表。',
};

export default function ProjectsPage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">项目</h1>
        <p className="mt-3 text-muted">记录个人项目、技术栈和相关链接。</p>
      </div>
      <ProjectList />
    </section>
  );
}
