import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { ExternalLink } from '@/components/common/ExternalLink';
import { ProjectCard } from '@/components/project/ProjectCard';
import { CodeBlock } from '@/components/post/CodeBlock';

function headingId(value: ReactNode) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function Callout({ children }: { children: ReactNode }) {
  return <aside className="my-6 rounded-lg border border-border bg-code-bg p-4">{children}</aside>;
}

function PostImage(props: ComponentPropsWithoutRef<'img'>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} className="my-6 rounded-lg border border-border" loading="lazy" />
  );
}

export const mdxComponents = {
  a: ({ href = '', children }: ComponentPropsWithoutRef<'a'>) =>
    href.startsWith('http') ? (
      <ExternalLink href={href}>{children}</ExternalLink>
    ) : (
      <a href={href}>{children}</a>
    ),
  aside: Callout,
  Callout,
  code: ({ children }: { children?: ReactNode }) => <code>{children}</code>,
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight" id={headingId(children)}>
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight" id={headingId(children)}>
      {children}
    </h3>
  ),
  img: PostImage,
  p: ({ children }: { children?: ReactNode }) => <p className="my-5 leading-8 text-muted">{children}</p>,
  pre: CodeBlock,
  ProjectCard,
};
