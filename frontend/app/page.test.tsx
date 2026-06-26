import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('Home', () => {
  it('renders the blog positioning heading', async () => {
    render(await Home());

    expect(
      screen.getByRole('heading', {
        name: '个人技术笔记与项目记录',
      }),
    ).toBeTruthy();
  });
});
