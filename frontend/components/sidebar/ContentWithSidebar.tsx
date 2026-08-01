import type { ReactNode } from 'react';

type ContentWithSidebarProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export function ContentWithSidebar({ children, sidebar }: ContentWithSidebarProps): JSX.Element {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <main className="min-w-0">{children}</main>
      <aside className="min-w-0">{sidebar}</aside>
    </div>
  );
}
