# Tech Content Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Linzy-inspired technical content sidebar to `/tech/`, `/posts/`, and `/posts/[slug]/` without changing the warm personal home page.

**Architecture:** Create one reusable server component for sidebar data and rendering, plus one layout wrapper for technical content pages. List pages use a two-column layout; article detail pages reuse the same sidebar and insert `PostToc` inside it so the page does not become three columns.

**Tech Stack:** Next.js App Router static export, React Server Components, TypeScript, existing MDX content utilities, Vitest, Testing Library.

## Global Constraints

- Do not add the sidebar to the home page in the first version.
- Apply the first version to `/tech/`, `/posts/`, and `/posts/[slug]/`.
- Do not add an avatar until a real avatar image is available.
- Do not add visitor statistics, comments, sticky animated sidebar, or complex mobile interactions.
- Use existing `authorConfig`, `getAuthorBio(lang)`, `getPublishedPosts(lang)`, and `PostToc`.
- Mobile layout must stack content first and sidebar below.
- Existing `content:check`, `test`, `lint`, `build`, and `launch:check` must pass.

---

## File Structure

- Create `frontend/components/sidebar/ContentSidebar.tsx`
  - Server component that renders author card, content stats, notice, latest posts, and optional children such as `PostToc`.
- Create `frontend/components/sidebar/ContentWithSidebar.tsx`
  - Small layout wrapper for desktop two-column layout and mobile stacking.
- Modify `frontend/lib/i18n.ts`
  - Add sidebar labels and notice copy for `zh` and `en`.
- Modify `frontend/app/_localized-pages.tsx`
  - Wrap `TechPage`, `PostsPage`, `PaginatedPostsPage`, and `PostPage` with the sidebar layout.
  - Replace the article detail standalone `aside` with `ContentSidebar` containing `PostToc`.
- Modify `frontend/scripts/launch-check.ts`
  - Assert that technical pages include sidebar markers such as author name, latest posts label, and notice.
- Add/modify tests:
  - Create `frontend/tests/ui/content-sidebar.test.tsx`.
  - Update existing page tests only if text expectations need adjustment.

---

### Task 1: Sidebar Component And Messages

**Files:**
- Create: `frontend/components/sidebar/ContentSidebar.tsx`
- Create: `frontend/components/sidebar/ContentWithSidebar.tsx`
- Modify: `frontend/lib/i18n.ts`
- Test: `frontend/tests/ui/content-sidebar.test.tsx`

**Interfaces:**
- Consumes:
  - `type Lang = 'zh' | 'en'` from `@/lib/content/posts`
  - `getPublishedPosts(lang: Lang): Promise<Post[]>`
  - `getAuthorBio(lang: Lang): string`
  - `authorConfig.name`
  - `authorConfig.links`
  - `localizedPath(pathname: string, lang: Lang): string`
- Produces:
  - `ContentSidebar({ lang, children }: { lang: Lang; children?: React.ReactNode }): Promise<JSX.Element>`
  - `ContentWithSidebar({ children, sidebar }: { children: React.ReactNode; sidebar: React.ReactNode }): JSX.Element`

- [ ] **Step 1: Add sidebar i18n messages**

Modify `frontend/lib/i18n.ts` by adding a `sidebar` object to both languages:

```ts
sidebar: {
  author: '作者',
  stats: '内容统计',
  posts: '文章',
  categories: '分类',
  tags: '标签',
  notice: '公告',
  latestPosts: '最新文章',
  github: 'GitHub',
  note: '慢慢记录，保持清醒。',
},
```

For English:

```ts
sidebar: {
  author: 'Author',
  stats: 'Content stats',
  posts: 'Posts',
  categories: 'Categories',
  tags: 'Tags',
  notice: 'Notice',
  latestPosts: 'Latest posts',
  github: 'GitHub',
  note: 'Keep writing slowly and clearly.',
},
```

- [ ] **Step 2: Write the failing sidebar component test**

Create `frontend/tests/ui/content-sidebar.test.tsx`:

```tsx
import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ContentSidebar } from '@/components/sidebar/ContentSidebar';

describe('ContentSidebar', () => {
  it('renders author, stats, notice, and latest posts for Chinese content', async () => {
    render(await ContentSidebar({ lang: 'zh' }));

    expect(screen.getByRole('heading', { name: 'JaoHun' })).toBeTruthy();
    expect(screen.getByText('慢慢记录，保持清醒。')).toBeTruthy();
    expect(screen.getByText('内容统计')).toBeTruthy();
    expect(screen.getByText('最新文章')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/JaoHun');
    expect(screen.getByRole('link', { name: '构建一个轻量静态博客 MVP' })).toHaveAttribute(
      'href',
      '/posts/static-blog-mvp',
    );
  });

  it('renders nested article detail content when provided', async () => {
    render(await ContentSidebar({ lang: 'en', children: <nav aria-label="Contents">TOC</nav> }));

    expect(screen.getByLabelText('Contents')).toHaveTextContent('TOC');
  });
});
```

- [ ] **Step 3: Run the failing test**

Run:

```powershell
cd D:\Codex_workspace\Blog\frontend
corepack pnpm test -- tests/ui/content-sidebar.test.tsx
```

Expected: FAIL because `@/components/sidebar/ContentSidebar` does not exist.

- [ ] **Step 4: Implement `ContentWithSidebar`**

Create `frontend/components/sidebar/ContentWithSidebar.tsx`:

```tsx
type ContentWithSidebarProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export function ContentWithSidebar({ children, sidebar }: ContentWithSidebarProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0">{children}</div>
      <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">{sidebar}</aside>
    </div>
  );
}
```

- [ ] **Step 5: Implement `ContentSidebar`**

Create `frontend/components/sidebar/ContentSidebar.tsx`:

```tsx
import Link from 'next/link';

import { ExternalLink } from '@/components/common/ExternalLink';
import { authorConfig, getAuthorBio } from '@/config/author';
import { getPublishedPosts } from '@/lib/content/posts';
import type { Lang } from '@/lib/content/posts';
import { localizedPath, messages } from '@/lib/i18n';

type ContentSidebarProps = {
  children?: React.ReactNode;
  lang: Lang;
};

export async function ContentSidebar({ children, lang }: ContentSidebarProps) {
  const posts = await getPublishedPosts(lang);
  const categories = new Set(posts.map((post) => post.category));
  const tags = new Set(posts.flatMap((post) => post.tags));
  const latestPosts = posts.slice(0, 3);
  const t = messages[lang].sidebar;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-border p-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{t.author}</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">{authorConfig.name}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{getAuthorBio(lang)}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-link">
          {authorConfig.links.map((link) => (
            <ExternalLink href={link.href} key={link.href}>
              {link.label === 'GitHub' ? t.github : link.label}
            </ExternalLink>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold">{t.stats}</h2>
        <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <dt className="text-lg font-semibold">{posts.length}</dt>
            <dd className="mt-1 text-xs text-muted">{t.posts}</dd>
          </div>
          <div>
            <dt className="text-lg font-semibold">{categories.size}</dt>
            <dd className="mt-1 text-xs text-muted">{t.categories}</dd>
          </div>
          <div>
            <dt className="text-lg font-semibold">{tags.size}</dt>
            <dd className="mt-1 text-xs text-muted">{t.tags}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold">{t.notice}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{t.note}</p>
      </section>

      {children ? <section className="rounded-lg border border-border p-5">{children}</section> : null}

      <section className="rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold">{t.latestPosts}</h2>
        <div className="mt-4 space-y-3">
          {latestPosts.map((post) => (
            <Link
              className="block text-sm leading-6 text-link"
              href={localizedPath(`/posts/${post.slug}`, lang)}
              key={post.slug}
            >
              {post.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run:

```powershell
corepack pnpm test -- tests/ui/content-sidebar.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Run lint**

Run:

```powershell
corepack pnpm lint
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add frontend/lib/i18n.ts frontend/components/sidebar/ContentSidebar.tsx frontend/components/sidebar/ContentWithSidebar.tsx frontend/tests/ui/content-sidebar.test.tsx
git commit -m "feat: add technical content sidebar"
```

---

### Task 2: Apply Sidebar To Technical List Pages

**Files:**
- Modify: `frontend/app/_localized-pages.tsx`
- Modify: `frontend/scripts/launch-check.ts`
- Test: existing `frontend/app/page.test.tsx`, `frontend/tests/ui/content-sidebar.test.tsx`

**Interfaces:**
- Consumes:
  - `ContentWithSidebar({ children, sidebar })`
  - `ContentSidebar({ lang })`
- Produces:
  - `/tech/` and `/posts/` render two-column technical layouts.
  - `/en/tech/` and `/en/posts/` render the English sidebar.

- [ ] **Step 1: Import sidebar components**

Modify `frontend/app/_localized-pages.tsx` imports:

```tsx
import { ContentSidebar } from '@/components/sidebar/ContentSidebar';
import { ContentWithSidebar } from '@/components/sidebar/ContentWithSidebar';
```

- [ ] **Step 2: Wrap `TechPage` content**

In `TechPage`, keep the existing inner content unchanged but wrap it:

```tsx
return (
  <ContentWithSidebar sidebar={<ContentSidebar lang={lang} />}>
    <div className="space-y-14">
      {/* existing TechPage sections */}
    </div>
  </ContentWithSidebar>
);
```

- [ ] **Step 3: Wrap `PostsPage` content**

In `PostsPage`, change the return shape:

```tsx
return (
  <ContentWithSidebar sidebar={<ContentSidebar lang={lang} />}>
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
        <p className="mt-3 text-muted">{t.description}</p>
      </div>
      <SearchBox lang={lang} />
      <PostList lang={lang} posts={page.items} />
      <Pagination basePath={localizedPath('/posts', lang)} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  </ContentWithSidebar>
);
```

- [ ] **Step 4: Wrap `PaginatedPostsPage` content**

In `PaginatedPostsPage`, change the return shape:

```tsx
return (
  <ContentWithSidebar sidebar={<ContentSidebar lang={lang} />}>
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{messages[lang].posts.title}</h1>
        <p className="mt-3 text-muted">{messages[lang].common.page.replace('{page}', String(page.currentPage))}</p>
      </div>
      <PostList lang={lang} posts={page.items} />
      <Pagination basePath={localizedPath('/posts', lang)} currentPage={page.currentPage} totalPages={page.totalPages} />
    </section>
  </ContentWithSidebar>
);
```

- [ ] **Step 5: Update launch checks for list pages**

Modify `frontend/scripts/launch-check.ts` after reading `tech` and before post checks:

```ts
const postsPage = await readOutFile('posts/index.html');

assertContains(tech, '内容统计', 'tech page sidebar');
assertContains(tech, '最新文章', 'tech page sidebar');
assertContains(postsPage, '内容统计', 'posts page sidebar');
assertContains(postsPage, '最新文章', 'posts page sidebar');
```

- [ ] **Step 6: Run focused verification**

Run:

```powershell
corepack pnpm test
corepack pnpm lint
corepack pnpm build
corepack pnpm launch:check
```

Expected: all PASS.

- [ ] **Step 7: Preview routes manually**

Run if preview is not already active:

```powershell
corepack pnpm preview
```

Check:

```text
http://localhost:4173/tech/
http://localhost:4173/posts/
http://localhost:4173/en/tech/
http://localhost:4173/en/posts/
```

Expected: pages return 200 and show the sidebar below content on narrow screens and to the right on desktop.

- [ ] **Step 8: Commit**

```powershell
git add frontend/app/_localized-pages.tsx frontend/scripts/launch-check.ts
git commit -m "feat: show sidebar on technical list pages"
```

---

### Task 3: Apply Sidebar To Article Detail Pages

**Files:**
- Modify: `frontend/app/_localized-pages.tsx`
- Modify: `frontend/scripts/launch-check.ts`
- Test: existing content/sidebar tests and launch check

**Interfaces:**
- Consumes:
  - `ContentSidebar({ lang, children })`
  - `ContentWithSidebar({ children, sidebar })`
  - `PostToc({ headings, lang })`
- Produces:
  - `/posts/[slug]/` and `/en/posts/[slug]/` render author sidebar, TOC, and latest posts in one right column.

- [ ] **Step 1: Replace article detail two-column layout**

In `PostPage`, replace:

```tsx
return (
  <article className="grid gap-8 lg:grid-cols-[1fr_220px]">
    <div className="min-w-0">
      {/* existing article content */}
    </div>
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <PostToc headings={post.headings} lang={lang} />
    </aside>
  </article>
);
```

With:

```tsx
return (
  <ContentWithSidebar
    sidebar={
      <ContentSidebar lang={lang}>
        <PostToc headings={post.headings} lang={lang} />
      </ContentSidebar>
    }
  >
    <article>
      <Link className="text-sm text-link" href={localizedPath('/posts', lang)}>
        {t.back}
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{post.excerpt}</p>
      <PostMeta lang={lang} post={post} />
      <div className="post-content mt-10">
        <MDXRemote components={mdxComponents} source={post.body} />
      </div>
      <nav className="mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        {adjacent.previous ? (
          <Link className="text-link" href={localizedPath(`/posts/${adjacent.previous.slug}`, lang)}>
            {t.previous}: {adjacent.previous.title}
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link className="text-link sm:text-right" href={localizedPath(`/posts/${adjacent.next.slug}`, lang)}>
            {t.next}: {adjacent.next.title}
          </Link>
        ) : null}
      </nav>
    </article>
  </ContentWithSidebar>
);
```

- [ ] **Step 2: Update launch checks for article sidebar**

Modify `frontend/scripts/launch-check.ts` after existing post metadata assertions:

```ts
assertContains(post, '内容统计', 'post page sidebar');
assertContains(post, '目录', 'post page sidebar');
assertContains(post, '最新文章', 'post page sidebar');
```

- [ ] **Step 3: Run full verification**

Run:

```powershell
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
corepack pnpm launch:check
```

Expected: all PASS.

- [ ] **Step 4: Preview article pages**

Check:

```text
http://localhost:4173/posts/static-blog-mvp/
http://localhost:4173/en/posts/static-blog-mvp/
```

Expected:

- Article body remains readable.
- Sidebar appears on the right on desktop.
- Sidebar contains author card, stats, TOC, and latest posts.
- There is no separate third column.

- [ ] **Step 5: Commit**

```powershell
git add frontend/app/_localized-pages.tsx frontend/scripts/launch-check.ts
git commit -m "feat: show sidebar on article pages"
```

---

### Task 4: Final Documentation And Branch Verification

**Files:**
- Modify: `docs/superpowers/specs/2026-08-01-tech-content-sidebar-design.md`
- Modify: `docs/launch/blog-mvp-launch-checklist.md`

**Interfaces:**
- Consumes:
  - Final route behavior from Tasks 1-3.
- Produces:
  - Documentation that matches the implemented sidebar behavior.

- [ ] **Step 1: Update sidebar design spec status**

Append this section to `docs/superpowers/specs/2026-08-01-tech-content-sidebar-design.md`:

```md
## Implementation Status

Implemented for:

- `/tech/`
- `/posts/`
- `/posts/[slug]/`

Article detail pages use a single right sidebar containing author context, table of contents, and latest posts.
```

- [ ] **Step 2: Update launch checklist**

Add these bullets under acceptance checks in `docs/launch/blog-mvp-launch-checklist.md`:

```md
- `/tech/` and `/posts/` show the technical content sidebar on desktop.
- `/posts/static-blog-mvp/` shows author context, TOC, and latest posts in one right sidebar.
- Mobile layout stacks sidebar below main content.
```

- [ ] **Step 3: Run final verification**

Run:

```powershell
cd D:\Codex_workspace\Blog\frontend
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
corepack pnpm launch:check
```

Expected: all PASS.

- [ ] **Step 4: Confirm git status**

Run:

```powershell
cd D:\Codex_workspace\Blog
git status --short --branch
```

Expected before commit: only docs changed.

- [ ] **Step 5: Commit documentation**

```powershell
git add docs/superpowers/specs/2026-08-01-tech-content-sidebar-design.md docs/launch/blog-mvp-launch-checklist.md
git commit -m "docs: update sidebar launch checklist"
```

---

## Self-Review

- Spec coverage: The plan covers `/tech/`, `/posts/`, `/posts/[slug]/`, author card, stats, notice, latest posts, article TOC, mobile stacking, no avatar, no home sidebar, and verification.
- Placeholder scan: No incomplete implementation steps remain.
- Type consistency: `ContentSidebar`, `ContentWithSidebar`, `Lang`, and `PostToc` signatures are used consistently across all tasks.
