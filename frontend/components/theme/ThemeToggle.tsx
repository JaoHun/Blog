'use client';

import { useState } from 'react';

import { applyThemePreference } from '@/components/theme/ThemeProvider';

type ThemePreference = 'system' | 'dark' | 'light';

const cycle: ThemePreference[] = ['system', 'dark', 'light'];

const labelByPreference: Record<ThemePreference, string> = {
  system: 'System',
  dark: 'Dark',
  light: 'Light',
};

function nextPreference(current: ThemePreference) {
  const index = cycle.indexOf(current);
  return cycle[(index + 1) % cycle.length];
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    const stored = localStorage.getItem('theme') as ThemePreference | null;

    return stored && cycle.includes(stored) ? stored : 'system';
  });

  function toggleTheme() {
    const next = nextPreference(preference);
    setPreference(next);
    localStorage.setItem('theme', next);
    applyThemePreference(next);
  }

  return (
    <button
      aria-label={`Theme preference: ${labelByPreference[preference]}`}
      className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:text-foreground"
      onClick={toggleTheme}
      type="button"
    >
      {labelByPreference[preference]}
    </button>
  );
}
