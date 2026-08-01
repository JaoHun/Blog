import type { ReactNode } from 'react';

type ContentWithSidebarProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export function ContentWithSidebar({ children, sidebar }: ContentWithSidebarProps): JSX.Element {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0">{children}</div>
      <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">{sidebar}</aside>
    </div>
  );
}
