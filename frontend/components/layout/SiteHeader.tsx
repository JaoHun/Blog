import Link from 'next/link';

import { navConfig } from '@/config/nav';
import { siteConfig } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-base font-semibold text-foreground" href="/">
          {siteConfig.name}
        </Link>
        <nav aria-label="主导航" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {navConfig.map((item) => (
            <Link className="transition hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
