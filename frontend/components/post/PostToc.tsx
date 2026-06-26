import type { Post } from '@/lib/content/posts';

type PostTocProps = {
  headings: Post['headings'];
};

export function PostToc({ headings }: PostTocProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label="文章目录" className="rounded-lg border border-border p-4 text-sm">
      <p className="font-medium text-foreground">目录</p>
      <ul className="mt-3 space-y-2 text-muted">
        {headings.map((heading) => (
          <li className={heading.level === 3 ? 'pl-4' : undefined} key={heading.id}>
            <a className="hover:text-foreground" href={`#${heading.id}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
