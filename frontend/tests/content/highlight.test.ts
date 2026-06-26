import { describe, expect, it } from 'vitest';

import { highlightCode } from '@/lib/content/highlight';

describe('highlightCode', () => {
  it('renders Shiki HTML with token spans and preserves source code', async () => {
    const html = await highlightCode("const message = 'hello';", 'ts');

    expect(html).toContain('<pre');
    expect(html).toContain('<span');
    expect(html).toContain('message');
    expect(html).toContain('shiki-themes');
    expect(html).toContain('--shiki-light');
    expect(html).toContain('--shiki-dark');
  });

  it('falls back to plain text when the language is unknown', async () => {
    const html = await highlightCode('plain <value>', 'unknown-language');

    expect(html).toContain('plain');
    expect(html).toContain('&lt;value&gt;');
  });
});
