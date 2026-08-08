# Photo Essay Publishing Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional cover images to shared post cards and provide a validated, copyable MDX template for photo essays published through `/moments`.

**Architecture:** Keep photo essays in the existing `Post` content model with `type: "essay"` and optional `cover`. Extend only the shared `PostCard`, so posts, moments, category, and tag lists inherit the same behavior without a second gallery system. Keep all publishing, validation, RSS, Sitemap, search, and draft filtering in the current build-time pipeline.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, MDX, Tailwind CSS 4, Vitest, Testing Library, Zod.

## Global Constraints

- Do not add a CMS, browser editor, upload service, image library, gallery data model, or gallery detail route.
- Do not add image lightboxes, slideshows, EXIF processing, automatic compression, or runtime dependencies.
- Continue using `frontend/content/posts/*.mdx` as the only article source.
- Photo essays must use `type: "essay"`; `cover` remains optional and, when present, must start with `/images/`.
- A missing cover must preserve the existing text-only card without an empty container or layout gap.
- Do not invent a personal story and present it as published content; the new template remains a draft.
- Follow TDD: run each new test and observe the expected failure before writing its production change.

---

### Task 1: Render Optional Post Card Covers

**Files:**
- Create: `frontend/tests/ui/post-card.test.tsx`
- Modify: `frontend/components/post/PostCard.tsx`

**Interfaces:**
- Consumes: `Post.cover?: string`, `PostImage({ alt, src, className })`, and `localizedPath(path, lang)`.
- Produces: `PostCard({ lang?: Lang, post: Post })` with a linked cover when `post.cover` exists and unchanged text-only rendering otherwise.

- [ ] **Step 1: Write the failing component tests**

Create `frontend/tests/ui/post-card.test.tsx`:

```tsx
import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostCard } from '@/components/post/PostCard';
import type { Post } from '@/lib/content/posts';

const post = (overrides: Partial<Post> = {}): Post => ({
  body: '',
  category: 'Life',
  date: '2026-08-08',
  draft: false,
  excerpt: 'A short photo essay used to verify the shared post card.',
  featured: false,
  headings: [],
  lang: 'en',
  readingTimeMinutes: 1,
  slug: 'covered-post',
  sticky: false,
  tags: ['life', 'photo'],
  title: 'Covered Post',
  type: 'essay',
  ...overrides,
});

describe('PostCard', () => {
  it('renders a linked cover when the post defines one', () => {
    render(
      <PostCard
        lang="en"
        post={post({ cover: '/images/posts/covered-post/cover.jpg' })}
      />,
    );

    const image = screen.getByRole('img', { name: 'Covered Post' });

    expect(image).toHaveAttribute('src', '/images/posts/covered-post/cover.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image.closest('a')).toHaveAttribute('href', '/en/posts/covered-post');
  });

  it('keeps the text-only card when the post has no cover', () => {
    render(<PostCard lang="en" post={post()} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Covered Post' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests and verify the cover test fails**

Run from `frontend`:

```powershell
corepack pnpm test tests/ui/post-card.test.tsx
```

Expected: one test fails because `PostCard` does not render an image; the coverless test passes.

- [ ] **Step 3: Add the minimal cover rendering**

Update `frontend/components/post/PostCard.tsx` to import `PostImage`, reuse one article URL, and render the cover before metadata:

```tsx
import Link from 'next/link';

import { PostImage } from '@/components/post/PostImage';
import type { Post } from '@/lib/content/posts';
import type { Lang } from '@/lib/content/posts';
import { routeSegment } from '@/lib/content/route';
import { localizedPath, messages } from '@/lib/i18n';

type PostCardProps = {
  lang?: Lang;
  post: Post;
};

export function PostCard({ lang = 'zh', post }: PostCardProps) {
  const t = messages[lang];
  const articleHref = localizedPath(`/posts/${post.slug}`, lang);

  return (
    <article className="border-b border-border py-6">
      {post.cover ? (
        <Link
          className="mb-5 block aspect-[16/9] overflow-hidden rounded-lg border border-border"
          href={articleHref}
        >
          <PostImage
            alt={post.title}
            className="!m-0 !h-full !w-full !rounded-none !border-0 object-cover transition duration-300 hover:scale-[1.01]"
            src={post.cover}
          />
        </Link>
      ) : null}
      <div className="flex flex-wrap gap-3 text-sm text-muted">
        <time dateTime={post.date}>{post.date}</time>
        {post.updated ? <span>{t.posts.updated} {post.updated}</span> : null}
        <Link
          className="text-link"
          href={localizedPath(`/categories/${routeSegment(post.category)}`, lang)}
        >
          {post.category}
        </Link>
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        <Link className="transition hover:text-link" href={articleHref}>
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:text-foreground"
            href={localizedPath(`/tags/${routeSegment(tag)}`, lang)}
            key={tag}
          >
            #{tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run the focused and full test suites**

Run from `frontend`:

```powershell
corepack pnpm test tests/ui/post-card.test.tsx
corepack pnpm test
```

Expected: both post-card tests pass and the full suite reports zero failures.

- [ ] **Step 5: Commit the cover behavior**

```powershell
git add frontend/tests/ui/post-card.test.tsx frontend/components/post/PostCard.tsx
git commit -m "feat: show optional post card covers"
```

---

### Task 2: Add a Validated Photo Essay Template

**Files:**
- Modify: `frontend/tests/content/posts.test.ts`
- Create: `frontend/content/posts/photo-essay-template.mdx`
- Modify: `docs/writing/post-writing-guide.md`

**Interfaces:**
- Consumes: `getAllPosts({ includeDrafts: true })`, current Frontmatter schema, and the existing `/images/posts/<slug>/` asset convention.
- Produces: a valid unpublished post with `slug: "photo-essay-template"`, `lang: "zh"`, `type: "essay"`, and `draft: true` that authors can copy for future `/moments` entries.

- [ ] **Step 1: Write a failing content-pipeline test**

Add this test inside the existing `describe('post content pipeline', ...)` block in `frontend/tests/content/posts.test.ts`:

```ts
it('provides a valid unpublished photo essay template', async () => {
  const posts = await getAllPosts({ includeDrafts: true });

  expect(posts).toContainEqual(
    expect.objectContaining({
      cover: undefined,
      draft: true,
      lang: 'zh',
      slug: 'photo-essay-template',
      type: 'essay',
    }),
  );
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run from `frontend`:

```powershell
corepack pnpm test tests/content/posts.test.ts
```

Expected: the new test fails because no post has the `photo-essay-template` slug.

- [ ] **Step 3: Create the draft template**

Create `frontend/content/posts/photo-essay-template.mdx`:

````mdx
---
title: "照片随笔模板"
date: "2026-08-08"
excerpt: "复制这份草稿来记录一次出行、日常片段或带有照片的生活随笔，发布前请替换其中的示例内容。"
category: "生活"
tags:
  - life
  - photo
featured: false
sticky: false
draft: true
lang: "zh"
type: "essay"
# 添加真实封面文件后再启用下一行：
# cover: "/images/posts/photo-essay-template/cover.jpg"
---

# 照片随笔模板

复制这份草稿后，先修改文件名、标题、日期、摘要和图片目录。写作完成前保持 `draft: true`。

## 这次想记录什么

写下地点、时间、起因，或者当时最想留下的一件小事。

## 照片记录

把照片放入与文章同名的目录，并为每张图片写清楚替代文本。图片语法示例：

```md
![傍晚街道上的灯光](/images/posts/photo-essay-template/street-01.jpg)
```

## 留下的一点想法

记录照片之外的感受、变化或以后想再次回看的内容。

## 发布前检查

- [ ] 已替换模板文字和示例路径。
- [ ] 图片已经压缩并移除隐私信息。
- [ ] 每张图片都有准确的替代文本。
- [ ] 封面存在时已启用 `cover`。
- [ ] `corepack pnpm content:check` 可以通过。
- [ ] 准备发布时才将 `draft` 改为 `false`。
````

- [ ] **Step 4: Run the focused test and content validation**

Run from `frontend`:

```powershell
corepack pnpm test tests/content/posts.test.ts
corepack pnpm content:check
```

Expected: the content test passes, content validation prints `content:check passed`, and the template remains excluded from published posts.

- [ ] **Step 5: Update the writing guide**

In `docs/writing/post-writing-guide.md`, add this paragraph after the numbered manual draft flow:

```markdown
For travel notes, life records, and photo essays, copy `frontend/content/posts/photo-essay-template.mdx` instead. Keep `type: "essay"`; add the real images under `frontend/public/images/posts/<slug>/`, then enable `cover` only after the cover file exists.
```

Also replace this existing rule:

```markdown
- `type` defaults to `tech`; use `essay` only for future personal essays.
```

with:

```markdown
- `type` defaults to `tech`; use `essay` for content that belongs in `/moments`.
```

- [ ] **Step 6: Run complete project verification**

Run from `frontend`:

```powershell
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
corepack pnpm launch:check
```

Expected:

- Content validation exits successfully.
- All Vitest files pass with zero failed tests.
- ESLint exits with zero errors.
- Next.js static export completes and writes `frontend/out`.
- Launch checks pass, published routes remain available, and the draft template has no production route.

- [ ] **Step 7: Review the final diff and commit the template workflow**

Run from the repository root:

```powershell
git diff --check
git status --short
```

Confirm that only the task files are changed, then commit:

```powershell
git add frontend/tests/content/posts.test.ts frontend/content/posts/photo-essay-template.mdx docs/writing/post-writing-guide.md
git commit -m "content: add photo essay writing template"
```
