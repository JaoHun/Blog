import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';

import Projects from './page';

describe('Projects', () => {
  it('renders the baseline project collection', () => {
    render(<Projects />);

    expect(screen.getByRole('heading', { name: '项目' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'JaoHun Blog' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Agent 与大模型学习记录' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '生活影像记录' })).toBeInTheDocument();
  });
});
