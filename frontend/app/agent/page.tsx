import type { Metadata } from 'next';

import { AgentChat } from '@/components/agent/AgentChat';

export const metadata: Metadata = {
  title: 'Agent',
  description: '通过本地 Agent 查询博客里的真实文章和项目。',
};

export default function Page() {
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <section className="rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">Agent</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">博客智能助手</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted">
          和本地 Python Agent 对话，查询这个博客已发布文章、项目列表和相关推荐。
        </p>
      </section>
      <AgentChat />
    </div>
  );
}
