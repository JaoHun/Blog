import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { ThemeToggle } from '@/components/theme/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('cycles and persists theme preference', async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /theme/i });

    await userEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');

    await userEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});

describe('global theme palette', () => {
  it('defines the required warm light and dark palette tokens', () => {
    const globalsCss = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

    const requiredTokens = [
      '--background: #faf7f2',
      '--foreground: #2f2a25',
      '--muted: #6f665d',
      '--border: #9a8876',
      '--link: #2f6f9f',
      '--code-bg: #f3eee7',
      '--code-fg: #1f2933',
      '--accent: #2f6f9f',
      '--background: #181715',
      '--foreground: #eee9e2',
      '--muted: #b8afa4',
      '--border: #75695e',
      '--link: #8ab6d6',
      '--code-bg: #211f1c',
      '--code-fg: #f8f4ee',
      '--accent: #8ab6d6',
    ];

    for (const token of requiredTokens) {
      expect(globalsCss).toContain(token);
    }
  });

  it('maps code-surface tokens to Tailwind color utilities', () => {
    const globalsCss = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

    expect(globalsCss).toContain('--color-code-bg: var(--code-bg)');
    expect(globalsCss).toContain('--color-code-fg: var(--code-fg)');
  });
});
