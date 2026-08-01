import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostToc } from '@/components/post/PostToc';
import { ContentSidebar, getLatestPosts } from '@/components/sidebar/ContentSidebar';
import { ContentWithSidebar } from '@/components/sidebar/ContentWithSidebar';
import type { Post } from '@/lib/content/posts';

const post = (overrides: Partial<Post>): Post => ({
  slug: 'post',
  lang: 'en',
  title: 'Post',
  date: '2026-01-01',
  excerpt: '',
  category: 'Tech',
  tags: [],
  featured: false,
  sticky: false,
  draft: false,
  type: 'tech',
  body: '',
  readingTimeMinutes: 1,
  headings: [],
  ...overrides,
});

describe('ContentSidebar', () => {
  it('orders latest posts by date regardless of sticky status', () => {
    const latestPosts = getLatestPosts([
      post({ slug: 'sticky-old', title: 'Sticky old', date: '2026-01-01', sticky: true }),
      post({ slug: 'new', title: 'New', date: '2026-02-01' }),
    ]);

    expect(latestPosts.map((item) => item.slug)).toEqual(['new', 'sticky-old']);
  });

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

  it('renders an embedded table of contents without a second frame', () => {
    render(<PostToc headings={[{ id: 'intro', text: 'Introduction', level: 2 }]} variant="embedded" />);

    const toc = screen.getByRole('navigation');
    expect(toc).toHaveClass('block');
    expect(toc).not.toHaveClass('hidden', 'border', 'p-4', 'rounded-lg');
  });

  it('does not make the composite sidebar sticky', () => {
    const { container } = render(
      <ContentWithSidebar sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </ContentWithSidebar>,
    );

    expect(container.querySelector('aside')).not.toHaveClass('sticky');
    expect(container.querySelector('aside')).not.toHaveClass('lg:sticky');
  });
});
