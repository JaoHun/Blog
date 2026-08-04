import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HomeSidebar } from '@/components/sidebar/HomeSidebar';

describe('HomeSidebar', () => {
  it('renders the Chinese sidebar content and links', () => {
    render(<HomeSidebar lang="zh" stats={{ categories: 2, posts: 4, tags: 7 }} />);

    expect(decodeURIComponent(screen.getByAltText('JaoHun avatar').getAttribute('src') ?? '')).toContain(
      '/images/avatar/jaohun-avatar.png',
    );
    expect(screen.getByRole('heading', { name: 'JaoHun' })).toBeInTheDocument();
    expect(screen.getByText('当前关注')).toBeInTheDocument();
    expect(screen.getByText('不断学习了解新技术，关注 Agent 智能体、大模型开发、技术笔记和项目复盘。')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '技术笔记与项目记录' })).toHaveAttribute('href', '/tech');
    expect(screen.getByRole('link', { name: '关于我' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/JaoHun');
  });

  it('renders localized English internal links', () => {
    render(<HomeSidebar lang="en" stats={{ categories: 2, posts: 4, tags: 7 }} />);

    expect(screen.getByLabelText('Personal sidebar').tagName).toBe('DIV');
    expect(screen.getByText('Current focus')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Technical notes and project records' })).toHaveAttribute(
      'href',
      '/en/tech',
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/en/about');
  });

  it('renders published content stats in the personal card', () => {
    render(<HomeSidebar lang="en" stats={{ categories: 2, posts: 4, tags: 7 }} />);

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });
});
