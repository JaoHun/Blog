import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mdxComponents } from '@/components/post/MdxComponents';

describe('mdxComponents', () => {
  it('renders reading-friendly blockquote, lists, and inline code', () => {
    const Blockquote = mdxComponents.blockquote;
    const Ul = mdxComponents.ul;
    const Ol = mdxComponents.ol;
    const Li = mdxComponents.li;
    const Code = mdxComponents.code;

    render(
      <>
        <Blockquote>Important note</Blockquote>
        <Ul>
          <Li>Unordered item</Li>
        </Ul>
        <Ol>
          <Li>Ordered item</Li>
        </Ol>
        <Code>inlineCode</Code>
      </>,
    );

    expect(screen.getByText('Important note')).toHaveClass('border-l-4');
    expect(screen.getByText('Unordered item').parentElement).toHaveClass('list-disc');
    expect(screen.getByText('Ordered item').parentElement).toHaveClass('list-decimal');
    expect(screen.getByText('inlineCode')).toHaveClass('rounded');
  });
});
