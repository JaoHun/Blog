import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BackToTop } from '@/components/common/BackToTop';
import { PostImage } from '@/components/post/PostImage';
import { PostPage } from '@/app/_localized-pages';

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <div data-testid="mdx-content">{source}</div>,
}));

vi.mock('@/components/sidebar/ContentSidebar', () => ({
  ContentSidebar: ({ children }: { children?: React.ReactNode }) => <aside>{children}</aside>,
}));

describe('reading experience components', () => {
  it('renders post images with lazy loading and required alt text', () => {
    render(<PostImage src="/images/posts/demo/cover.png" alt="Demo cover" />);

    const image = screen.getByRole('img', { name: 'Demo cover' });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('src', '/images/posts/demo/cover.png');
  });

  it('shows a back-to-top action after scrolling and scrolls to the page top', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: scrollTo });

    render(<BackToTop />);
    fireEvent.scroll(window);

    fireEvent.click(screen.getByRole('button', { name: /back to top/i }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('renders article pages with a constrained reading surface and card navigation', async () => {
    const { container } = render(await PostPage({ lang: 'zh', slug: 'static-blog-mvp' }));
    const article = container.querySelector('article');

    expect(article).toHaveClass('mx-auto', 'max-w-3xl', 'rounded-lg', 'bg-background/72');
    expect(screen.getByRole('heading', { name: '为什么搭建这个个人博客' })).toHaveClass('text-3xl', 'sm:text-4xl');
    expect(screen.getByText('记录各种随笔和想记的东西，也把学习 Agent 智能体、大模型开发、技术笔记和项目复盘的过程沉淀下来。')).toHaveClass('text-base', 'sm:text-lg');

    const adjacentNav = screen.getByRole('navigation', { name: '文章切换' });
    expect(adjacentNav).toHaveClass('grid', 'gap-3', 'sm:grid-cols-2');
  });
});
