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

    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
    expect(screen.queryByRole('link', { name: 'English' })).toBeNull();
  });

  it('renders a compact Chinese switch on English pages', () => {
    usePathname.mockReturnValue('/en');

    render(<SiteHeader />);

    expect(screen.getByRole('link', { name: '中' })).toHaveAttribute('href', '/');
  });
});

