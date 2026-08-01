import type { Lang, Post } from '@/lib/content/posts';
import { messages } from '@/lib/i18n';

type PostTocProps = {
  headings: Post['headings'];
  lang?: Lang;
  variant?: 'default' | 'embedded';
};

export function PostToc({ headings, lang = 'zh', variant = 'default' }: PostTocProps) {
  if (headings.length === 0) {
    return null;
  }

  const className = variant === 'embedded' ? 'block text-sm' : 'hidden rounded-lg border border-border p-4 text-sm lg:block';

  return (
    <nav aria-label={messages[lang].toc} className={className}>
      <p className="font-medium text-foreground">{messages[lang].toc}</p>
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
