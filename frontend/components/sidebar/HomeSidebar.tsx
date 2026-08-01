import type { ReactElement } from 'react';
import Link from 'next/link';

import { ExternalLink } from '@/components/common/ExternalLink';
import { authorConfig, getAuthorBio } from '@/config/author';
import type { Lang } from '@/lib/content/posts';
import { localizedPath, messages } from '@/lib/i18n';

type HomeSidebarProps = {
  lang: Lang;
};

export function HomeSidebar({ lang }: HomeSidebarProps): ReactElement {
  const t = messages[lang].homeSidebar;
  const githubLink = authorConfig.links.find((link) => link.label === 'GitHub');

  return (
    <aside aria-label={t.label} className="space-y-5 text-sm">
      <section className="rounded-lg border border-border bg-background/70 p-5">
        <h2 className="text-base font-semibold">{authorConfig.name}</h2>
        <p className="mt-3 leading-6 text-muted">{getAuthorBio(lang)}</p>
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
          {githubLink ? (
            <li>
              <ExternalLink className="transition hover:text-link" href={githubLink.href}>
                {t.github}
              </ExternalLink>
            </li>
          ) : null}
        </ul>
      </nav>
    </aside>
  );
}
