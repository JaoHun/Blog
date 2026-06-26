import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BackToTop } from '@/components/common/BackToTop';
import { PostImage } from '@/components/post/PostImage';

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
});
