'use client';

import { useEffect, type ReactNode } from 'react';

function systemTheme() {
  if (typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyThemePreference(preference: string | null) {
  const theme = preference && preference !== 'system' ? preference : systemTheme();
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyThemePreference(localStorage.getItem('theme') ?? 'system');
  }, []);

  return children;
}
