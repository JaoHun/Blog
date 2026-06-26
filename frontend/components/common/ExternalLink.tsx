import type { AnchorHTMLAttributes, ReactNode } from 'react';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a {...props} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}
