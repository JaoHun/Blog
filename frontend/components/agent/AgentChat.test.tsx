import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AgentChat } from './AgentChat';

describe('AgentChat', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a message to the FastAPI chat endpoint and renders the reply', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: '博客里有 JaoHun Blog 项目。' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<AgentChat />);

    await userEvent.type(screen.getByLabelText('消息'), '你博客里有哪些项目？');
    await userEvent.click(screen.getByRole('button', { name: '发送' }));

    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '你博客里有哪些项目？',
      }),
    });
    expect(await screen.findByText('博客里有 JaoHun Blog 项目。')).toBeInTheDocument();
    expect(screen.getByLabelText('消息')).toHaveValue('');
  });

  it('keeps the user message visible when the backend request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    render(<AgentChat />);

    await userEvent.type(screen.getByLabelText('消息'), '你好');
    await userEvent.click(screen.getByRole('button', { name: '发送' }));

    expect(await screen.findByText('你好')).toBeInTheDocument();
    expect(await screen.findByText('后端暂时没有返回可用回答，请稍后再试。')).toBeInTheDocument();
  });

  it('submits with Enter but keeps Shift Enter as a newline', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: '收到。' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<AgentChat />);

    const input = screen.getByLabelText('消息');

    await userEvent.type(input, '第一行');
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    await userEvent.type(input, '第二行');

    expect(fetchMock).not.toHaveBeenCalled();
    expect(input).toHaveValue('第一行\n第二行');

    await userEvent.keyboard('{Enter}');

    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8000/chat', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        message: '第一行\n第二行',
      }),
    }));
    expect(await screen.findByText('收到。')).toBeInTheDocument();
  });
});
