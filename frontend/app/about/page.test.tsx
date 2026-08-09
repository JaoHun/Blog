import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import About from './page';

describe('About', () => {
  it('renders framed profile, skills, and contact sections', () => {
    const { container } = render(<About />);

    expect(screen.getByRole('heading', { name: 'JaoHun' }).closest('section')).toHaveClass(
      'rounded-lg',
      'bg-background/60',
      'shadow-sm',
    );
    expect(screen.getByRole('heading', { name: '技能栈' }).closest('section')).toHaveClass(
      'rounded-lg',
      'bg-background/72',
    );
    expect(screen.getByRole('heading', { name: '联系方式' }).closest('section')).toHaveClass(
      'rounded-lg',
      'bg-background/72',
    );
    expect(container.querySelector('[data-testid="about-layout"]')).toHaveClass('grid', 'gap-5');
  });
});
