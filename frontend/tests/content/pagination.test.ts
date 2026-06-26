import { describe, expect, it } from 'vitest';

import { paginate } from '@/lib/content/pagination';

describe('paginate', () => {
  it('returns requested page items and total pages', () => {
    const result = paginate([1, 2, 3, 4, 5], 2, 2);

    expect(result).toEqual({
      items: [3, 4],
      currentPage: 2,
      totalPages: 3,
    });
  });

  it('clamps out-of-range pages', () => {
    expect(paginate([1, 2, 3], 99, 2).currentPage).toBe(2);
    expect(paginate([1, 2, 3], -1, 2).currentPage).toBe(1);
  });
});
