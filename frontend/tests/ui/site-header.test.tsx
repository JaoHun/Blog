import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteHeader } from '@/components/layout/SiteHeader';

const usePathname = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}));

describe('SiteHeader', () => {
  it('renders a compact English switch on Chinese pages', () => {
    usePathname.mockReturnValue('/');

    render(<SiteHeader />);

    expect(screen.getByRole('link', { name: '随笔' })).toHaveAttribute('href', '/moments');
    expect(screen.getByRole('link', { name: 'Agent' })).toHaveAttribute('href', '/agent');
    expect(screen.getByRole('navigation', { name: '主导航' })).toHaveClass('overflow-x-auto');
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
    expect(screen.queryByRole('link', { name: 'English' })).toBeNull();
  });

  it('renders a compact Chinese switch on English pages', () => {
    usePathname.mockReturnValue('/en');

    render(<SiteHeader />);

    expect(screen.getByRole('link', { name: 'Moments' })).toHaveAttribute('href', '/en/moments');
    expect(screen.getByRole('link', { name: 'Agent' })).toHaveAttribute('href', '/en/agent');
    expect(screen.getByRole('link', { name: '中' })).toHaveAttribute('href', '/');
  });
});
