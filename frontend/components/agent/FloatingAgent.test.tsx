import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FloatingAgent } from './FloatingAgent';

const usePathname = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}));

describe('FloatingAgent', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    usePathname.mockReset();
  });

  it('opens a fixed floating chat and preserves messages after closing', async () => {
    usePathname.mockReturnValue('/');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: '博客里有 JaoHun Blog 项目。' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<FloatingAgent />);

    const launcher = screen.getByRole('button', { name: 'Agent' });
    expect(launcher).toHaveClass('fixed', 'z-50');

    await userEvent.click(launcher);

    const dialog = screen.getByRole('dialog', { name: 'JaoHun Blog Agent' });
    expect(dialog).toHaveClass('fixed', 'z-50');

    await userEvent.type(within(dialog).getByLabelText('消息'), '你博客里有哪些项目？');
    await userEvent.click(within(dialog).getByRole('button', { name: '发送' }));

    expect(await within(dialog).findByText('博客里有 JaoHun Blog 项目。')).toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole('button', { name: '关闭 JaoHun Blog Agent' }));
    expect(screen.queryByRole('dialog', { name: 'JaoHun Blog Agent' })).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Agent' }));
    expect(await screen.findByText('博客里有 JaoHun Blog 项目。')).toBeInTheDocument();
  });

  it.each(['/agent', '/en/agent'])('does not render on the full page agent route %s', (pathname) => {
    usePathname.mockReturnValue(pathname);

    render(<FloatingAgent />);

    expect(screen.queryByRole('button', { name: 'Agent' })).toBeNull();
    expect(screen.queryByRole('dialog', { name: 'JaoHun Blog Agent' })).toBeNull();
  });
});
