'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { AgentChat } from '@/components/agent/AgentChat';

function isAgentPage(pathname: string | null) {
  return pathname === '/agent' || pathname === '/en/agent';
}

export function FloatingAgent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (isAgentPage(pathname)) {
    return null;
  }

  return (
    <>
      <section
        aria-label="JaoHun Blog Agent"
        aria-hidden={!open}
        className={[
          'fixed bottom-3 right-3 z-50 h-[min(75dvh,620px)] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-lg border border-border bg-background/95 shadow-lg backdrop-blur sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[410px]',
          open ? 'flex' : 'hidden',
        ].join(' ')}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border bg-background/95 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">JaoHun Blog Agent</p>
            <p className="mt-1 truncate text-xs text-muted">基于博客真实数据回答</p>
          </div>
          <button
            aria-label="关闭 JaoHun Blog Agent"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-background text-lg leading-none text-muted transition hover:border-accent hover:text-foreground"
            onClick={() => setOpen(false)}
            type="button"
          >
            ×
          </button>
        </div>
        <AgentChat variant="floating" />
      </section>

      <button
        aria-expanded={open}
        className={[
          'fixed bottom-3 right-3 z-50 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-md transition hover:border-accent hover:text-link sm:bottom-6 sm:right-6',
          open ? 'hidden' : 'block',
        ].join(' ')}
        onClick={() => setOpen(true)}
        type="button"
      >
        Agent
      </button>
    </>
  );
}
