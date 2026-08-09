import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Posts from './page';

vi.mock('@/components/sidebar/ContentSidebar', () => ({
  ContentSidebar: ({ children }: { children?: React.ReactNode }) => <aside>{children}</aside>,
}));

describe('Posts', () => {
  it('renders the post index with a framed intro and card list', async () => {
    const { container } = render(await Posts());
    const heading = screen.getByRole('heading', { name: '文章' });
    const intro = heading.closest('div');

    expect(intro).toHaveClass('rounded-lg', 'bg-background/60', 'shadow-sm');
    expect(container.querySelector('[data-testid="post-list"]')).toHaveClass('space-y-4');
    expect(screen.getByRole('heading', { name: '为什么搭建这个个人博客' }).closest('article')).toHaveClass(
      'rounded-lg',
      'bg-background/72',
    );
  });
});
