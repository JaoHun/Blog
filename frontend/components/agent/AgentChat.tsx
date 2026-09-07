'use client';

import { FormEvent, KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

type ChatResponse = {
  reply?: string;
};

type AgentChatProps = {
  variant?: 'page' | 'floating';
};

const fallbackApiUrl = 'http://127.0.0.1:8000';

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_AGENT_API_URL || fallbackApiUrl).replace(/\/$/, '');
}

export function AgentChat({ variant = 'page' }: AgentChatProps) {
  const messageInputId = useId();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: '你好，我可以根据这个博客里的真实文章和项目回答问题。',
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endpoint = useMemo(() => `${apiBaseUrl()}/chat`, []);
  const isFloating = variant === 'floating';

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ block: 'end' });
  }, [messages, isSending, error]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage();
  }

  async function sendMessage() {
    const message = input.trim();

    if (!message || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput('');
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      const data = (await response.json()) as ChatResponse;
      const reply = data.reply?.trim();

      if (!reply) {
        throw new Error('Chat response did not include a reply');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: reply,
        },
      ]);
    } catch {
      setError('后端暂时没有返回可用回答，请稍后再试。');
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void sendMessage();
  }

  return (
    <section className={isFloating ? 'flex min-h-0 flex-1 flex-col' : 'grid gap-5'}>
      <div className={isFloating ? 'flex min-h-0 flex-1 flex-col border-b border-border' : 'rounded-lg border border-border bg-background/72 shadow-sm'}>
        {!isFloating ? (
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <p className="text-sm font-medium text-foreground">JaoHun Blog Agent</p>
            <p className="mt-1 text-xs text-muted">连接本地 FastAPI /chat，回答会经过后端 Agent 和博客真实数据。</p>
          </div>
        ) : null}
        <div
          className={isFloating ? 'grid min-h-0 flex-1 content-start gap-3 overflow-y-auto p-4' : 'grid max-h-[56vh] min-h-[22rem] content-start gap-3 overflow-y-auto p-4 sm:p-5'}
          aria-live="polite"
        >
          {messages.map((message) => (
            <div
              className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              key={message.id}
            >
              <p
                className={[
                  'max-w-[88%] whitespace-pre-wrap rounded-lg border px-4 py-3 text-sm leading-6 shadow-sm',
                  message.role === 'user'
                    ? 'border-accent bg-accent text-background'
                    : 'border-border bg-background/80 text-foreground',
                ].join(' ')}
              >
                {message.content}
              </p>
            </div>
          ))}
          {isSending ? <p className="text-sm text-muted">正在等待 Agent 回答...</p> : null}
          {error ? <p className="text-sm text-muted">{error}</p> : null}
          <div ref={bottomRef} />
        </div>
      </div>

      <form className={isFloating ? 'bg-background/95 p-3' : 'rounded-lg border border-border bg-background/72 p-4 shadow-sm sm:p-5'} onSubmit={handleSubmit}>
        <label className="text-sm font-medium text-foreground" htmlFor={messageInputId}>
          消息
        </label>
        <div className={isFloating ? 'mt-2 grid grid-cols-[minmax(0,1fr)_4.5rem] gap-2' : 'mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_6rem]'}>
          <textarea
            className={isFloating ? 'max-h-28 min-h-14 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus:border-accent' : 'min-h-24 resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus:border-accent'}
            disabled={isSending}
            id={messageInputId}
            onKeyDown={handleKeyDown}
            onChange={(event) => setInput(event.target.value)}
            placeholder="例如：你博客里有哪些项目？"
            value={input}
          />
          <button
            className="h-11 rounded-md bg-accent px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:self-end"
            disabled={isSending || !input.trim()}
            type="submit"
          >
            发送
          </button>
        </div>
      </form>
    </section>
  );
}
