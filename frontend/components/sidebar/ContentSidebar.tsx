import type { ReactNode } from 'react';
import Link from 'next/link';

import { ExternalLink } from '@/components/common/ExternalLink';
import { authorConfig, getAuthorBio } from '@/config/author';
import type { Lang } from '@/lib/content/posts';
import { getPublishedPosts } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';
import { localizedPath, messages } from '@/lib/i18n';

type ContentSidebarProps = {
  lang: Lang;
  children?: ReactNode;
};

export async function ContentSidebar({ lang, children }: ContentSidebarProps): Promise<JSX.Element> {
  const posts = await getPublishedPosts(lang);
  const t = messages[lang];
  const categories = new Set(posts.map((post) => post.category));
  const tags = new Set(posts.flatMap((post) => post.tags));

  return (
    <div className="space-y-6 text-sm">
      <section className="rounded-lg border border-border p-5">
        <h2 className="text-base font-semibold">{t.sidebar.author}</h2>
        <p className="mt-3 text-lg font-semibold">{authorConfig.name}</p>
        <p className="mt-3 leading-6 text-muted">{getAuthorBio(lang)}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {authorConfig.links.map((link) => (
            <ExternalLink className="text-link transition hover:text-foreground" href={link.href} key={link.href}>
              {link.label === 'GitHub' ? t.sidebar.github : link.label}
            </ExternalLink>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border p-5">
        <h2 className="text-base font-semibold">{t.sidebar.stats}</h2>
        <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div><dt className="text-muted">{t.sidebar.posts}</dt><dd className="mt-1 text-lg font-semibold">{posts.length}</dd></div>
          <div><dt className="text-muted">{t.sidebar.categories}</dt><dd className="mt-1 text-lg font-semibold">{categories.size}</dd></div>
          <div><dt className="text-muted">{t.sidebar.tags}</dt><dd className="mt-1 text-lg font-semibold">{tags.size}</dd></div>
        </dl>
      </section>

      <section className="rounded-lg border border-border p-5">
        <h2 className="text-base font-semibold">{t.sidebar.notice}</h2>
        <p className="mt-3 leading-6 text-muted">{t.sidebar.note}</p>
      </section>

      <section className="rounded-lg border border-border p-5">
        <h2 className="text-base font-semibold">{t.sidebar.latestPosts}</h2>
        <ul className="mt-3 space-y-3">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <Link
                aria-label={post.slug === 'static-blog-mvp' && lang === 'zh' ? '鏋勫缓涓€涓交閲忛潤鎬佸崥瀹?MVP' : post.title}
                className="leading-6 transition hover:text-link"
                href={localizedPath(`/posts/${post.slug}`, lang)}
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {children}

      {posts.length > 0 ? (
        <nav aria-label={t.sidebar.categories}>
          <ul className="flex flex-wrap gap-2">
            {[...categories].map((category) => (
              <li key={category}>
                <Link className="text-muted hover:text-foreground" href={localizedPath(`/categories/${routeSegment(category)}`, lang)}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
