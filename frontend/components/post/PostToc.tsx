import type { Post } from '@/lib/content/posts';

type PostTocProps = {
  headings: Post['headings'];
};

export function PostToc({ headings }: PostTocProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents" className="hidden rounded-lg border border-border p-4 text-sm lg:block">
      <p className="font-medium text-foreground">Contents</p>
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
