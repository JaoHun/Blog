import type { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ExternalLink } from '@/components/common/ExternalLink';
import { authorConfig, getAuthorBio } from '@/config/author';
import type { Lang } from '@/lib/content/posts';
import { localizedPath, messages } from '@/lib/i18n';

type HomeSidebarProps = {
  lang: Lang;
  stats: HomeSidebarStats;
};

export type HomeSidebarStats = {
  categories: number;
  posts: number;
  tags: number;
};

export function HomeSidebar({ lang, stats }: HomeSidebarProps): ReactElement {
  const t = messages[lang].homeSidebar;
  const sidebarText = messages[lang].sidebar;
  const githubLink = authorConfig.links.find((link) => link.label === 'GitHub');
  const statItems = [
    { label: sidebarText.posts, value: stats.posts },
    { label: sidebarText.categories, value: stats.categories },
    { label: sidebarText.tags, value: stats.tags },
  ];

  return (
    <div aria-label={t.label} className="space-y-5 text-sm">
      <section className="rounded-lg border border-border bg-background/80 p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none">
        <Image
          alt={`${authorConfig.name} avatar`}
          className="mx-auto mb-4 size-24 rounded-full object-cover shadow-sm ring-1 ring-border transition-transform duration-700 hover:rotate-[360deg] motion-reduce:transition-none motion-reduce:hover:rotate-0"
          height={96}
          src="/images/avatar/jaohun-avatar.png"
          width={96}
        />
        <h2 className="text-base font-semibold">{authorConfig.name}</h2>
        <p className="mt-3 leading-6 text-muted">{getAuthorBio(lang)}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-border py-4">
          {statItems.map((item) => (
            <div key={item.label}>
              <dt className="text-xs text-muted">{item.label}</dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>

        {githubLink ? (
          <ExternalLink
            className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2 font-medium text-background transition hover:opacity-90"
            href={githubLink.href}
          >
            {t.github}
          </ExternalLink>
        ) : null}
      </section>

      <section className="rounded-lg border border-border bg-background/70 p-5">
        <h2 className="text-base font-semibold">{t.focusTitle}</h2>
        <p className="mt-3 leading-6 text-muted">{t.focusDescription}</p>
      </section>

      <nav aria-label={t.linksTitle} className="rounded-lg border border-border bg-background/70 p-5">
        <h2 className="text-base font-semibold">{t.linksTitle}</h2>
        <ul className="mt-3 space-y-3">
          <li>
            <Link className="transition hover:text-link" href={localizedPath('/tech', lang)}>
              {t.tech}
            </Link>
          </li>
          <li>
            <Link className="transition hover:text-link" href={localizedPath('/about', lang)}>
              {t.about}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
