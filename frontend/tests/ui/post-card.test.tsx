import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostCard } from '@/components/post/PostCard';
import type { Post } from '@/lib/content/posts';

const post = (overrides: Partial<Post> = {}): Post => ({
  body: '',
  category: 'Life',
  date: '2026-08-08',
  draft: false,
  excerpt: 'A short photo essay used to verify the shared post card.',
  featured: false,
  headings: [],
  lang: 'en',
  readingTimeMinutes: 1,
  slug: 'covered-post',
  sticky: false,
  tags: ['life', 'photo'],
  title: 'Covered Post',
  type: 'essay',
  ...overrides,
});

describe('PostCard', () => {
  it('renders a linked cover when the post defines one', () => {
    render(
      <PostCard
        lang="en"
        post={post({ cover: '/images/posts/covered-post/cover.jpg' })}
      />,
    );

    const image = screen.getByRole('img', { name: 'Covered Post' });

    expect(image).toHaveAttribute('src', '/images/posts/covered-post/cover.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveClass(
      'transition-transform',
      'motion-reduce:transition-none',
      'motion-reduce:hover:scale-100',
    );
    expect(image.closest('a')).toHaveAttribute('href', '/en/posts/covered-post');
    expect(image.closest('article')).toHaveClass('rounded-lg', 'bg-background/72', 'shadow-sm');
  });

  it('keeps the text-only card when the post has no cover', () => {
    render(<PostCard lang="en" post={post()} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Covered Post' })).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveClass('rounded-lg', 'p-5');
  });
});
