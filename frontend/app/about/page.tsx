import type { Metadata } from 'next';

import { ExternalLink } from '@/components/common/ExternalLink';
import { authorConfig } from '@/config/author';

export const metadata: Metadata = {
  title: 'About',
  description: authorConfig.bio,
};

export default function AboutPage() {
  return (
    <section className="max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">About</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{authorConfig.name}</h1>
      <p className="mt-5 leading-8 text-muted">{authorConfig.bio}</p>
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Contact</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-link">
          {authorConfig.links.map((link) => (
            <ExternalLink href={link.href} key={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}
