import type { ReactElement, ReactNode } from 'react';

import { CopyCodeButton } from '@/components/post/CopyCodeButton';

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

type CodeBlockProps = {
  children: ReactNode;
};

export function CodeBlock({ children }: CodeBlockProps) {
  const code = textFromNode(children).replace(/\n$/, '');
  const lines = code.split('\n');

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-code-bg">
      <div className="flex justify-end border-b border-border px-3 py-2">
        <CopyCodeButton code={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-code-fg">
        <code>
          {lines.map((line, index) => (
            <span className="block" key={`${index}-${line}`}>
              <span className="mr-4 select-none text-muted">{index + 1}</span>
              {line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
