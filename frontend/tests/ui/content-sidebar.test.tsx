import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ContentSidebar } from '@/components/sidebar/ContentSidebar';

describe('ContentSidebar', () => {
  it('renders the Chinese author, note, stats, and latest posts', async () => {
    render(await ContentSidebar({ lang: 'zh' }));

    expect(screen.getByText('JaoHun')).toBeInTheDocument();
    expect(screen.getByText('慢慢记录，保持清醒。')).toBeInTheDocument();
    expect(screen.getByText('内容统计')).toBeInTheDocument();
    expect(screen.getByText('最新文章')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/JaoHun');
    expect(screen.getByRole('link', { name: '构建一个轻量静态博客 MVP' })).toHaveAttribute(
      'href',
      '/posts/static-blog-mvp',
    );
  });

  it('renders nested contents passed to the sidebar', async () => {
    render(
      await ContentSidebar({
        lang: 'en',
        children: (
          <nav aria-label="Contents">
            <a href="#intro">Introduction</a>
          </nav>
        ),
      }),
    );

    expect(screen.getByRole('navigation', { name: 'Contents' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Introduction' })).toHaveAttribute('href', '#intro');
  });
});
