import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';

import Moments from './page';

describe('Moments', () => {
  it('renders published essay posts', async () => {
    render(await Moments());

    expect(screen.getByRole('heading', { name: '生活随笔与影像记录' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '川西游' })).toHaveAttribute(
      'src',
      expect.stringContaining('/images/moments/2024年11月17日-毕棚沟途中.jpg'),
    );
    expect(screen.getByText('影像记录')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看记录' })).toHaveAttribute('href', '/posts/bipenggou-2024');
    expect(screen.getByRole('link', { name: '#旅行' })).toHaveAttribute('href', '/tags/旅行');
    expect(screen.getByText('记录一次毕棚沟游玩的照片和片段，从早上的雾气、小雨和小雪，到山顶完全放晴后的风景变化。')).toBeInTheDocument();
  });
});
