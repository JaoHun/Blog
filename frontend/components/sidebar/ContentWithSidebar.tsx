import type { ReactElement, ReactNode } from 'react';

type ContentWithSidebarProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export function ContentWithSidebar({ children, sidebar }: ContentWithSidebarProps): ReactElement {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-8">
      <div className="min-w-0">{children}</div>
      <aside className="space-y-5">{sidebar}</aside>
    </div>
  );
}
