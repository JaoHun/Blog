import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';

import Projects from './page';

describe('Projects', () => {
  it('renders the baseline project collection', () => {
    const { container } = render(<Projects />);

    expect(screen.getByRole('heading', { name: '项目' }).closest('div')).toHaveClass(
      'rounded-lg',
      'bg-background/60',
      'shadow-sm',
    );
    expect(container.querySelector('[data-testid="project-list"]')).toHaveClass('grid', 'gap-5');
    expect(screen.getByRole('heading', { name: 'JaoHun Blog' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'JaoHun Blog' }).closest('article')).toHaveClass(
      'bg-background/72',
      'shadow-sm',
    );
    expect(screen.getByRole('heading', { name: 'Agent 与大模型学习记录' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '生活影像记录' })).toBeInTheDocument();
  });
});
