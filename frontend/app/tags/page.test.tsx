import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Tags from './page';
import { TagPage } from '@/app/_localized-pages';

describe('Tags', () => {
  it('renders the tag index with framed heading and refined tag chips', async () => {
    const { container } = render(await Tags());
    const heading = screen.getByRole('heading', { name: '标签' });

    expect(heading.closest('div')).toHaveClass('rounded-lg', 'bg-background/60', 'shadow-sm');
    expect(container.querySelector('[data-testid="tag-list"]')).toHaveClass('rounded-lg', 'bg-background/72');
    expect(screen.getByRole('link', { name: /#nextjs/ })).toHaveClass('rounded-full', 'bg-background/70');
  });

  it('renders a single tag page with the shared framed heading', async () => {
    render(await TagPage({ tag: 'nextjs', lang: 'zh' }));

    expect(screen.getByRole('heading', { name: '#nextjs' }).closest('div')).toHaveClass(
      'rounded-lg',
      'bg-background/60',
    );
    expect(screen.getByRole('heading', { name: '为什么搭建这个个人博客' })).toBeInTheDocument();
  });
});
