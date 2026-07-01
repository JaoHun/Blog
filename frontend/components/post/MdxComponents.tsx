import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { ExternalLink } from '@/components/common/ExternalLink';
import { ProjectCard } from '@/components/project/ProjectCard';
import { CodeBlock } from '@/components/post/CodeBlock';
import { PostImage } from '@/components/post/PostImage';

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

export const mdxComponents = {
  a: ({ href = '', children }: ComponentPropsWithoutRef<'a'>) =>
    href.startsWith('http') ? (
      <ExternalLink href={href}>{children}</ExternalLink>
    ) : (
      <a href={href}>{children}</a>
    ),
  aside: Callout,
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-6 border-l-4 border-accent bg-code-bg px-5 py-3 leading-8 text-muted">
      {children}
    </blockquote>
  ),
  Callout,
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded border border-border bg-code-bg px-1.5 py-0.5 font-mono text-[0.92em] text-foreground">
      {children}
    </code>
  ),
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
  img: (props: ComponentPropsWithoutRef<'img'>) => (
    <PostImage {...props} alt={typeof props.alt === 'string' ? props.alt : ''} />
  ),
  li: ({ children }: { children?: ReactNode }) => <li className="pl-1 leading-8">{children}</li>,
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-muted">{children}</ol>
  ),
  p: ({ children }: { children?: ReactNode }) => <p className="my-5 leading-8 text-muted">{children}</p>,
  pre: CodeBlock,
  ProjectCard,
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-muted">{children}</ul>
  ),
};
