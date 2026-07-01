import { describe, expect, it } from 'vitest';

import { resolveSiteUrl } from '@/config/site-url';

describe('resolveSiteUrl', () => {
  it('uses SITE_URL when provided', () => {
    expect(
      resolveSiteUrl({
        SITE_URL: 'http://203.0.113.10',
      }),
    ).toBe('http://203.0.113.10');
  });

  it('falls back to the Vercel preview URL when SITE_URL is not provided', () => {
    expect(resolveSiteUrl({})).toBe('https://blog-nu-wine-76.vercel.app');
    expect(resolveSiteUrl({ SITE_URL: '   ' })).toBe('https://blog-nu-wine-76.vercel.app');
  });
});
