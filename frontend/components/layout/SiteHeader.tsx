'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { localizedPath, messages } from '@/lib/i18n';
import type { Lang } from '@/lib/content/posts';

const navKeys = ['home', 'tech', 'posts', 'categories', 'tags', 'about'] as const;
const navPaths = {
  home: '/',
  tech: '/tech',
  posts: '/posts',
  categories: '/categories',
  tags: '/tags',
  projects: '/projects',
  about: '/about',
};

function currentLang(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

function toggleLanguagePath(pathname: string, lang: Lang) {
  const pathWithoutLang = pathname.replace(/^\/en/, '') || '/';

  if (pathWithoutLang.startsWith('/categories/')) {
    return lang === 'zh' ? '/en/categories' : '/categories';
  }

  if (pathWithoutLang.startsWith('/tags/')) {
    return lang === 'zh' ? '/en/tags' : '/tags';
  }

  if (lang === 'zh') {
    return pathname === '/' ? '/en' : `/en${pathname}`;
  }

  return pathWithoutLang;
}

export function SiteHeader() {
  const pathname = usePathname();
  const lang = currentLang(pathname);
  const t = messages[lang];

  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-base font-semibold text-foreground" href={localizedPath('/', lang)}>
          {siteConfig.name}
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <nav aria-label={lang === 'zh' ? '主导航' : 'Main navigation'} className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {navKeys.map((key) => (
              <Link className="transition hover:text-foreground" href={localizedPath(navPaths[key], lang)} key={key}>
                {t.nav[key]}
              </Link>
            ))}
          </nav>
          <Link className="text-xs text-muted transition hover:text-foreground" href={toggleLanguagePath(pathname, lang)}>
            {lang === 'zh' ? 'English' : '中文'}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
