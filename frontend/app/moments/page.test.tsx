import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';

import Moments from './page';

describe('Moments', () => {
  it('renders the moments page with an empty state before essay posts exist', async () => {
    render(await Moments());

    expect(screen.getByRole('heading', { name: '生活随笔与影像记录' })).toBeInTheDocument();
    expect(screen.getByText('还没有发布生活随笔')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '浏览全部文章' })).toHaveAttribute('href', '/posts');
  });
});
