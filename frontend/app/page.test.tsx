import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('Home', () => {
  it('renders the personal sharing heading and technical section link', async () => {
    render(await Home());

    expect(
      screen.getByRole('heading', {
        name: '个人杂谈与分享',
      }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: /进入技术板块/ })).toBeTruthy();
  });
});
