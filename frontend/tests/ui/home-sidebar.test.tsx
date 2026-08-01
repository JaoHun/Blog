import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HomeSidebar } from '@/components/sidebar/HomeSidebar';

describe('HomeSidebar', () => {
  it('renders the Chinese sidebar content and links', () => {
    render(<HomeSidebar lang="zh" />);

    expect(screen.getByRole('heading', { name: 'JaoHun' })).toBeInTheDocument();
    expect(screen.getByText('当前关注')).toBeInTheDocument();
    expect(screen.getByText('慢慢记录日常、技术笔记和项目过程。')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '技术笔记与项目记录' })).toHaveAttribute('href', '/tech');
    expect(screen.getByRole('link', { name: '关于我' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/JaoHun');
  });

  it('renders localized English internal links', () => {
    render(<HomeSidebar lang="en" />);

    expect(screen.getByLabelText('Personal sidebar').tagName).toBe('DIV');
    expect(screen.getByText('Current focus')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Technical notes and project records' })).toHaveAttribute(
      'href',
      '/en/tech',
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/en/about');
  });
});
