import { ExternalLink } from '@/components/common/ExternalLink';
import { authorConfig } from '@/config/author';
import { footerConfig } from '@/config/footer';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          (c) {new Date().getFullYear()} {siteConfig.name}. {footerConfig.copyright}
        </p>
        <div className="flex flex-wrap gap-4">
          {footerConfig.icpText ? (
            footerConfig.icpHref ? (
              <ExternalLink className="transition hover:text-foreground" href={footerConfig.icpHref}>
                {footerConfig.icpText}
              </ExternalLink>
            ) : (
              <span>{footerConfig.icpText}</span>
            )
          ) : null}
          {footerConfig.links.map((link) => (
            <ExternalLink className="transition hover:text-foreground" href={link.href} key={link.href}>
              {link.label}
            </ExternalLink>
          ))}
          {authorConfig.links.map((link) => (
            <ExternalLink className="transition hover:text-foreground" href={link.href} key={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
