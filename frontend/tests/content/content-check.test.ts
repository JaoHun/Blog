import { describe, expect, it } from 'vitest';

import { collectWritingWarnings } from '@/scripts/content-check';
import type { Post } from '@/lib/content/posts';

function post(overrides: Partial<Post>): Post {
  return {
    body: '## Body',
    category: 'Writing',
    date: '2026-07-01',
    draft: false,
    excerpt: 'This is a normal excerpt for a technical writing note.',
    featured: false,
    headings: [],
    readingTimeMinutes: 1,
    slug: 'example-post',
    sticky: false,
    tags: ['writing'],
    title: 'Example Post',
    type: 'tech',
    ...overrides,
  };
}

describe('collectWritingWarnings', () => {
  it('warns about writing quality issues without blocking validation', () => {
    const warnings = collectWritingWarnings([
      post({
        excerpt: 'Too short.',
        tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
      }),
    ]);

    expect(warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining('excerpt is short'),
        expect.stringContaining('has 11 tags'),
        expect.stringContaining('has no cover'),
      ]),
    );
  });
});
