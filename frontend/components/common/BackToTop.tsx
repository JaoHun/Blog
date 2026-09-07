'use client';

import { useEffect, useState } from 'react';

const visibilityOffset = 320;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setVisible(window.scrollY > visibilityOffset);
    }

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateVisibility);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      aria-label="Back to top"
      className="fixed bottom-20 right-6 z-30 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium shadow-sm transition hover:border-accent"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      type="button"
    >
      Top
    </button>
  );
}
