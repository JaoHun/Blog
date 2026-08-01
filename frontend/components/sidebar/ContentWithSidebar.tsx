import type { ReactElement, ReactNode } from 'react';

type ContentWithSidebarProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export function ContentWithSidebar({ children, sidebar }: ContentWithSidebarProps): ReactElement {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0">{children}</div>
      <aside className="space-y-5">{sidebar}</aside>
    </div>
  );
}
