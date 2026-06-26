import type { ReactElement, ReactNode } from 'react';

import { CopyCodeButton } from '@/components/post/CopyCodeButton';
import { highlightCode } from '@/lib/content/highlight';

function textFromNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textFromNode).join('');
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return textFromNode((node as ReactElement<{ children?: ReactNode }>).props.children);
  }

  return '';
}

function languageFromNode(node: ReactNode): string {
  if (Array.isArray(node)) {
    return node.map(languageFromNode).find(Boolean) ?? 'text';
  }

  if (node && typeof node === 'object' && 'props' in node) {
    const className = (node as ReactElement<{ className?: string }>).props.className ?? '';
    const match = className.match(/language-([\w-]+)/);

    return match?.[1] ?? 'text';
  }

  return 'text';
}

type CodeBlockProps = {
  children: ReactNode;
};

export async function CodeBlock({ children }: CodeBlockProps) {
  const code = textFromNode(children).replace(/\n$/, '');
  const language = languageFromNode(children);
  const html = await highlightCode(code, language);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-code-bg">
      <div className="flex justify-end border-b border-border px-3 py-2">
        <CopyCodeButton code={code} />
      </div>
      <div className="code-highlight overflow-x-auto p-4 text-sm leading-6" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
