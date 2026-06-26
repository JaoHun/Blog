import { authorConfig } from '@/config/author';
import { siteConfig } from '@/config/site';
import { ExternalLink } from '@/components/common/ExternalLink';

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Built for notes and projects.
        </p>
        <div className="flex flex-wrap gap-4">
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
