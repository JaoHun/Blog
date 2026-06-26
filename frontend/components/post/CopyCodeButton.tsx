'use client';

type CopyCodeButtonProps = {
  code: string;
};

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  return (
    <button
      className="rounded border border-border px-2 py-1 text-xs text-muted transition hover:text-foreground"
      onClick={() => void navigator.clipboard.writeText(code)}
      type="button"
    >
      复制
    </button>
  );
}
