import type { Metadata } from 'next';

import { AgentChat } from '@/components/agent/AgentChat';

export const metadata: Metadata = {
  title: 'Agent',
  description: 'Ask the local Agent about real posts and projects from this blog.',
};

export default function Page() {
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <section className="rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">Agent</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Blog Agent</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted">
          Chat with the local Python Agent to query published posts, projects, and related recommendations.
        </p>
      </section>
      <AgentChat />
    </div>
  );
}
