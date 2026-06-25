# Blog MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static-first personal technical blog MVP with Next.js, MDX, file-based content, local search, theme switching, RSS, Sitemap, robots, and static hosting support.

**Architecture:** The blog is a pure static site. MDX posts and typed config files are the only data sources; build-time scripts validate content, generate derived indexes, and output static SEO resources. Client-side JavaScript is limited to search, theme switching, copy-code, TOC behavior, and back-to-top interactions.

**Tech Stack:** Next.js App Router, TypeScript, MDX, Tailwind CSS, CSS variables, Zod, Shiki, Vitest, Testing Library, pnpm.

---

## Source Documents

- `docs/requirements/blog-mvp-requirements.md`
- `docs/designs/blog-overall-design.md`
- `docs/designs/blog-technical-architecture.md`

## Scope Check

This plan implements the MVP only. It excludes backend management, users, comments, analytics, media upload, project detail pages, complex i18n, Mermaid, math formulas, timeline archive, friend links, likes, favorites, and Headless CMS.

## File Structure Map

### Project and Tooling

- `frontend/package.json`: scripts, dependencies, and static generation commands.
- `frontend/next.config.js`: static export and GitHub Pages compatibility strategy.
- `frontend/tsconfig.json`: TypeScript config.
- `frontend/vitest.config.ts`: unit test config.
- `frontend/app/layout.tsx`: root layout, metadata, theme bootstrap.
- `frontend/app/globals.css`: global styles and CSS variables.

### Content and Config

- `frontend/content/posts/*.mdx`: MDX articles.
- `frontend/config/site.ts`: site name, URL, description, default OG image, pagination size.
- `frontend/config/author.ts`: author bio and links.
- `frontend/config/nav.ts`: navigation config.
- `frontend/config/projects.ts`: project list.
- `frontend/lib/content/schema.ts`: Zod schemas for Frontmatter and config files.
- `frontend/lib/content/parser.ts`: MDX and Frontmatter parsing.
- `frontend/lib/content/normalize.ts`: slug, date, category, and tag normalization.
- `frontend/lib/content/posts.ts`: post collection API.
- `frontend/lib/content/relations.ts`: previous and next post calculation.
- `frontend/lib/content/search.ts`: static search index generation.
- `frontend/lib/content/rss.ts`: RSS XML generation.
- `frontend/lib/content/sitemap.ts`: Sitemap XML generation.
- `frontend/lib/content/robots.ts`: robots.txt generation.
- `frontend/scripts/content-check.ts`: validation entrypoint.
- `frontend/scripts/generate-static-assets.ts`: prebuild asset generator.

### UI and Pages

- `frontend/app/page.tsx`: home page.
- `frontend/app/posts/page.tsx`: all posts list page.
- `frontend/app/posts/page/[page]/page.tsx`: paginated posts route.
- `frontend/app/posts/[slug]/page.tsx`: post detail page.
- `frontend/app/categories/page.tsx`: category overview.
- `frontend/app/categories/[category]/page.tsx`: category detail.
- `frontend/app/categories/[category]/page/[page]/page.tsx`: paginated category route.
- `frontend/app/tags/page.tsx`: tag overview.
- `frontend/app/tags/[tag]/page.tsx`: tag detail.
- `frontend/app/tags/[tag]/page/[page]/page.tsx`: paginated tag route.
- `frontend/app/about/page.tsx`: about page.
- `frontend/app/projects/page.tsx`: projects page.
- `frontend/components/layout/*`: site shell, header, footer, nav.
- `frontend/components/post/*`: post cards, metadata, TOC, code block, MDX components.
- `frontend/components/search/*`: client search UI.
- `frontend/components/theme/*`: theme provider and theme toggle.
- `frontend/components/project/*`: project cards and project list.
- `frontend/components/common/*`: pagination, empty state, back-to-top, external link.

### Tests

- `frontend/tests/content/schema.test.ts`: Frontmatter and config validation tests.
- `frontend/tests/content/posts.test.ts`: draft filtering, sorting, slug uniqueness, category/tag normalization.
- `frontend/tests/content/static-assets.test.ts`: RSS, Sitemap, robots, and search index generation tests.
- `frontend/tests/ui/search.test.tsx`: client search behavior tests.
- `frontend/tests/ui/theme.test.tsx`: theme preference behavior tests.

---

## Task 1: Initialize Frontend Project and Baseline Tooling

**Files:**

- Create: `frontend/package.json`
- Create: `frontend/next.config.js`
- Create: `frontend/tsconfig.json`
- Create: `frontend/vitest.config.ts`
- Create: `frontend/app/layout.tsx`
- Create: `frontend/app/page.tsx`
- Create: `frontend/app/globals.css`

- [ ] **Step 1: Confirm git state**

Run:

```powershell
git rev-parse --is-inside-work-tree
```

Expected if git is initialized:

```text
true
```

If it fails with `fatal: not a git repository`, run:

```powershell
git init
git add docs
git commit -m "docs: add blog MVP planning documents"
```

Expected: a root commit containing the existing documentation.

- [ ] **Step 2: Create the Next.js app skeleton**

Run from `D:\Codex_workspace\Blog`:

```powershell
pnpm create next-app@latest frontend --ts --eslint --tailwind --app --src-dir false --import-alias "@/*"
```

Expected: Next.js app files are created under `frontend/`.

- [ ] **Step 3: Install MVP dependencies**

Run:

```powershell
Set-Location frontend
pnpm add zod gray-matter reading-time shiki fast-glob feed
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event tsx
```

Expected: dependencies are added to `frontend/package.json`.

- [ ] **Step 4: Add required scripts**

Modify `frontend/package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "tsx scripts/generate-static-assets.ts",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "content:check": "tsx scripts/content-check.ts"
  }
}
```

- [ ] **Step 5: Configure Vitest**

Set `frontend/vitest.config.ts`:

```ts
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 6: Configure static export strategy**

Set `frontend/next.config.js`:

```js
const isGithubPages = process.env.DEPLOY_TARGET === 'github-pages';
const repoName = process.env.GITHUB_PAGES_REPO || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: isGithubPages && repoName ? `/${repoName}` : '',
  assetPrefix: isGithubPages && repoName ? `/${repoName}/` : '',
};

module.exports = nextConfig;
```

- [ ] **Step 7: Verify baseline**

Run:

```powershell
pnpm lint
pnpm test
pnpm build
```

Expected: lint passes, tests pass or report no tests, and static build completes.

- [ ] **Step 8: Commit**

Run:

```powershell
git add frontend
git commit -m "chore: initialize Next.js frontend"
```

Expected: tooling baseline is committed.

---

## Task 2: Define Config Files and Validation Schemas

**Files:**

- Create: `frontend/config/site.ts`
- Create: `frontend/config/author.ts`
- Create: `frontend/config/nav.ts`
- Create: `frontend/config/projects.ts`
- Create: `frontend/lib/content/schema.ts`
- Create: `frontend/tests/content/schema.test.ts`

- [ ] **Step 1: Write schema tests first**

Create `frontend/tests/content/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  authorSchema,
  navItemSchema,
  postFrontmatterSchema,
  projectSchema,
  siteSchema,
} from '@/lib/content/schema';

describe('content schemas', () => {
  it('accepts valid post frontmatter', () => {
    const result = postFrontmatterSchema.parse({
      title: 'Static Next.js Blog',
      date: '2026-06-26',
      updated: '2026-06-27',
      excerpt: 'Build a static blog with MDX.',
      category: 'Next.js',
      tags: ['nextjs', 'mdx'],
      featured: true,
      sticky: false,
      draft: false,
      cover: '/images/posts/static-next-blog/cover.png',
      type: 'tech',
    });

    expect(result.updated).toBe('2026-06-27');
  });

  it('rejects updated dates earlier than date', () => {
    expect(() =>
      postFrontmatterSchema.parse({
        title: 'Invalid Dates',
        date: '2026-06-26',
        updated: '2026-06-25',
        excerpt: 'This should fail.',
        category: 'Testing',
        tags: ['test'],
      }),
    ).toThrow();
  });

  it('accepts valid config objects', () => {
    expect(() =>
      siteSchema.parse({
        name: 'MJH Blog',
        description: 'Personal technical notes.',
        url: 'https://example.com',
        defaultOgImage: '/images/og/default.png',
        pageSize: 10,
      }),
    ).not.toThrow();

    expect(() =>
      authorSchema.parse({
        name: 'MJH',
        bio: 'Developer writing technical notes.',
        links: [{ label: 'GitHub', href: 'https://github.com/example' }],
      }),
    ).not.toThrow();

    expect(() => navItemSchema.parse({ label: '文章', href: '/posts' })).not.toThrow();

    expect(() =>
      projectSchema.parse({
        name: 'Blog MVP',
        description: 'Static personal blog.',
        techStack: ['Next.js', 'MDX'],
        status: 'active',
      }),
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```powershell
pnpm test tests/content/schema.test.ts
```

Expected: FAIL because `@/lib/content/schema` does not exist.

- [ ] **Step 3: Implement schemas**

Create `frontend/lib/content/schema.ts`:

```ts
import { z } from 'zod';

const dateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Expected a valid date string',
});

const safeSlug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens');

export const postFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1),
    date: dateString,
    updated: dateString.optional(),
    excerpt: z.string().trim().min(20).max(220),
    category: z.string().trim().min(1),
    tags: z.array(z.string().trim().min(1)).min(1),
    featured: z.boolean().default(false),
    sticky: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.string().startsWith('/images/').optional(),
    slug: safeSlug.optional(),
    type: z.enum(['tech', 'essay']).default('tech'),
  })
  .superRefine((value, ctx) => {
    if (value.updated && Date.parse(value.updated) < Date.parse(value.date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['updated'],
        message: 'updated cannot be earlier than date',
      });
    }
  });

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export const siteSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  url: z.string().url(),
  defaultOgImage: z.string().startsWith('/images/'),
  pageSize: z.number().int().min(1).max(50).default(10),
});

export const authorSchema = z
  .object({
    name: z.string().trim().min(1),
    bio: z.string().trim().min(1),
    links: z.array(z.object({ label: z.string().min(1), href: z.string().url() })).default([]),
    email: z.string().email().optional(),
  })
  .refine((value) => value.links.length > 0 || Boolean(value.email), {
    message: 'Author must include at least one link or email',
  });

export const navItemSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().refine((value) => value.startsWith('/') || value.startsWith('https://'), {
    message: 'Navigation href must be a site path or HTTPS URL',
  }),
});

export const projectSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  techStack: z.array(z.string().trim().min(1)).min(1),
  status: z.enum(['active', 'maintained', 'archived', 'planned']),
  featured: z.boolean().default(false),
  sourceUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  articleUrl: z.string().optional(),
});
```

- [ ] **Step 4: Add config files**

Create minimal valid config files:

```ts
// frontend/config/site.ts
export const siteConfig = {
  name: 'MJH Blog',
  description: '个人技术笔记与项目记录。',
  url: 'https://example.com',
  defaultOgImage: '/images/og/default.png',
  pageSize: 10,
};
```

```ts
// frontend/config/author.ts
export const authorConfig = {
  name: 'MJH',
  bio: '专注技术实践、工程经验和个人项目记录。',
  links: [{ label: 'GitHub', href: 'https://github.com/example' }],
};
```

```ts
// frontend/config/nav.ts
export const navConfig = [
  { label: '首页', href: '/' },
  { label: '文章', href: '/posts' },
  { label: '分类', href: '/categories' },
  { label: '标签', href: '/tags' },
  { label: '项目', href: '/projects' },
  { label: '关于', href: '/about' },
];
```

```ts
// frontend/config/projects.ts
export const projectConfig = [
  {
    name: 'Blog MVP',
    description: '静态个人技术博客。',
    techStack: ['Next.js', 'MDX', 'TypeScript'],
    status: 'active',
    featured: true,
  },
];
```

- [ ] **Step 5: Verify schemas**

Run:

```powershell
pnpm test tests/content/schema.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```powershell
git add frontend/config frontend/lib/content/schema.ts frontend/tests/content/schema.test.ts
git commit -m "feat: add content and config schemas"
```

---

## Task 3: Implement MDX Content Pipeline

**Files:**

- Create: `frontend/content/posts/hello-next-mdx.mdx`
- Create: `frontend/content/posts/draft-example.mdx`
- Create: `frontend/lib/content/parser.ts`
- Create: `frontend/lib/content/normalize.ts`
- Create: `frontend/lib/content/posts.ts`
- Create: `frontend/lib/content/relations.ts`
- Create: `frontend/tests/content/posts.test.ts`

- [ ] **Step 1: Add sample MDX posts**

Create `hello-next-mdx.mdx` with:

```mdx
---
title: "Hello Next MDX"
date: "2026-06-26"
updated: "2026-06-26"
excerpt: "用一篇示例文章验证 MDX 内容管线、分类、标签和生产构建过滤。"
category: "Next.js"
tags:
  - nextjs
  - mdx
featured: true
sticky: true
draft: false
type: "tech"
---

# Hello Next MDX

这是一篇用于验证博客 MVP 内容管线的示例文章。

```ts
export const message = 'hello mdx';
```
```

Create `draft-example.mdx` with:

```mdx
---
title: "Draft Example"
date: "2026-06-26"
excerpt: "这篇草稿用于验证开发环境可见、生产环境过滤的内容规则。"
category: "Draft"
tags:
  - draft
draft: true
type: "tech"
---

# Draft Example

这篇文章不应该进入生产构建。
```

- [ ] **Step 2: Write post pipeline tests**

Create `frontend/tests/content/posts.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getAllPosts, getPublishedPosts } from '@/lib/content/posts';

describe('post content pipeline', () => {
  it('includes drafts only when requested', async () => {
    const withDrafts = await getAllPosts({ includeDrafts: true });
    const published = await getPublishedPosts();

    expect(withDrafts.some((post) => post.draft)).toBe(true);
    expect(published.every((post) => !post.draft)).toBe(true);
  });

  it('generates unique slugs and normalized tags', async () => {
    const posts = await getAllPosts({ includeDrafts: true });
    const slugs = posts.map((post) => post.slug);
    const uniqueSlugs = new Set(slugs);

    expect(uniqueSlugs.size).toBe(slugs.length);
    expect(posts[0].tags.every((tag) => tag === tag.toLowerCase())).toBe(true);
  });
});
```

- [ ] **Step 3: Run failing tests**

Run:

```powershell
pnpm test tests/content/posts.test.ts
```

Expected: FAIL because content pipeline modules do not exist.

- [ ] **Step 4: Implement parser and normalization**

Create `parser.ts`, `normalize.ts`, `relations.ts`, and `posts.ts` with these exported interfaces:

```ts
// frontend/lib/content/posts.ts
export type Post = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  sticky: boolean;
  draft: boolean;
  cover?: string;
  type: 'tech' | 'essay';
  body: string;
  readingTimeMinutes: number;
};

export async function getAllPosts(options?: { includeDrafts?: boolean }): Promise<Post[]>;
export async function getPublishedPosts(): Promise<Post[]>;
export async function getFeaturedPosts(): Promise<Post[]>;
export async function getPostsByCategory(category: string): Promise<Post[]>;
export async function getPostsByTag(tag: string): Promise<Post[]>;
```

Implementation requirements:

- Use `fast-glob` to read `content/posts/**/*.mdx`.
- Use `gray-matter` to parse Frontmatter.
- Validate Frontmatter with `postFrontmatterSchema`.
- Generate slug from `frontmatter.slug` or file name.
- Deduplicate and lowercase tags.
- Sort by `sticky` first, then `date` descending.
- Exclude drafts from `getPublishedPosts()`.
- Compute reading time from body using `reading-time`.
- Throw on duplicate slug.

- [ ] **Step 5: Verify post pipeline**

Run:

```powershell
pnpm test tests/content/posts.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```powershell
git add frontend/content frontend/lib/content frontend/tests/content/posts.test.ts
git commit -m "feat: add MDX content pipeline"
```

---

## Task 4: Add Static Asset Generators and Content Check Command

**Files:**

- Create: `frontend/lib/content/search.ts`
- Create: `frontend/lib/content/rss.ts`
- Create: `frontend/lib/content/sitemap.ts`
- Create: `frontend/lib/content/robots.ts`
- Create: `frontend/scripts/content-check.ts`
- Create: `frontend/scripts/generate-static-assets.ts`
- Create: `frontend/tests/content/static-assets.test.ts`

- [ ] **Step 1: Write static asset tests**

Create `frontend/tests/content/static-assets.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildRobotsTxt } from '@/lib/content/robots';
import { buildSearchIndex } from '@/lib/content/search';
import { buildSitemapXml } from '@/lib/content/sitemap';
import { buildRssXml } from '@/lib/content/rss';

describe('static asset generation', () => {
  it('generates search index without drafts or body content', async () => {
    const index = await buildSearchIndex();

    expect(index.every((item) => !('body' in item))).toBe(true);
    expect(index.every((item) => item.slug && item.title && item.excerpt)).toBe(true);
  });

  it('generates RSS, Sitemap, and robots text', async () => {
    const rss = await buildRssXml();
    const sitemap = await buildSitemapXml();
    const robots = buildRobotsTxt();

    expect(rss).toContain('<rss');
    expect(sitemap).toContain('<urlset');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Sitemap:');
  });
});
```

- [ ] **Step 2: Run failing tests**

Run:

```powershell
pnpm test tests/content/static-assets.test.ts
```

Expected: FAIL because generator modules do not exist.

- [ ] **Step 3: Implement generators**

Implement:

- `buildSearchIndex()` returns items with `slug`, `title`, `excerpt`, `category`, `tags`, `date`, `updated`, `type`.
- `buildRssXml()` returns RSS XML for published posts only.
- `buildSitemapXml()` returns XML for `/`, `/posts`, `/categories`, `/tags`, `/about`, `/projects`, post detail routes, category detail routes, and tag detail routes.
- `buildRobotsTxt()` returns:

```text
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml
```

The real Sitemap URL must use `siteConfig.url`.

- [ ] **Step 4: Add scripts**

Create `scripts/content-check.ts`:

```ts
import { getAllPosts } from '@/lib/content/posts';
import { siteSchema, authorSchema, navItemSchema, projectSchema } from '@/lib/content/schema';
import { siteConfig } from '@/config/site';
import { authorConfig } from '@/config/author';
import { navConfig } from '@/config/nav';
import { projectConfig } from '@/config/projects';

async function main() {
  siteSchema.parse(siteConfig);
  authorSchema.parse(authorConfig);
  navConfig.forEach((item) => navItemSchema.parse(item));
  projectConfig.forEach((project) => projectSchema.parse(project));
  await getAllPosts({ includeDrafts: true });
  console.log('content:check passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

Create `scripts/generate-static-assets.ts`:

```ts
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildRobotsTxt } from '@/lib/content/robots';
import { buildSearchIndex } from '@/lib/content/search';
import { buildSitemapXml } from '@/lib/content/sitemap';
import { buildRssXml } from '@/lib/content/rss';

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  await mkdir(publicDir, { recursive: true });

  await writeFile(path.join(publicDir, 'rss.xml'), await buildRssXml(), 'utf8');
  await writeFile(path.join(publicDir, 'sitemap.xml'), await buildSitemapXml(), 'utf8');
  await writeFile(path.join(publicDir, 'robots.txt'), buildRobotsTxt(), 'utf8');
  await writeFile(path.join(publicDir, 'search-index.json'), JSON.stringify(await buildSearchIndex()), 'utf8');

  console.log('static assets generated');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 5: Verify commands**

Run:

```powershell
pnpm test tests/content/static-assets.test.ts
pnpm content:check
pnpm prebuild
```

Expected:

```text
content:check passed
static assets generated
```

And `frontend/public/rss.xml`, `frontend/public/sitemap.xml`, `frontend/public/robots.txt`, `frontend/public/search-index.json` exist.

- [ ] **Step 6: Commit**

Run:

```powershell
git add frontend/lib/content frontend/scripts frontend/tests/content/static-assets.test.ts frontend/public
git commit -m "feat: generate static SEO and search assets"
```

---

## Task 5: Build Layout, Navigation, and Base Styling

**Files:**

- Modify: `frontend/app/layout.tsx`
- Modify: `frontend/app/globals.css`
- Create: `frontend/components/layout/SiteHeader.tsx`
- Create: `frontend/components/layout/SiteFooter.tsx`
- Create: `frontend/components/common/ExternalLink.tsx`

- [ ] **Step 1: Implement CSS variables**

Add theme variables and base layout styles to `frontend/app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --link: #2563eb;
  --code-bg: #f8fafc;
  --code-fg: #0f172a;
  --accent: #2563eb;
}

[data-theme='dark'] {
  --background: #0b1120;
  --foreground: #e5e7eb;
  --muted: #9ca3af;
  --border: #1f2937;
  --link: #60a5fa;
  --code-bg: #111827;
  --code-fg: #f8fafc;
  --accent: #60a5fa;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 2: Build layout components**

Create `SiteHeader` using `navConfig`, `SiteFooter` using `siteConfig`, and `ExternalLink` that sets `rel="noopener noreferrer"`.

- [ ] **Step 3: Wire root layout**

`app/layout.tsx` must:

- import `globals.css`
- render header, main, footer
- set site metadata from `siteConfig`
- include a small inline theme bootstrap script before paint

- [ ] **Step 4: Verify**

Run:

```powershell
pnpm lint
pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add frontend/app frontend/components/layout frontend/components/common
git commit -m "feat: add site layout and base styling"
```

---

## Task 6: Implement Listing, Pagination, Category, and Tag Pages

**Files:**

- Create: `frontend/lib/content/pagination.ts`
- Create: `frontend/app/posts/page.tsx`
- Create: `frontend/app/posts/page/[page]/page.tsx`
- Create: `frontend/app/categories/page.tsx`
- Create: `frontend/app/categories/[category]/page.tsx`
- Create: `frontend/app/categories/[category]/page/[page]/page.tsx`
- Create: `frontend/app/tags/page.tsx`
- Create: `frontend/app/tags/[tag]/page.tsx`
- Create: `frontend/app/tags/[tag]/page/[page]/page.tsx`
- Create: `frontend/components/post/PostCard.tsx`
- Create: `frontend/components/common/Pagination.tsx`
- Create: `frontend/components/common/EmptyState.tsx`

- [ ] **Step 1: Add pagination utility**

Create:

```ts
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    currentPage: safePage,
    totalPages,
  };
}
```

- [ ] **Step 2: Build reusable listing components**

`PostCard` must display title, excerpt, category, tags, date, updated if present, and link to `/posts/[slug]`.

`Pagination` must hide `/page/1` links and use `/posts`, `/categories/[category]`, or `/tags/[tag]` for first pages.

- [ ] **Step 3: Build routes**

Routes must:

- use `getPublishedPosts()`
- exclude drafts
- generate static params for paginated category and tag routes
- provide metadata for overview and detail pages

- [ ] **Step 4: Verify routes**

Run:

```powershell
pnpm build
```

Expected: build output includes static pages for posts, categories, tags, and sample post detail.

- [ ] **Step 5: Commit**

Run:

```powershell
git add frontend/app/posts frontend/app/categories frontend/app/tags frontend/components/post frontend/components/common frontend/lib/content/pagination.ts
git commit -m "feat: add post listing category and tag pages"
```

---

## Task 7: Implement Home, About, and Projects Pages

**Files:**

- Modify: `frontend/app/page.tsx`
- Create: `frontend/app/about/page.tsx`
- Create: `frontend/app/projects/page.tsx`
- Create: `frontend/components/project/ProjectCard.tsx`
- Create: `frontend/components/project/ProjectList.tsx`

- [ ] **Step 1: Implement home page**

Home page must display:

- author positioning from `authorConfig`
- featured posts from `getFeaturedPosts()`
- latest posts from `getPublishedPosts()`
- featured projects from `projectConfig`

- [ ] **Step 2: Implement about page**

About page must render author name, bio, and links from `authorConfig`.

- [ ] **Step 3: Implement projects page**

Projects page must render featured projects first, then the full project list. Do not create project detail routes.

- [ ] **Step 4: Verify**

Run:

```powershell
pnpm build
```

Expected: `/`, `/about`, and `/projects` are generated.

- [ ] **Step 5: Commit**

Run:

```powershell
git add frontend/app/page.tsx frontend/app/about frontend/app/projects frontend/components/project
git commit -m "feat: add home about and projects pages"
```

---

## Task 8: Implement MDX Post Detail Rendering

**Files:**

- Modify: `frontend/app/posts/[slug]/page.tsx`
- Create: `frontend/components/post/PostMeta.tsx`
- Create: `frontend/components/post/PostToc.tsx`
- Create: `frontend/components/post/CodeBlock.tsx`
- Create: `frontend/components/post/CopyCodeButton.tsx`
- Create: `frontend/components/post/MdxComponents.tsx`

- [ ] **Step 1: Add post detail route**

The route must:

- generate static params from published posts
- render title, excerpt, date, updated, category, tags, reading time
- render previous and next links
- generate metadata with title, description, canonical, Open Graph

- [ ] **Step 2: Add MDX components**

Register allowed components only:

```ts
export const mdxComponents = {
  Callout,
  PostImage,
  ProjectCard,
  CodeBlock,
  ExternalLink,
};
```

Do not allow arbitrary script or iframe components.

- [ ] **Step 3: Add code block behavior**

Code blocks must support:

- Shiki highlighting
- line numbers
- copy button
- horizontal scroll on narrow screens

- [ ] **Step 4: Add TOC**

TOC must derive headings from MDX content at build time or render from parsed heading metadata. It must not require a server request.

- [ ] **Step 5: Verify**

Run:

```powershell
pnpm build
```

Expected: sample post page builds and includes post metadata, code block markup, and TOC.

- [ ] **Step 6: Commit**

Run:

```powershell
git add frontend/app/posts/[slug] frontend/components/post
git commit -m "feat: render MDX post detail pages"
```

---

## Task 9: Implement Theme Switching

**Files:**

- Create: `frontend/components/theme/ThemeProvider.tsx`
- Create: `frontend/components/theme/ThemeToggle.tsx`
- Create: `frontend/tests/ui/theme.test.tsx`
- Modify: `frontend/app/layout.tsx`

- [ ] **Step 1: Write theme test**

Create test:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

describe('ThemeToggle', () => {
  it('cycles theme preference', async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /theme/i });
    await userEvent.click(button);
    expect(localStorage.getItem('theme')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Implement provider and toggle**

Theme behavior:

- default follows `prefers-color-scheme`
- manual choice writes `light`, `dark`, or `system` to `localStorage`
- document element receives `data-theme="light"` or `data-theme="dark"`
- no network request is needed

- [ ] **Step 3: Verify**

Run:

```powershell
pnpm test tests/ui/theme.test.tsx
pnpm build
```

Expected: PASS.

- [ ] **Step 4: Commit**

Run:

```powershell
git add frontend/components/theme frontend/tests/ui/theme.test.tsx frontend/app/layout.tsx
git commit -m "feat: add theme switching"
```

---

## Task 10: Implement Client Search

**Files:**

- Create: `frontend/components/search/SearchBox.tsx`
- Create: `frontend/components/search/search-client.ts`
- Create: `frontend/tests/ui/search.test.tsx`
- Modify: `frontend/app/posts/page.tsx`

- [ ] **Step 1: Write search test**

Create test:

```tsx
import { describe, expect, it } from 'vitest';
import { searchPosts } from '@/components/search/search-client';

describe('searchPosts', () => {
  const index = [
    {
      slug: 'hello-next-mdx',
      title: 'Hello Next MDX',
      excerpt: 'Build a static blog with MDX.',
      category: 'Next.js',
      tags: ['nextjs', 'mdx'],
      date: '2026-06-26',
      type: 'tech' as const,
    },
  ];

  it('matches title category and tags', () => {
    expect(searchPosts(index, 'mdx')).toHaveLength(1);
    expect(searchPosts(index, 'next.js')).toHaveLength(1);
    expect(searchPosts(index, 'missing')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Implement search client**

`searchPosts` must match lowercase query against title, excerpt, category, and tags. It must return all posts for empty query.

- [ ] **Step 3: Implement SearchBox**

Search UI must:

- fetch `/search-index.json`
- support keyword input
- support category and tag filters on `/posts`
- show highlighted matches
- show empty state when no result matches

- [ ] **Step 4: Verify**

Run:

```powershell
pnpm test tests/ui/search.test.tsx
pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add frontend/components/search frontend/tests/ui/search.test.tsx frontend/app/posts/page.tsx
git commit -m "feat: add client search"
```

---

## Task 11: Add Common Reading Experience Enhancements

**Files:**

- Create: `frontend/components/common/BackToTop.tsx`
- Create: `frontend/components/post/PostImage.tsx`
- Modify: `frontend/components/post/MdxComponents.tsx`
- Modify: `frontend/app/globals.css`

- [ ] **Step 1: Add BackToTop**

Component behavior:

- appears after scrolling down
- scrolls to top on click
- has accessible label `Back to top`

- [ ] **Step 2: Add PostImage**

Component behavior:

- requires `alt`
- renders standard `img` with `loading="lazy"`
- keeps static export compatibility

- [ ] **Step 3: Register MDX image component**

Use `PostImage` in `MdxComponents.tsx` for MDX image rendering.

- [ ] **Step 4: Verify**

Run:

```powershell
pnpm lint
pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add frontend/components/common frontend/components/post frontend/app/globals.css
git commit -m "feat: add reading experience enhancements"
```

---

## Task 12: Final MVP Verification

**Files:**

- Modify only files required by failed verification.

- [ ] **Step 1: Run full validation**

Run:

```powershell
Set-Location D:\Codex_workspace\Blog\frontend
pnpm content:check
pnpm test
pnpm lint
pnpm build
```

Expected:

```text
content:check passed
```

Tests, lint, and build all pass.

- [ ] **Step 2: Verify generated files**

Run:

```powershell
Test-Path public\robots.txt
Test-Path public\sitemap.xml
Test-Path public\rss.xml
Test-Path public\search-index.json
```

Expected:

```text
True
True
True
True
```

- [ ] **Step 3: Verify GitHub Pages static export mode**

Run:

```powershell
$env:DEPLOY_TARGET='github-pages'
$env:GITHUB_PAGES_REPO='Blog'
pnpm build
Remove-Item Env:\DEPLOY_TARGET
Remove-Item Env:\GITHUB_PAGES_REPO
```

Expected: build succeeds with static export and unoptimized images.

- [ ] **Step 4: Verify MVP exclusion boundaries**

Run:

```powershell
Get-ChildItem -Recurse . | Select-String -Pattern 'comment|analytics|login|auth|cms|database' -CaseSensitive:$false
```

Expected: no implementation files introduce backend comments, analytics, login/auth, CMS, or database features. Documentation references may appear and are acceptable.

- [ ] **Step 5: Commit final verification fixes**

Run:

```powershell
git status --short
git add frontend
git commit -m "test: verify blog MVP static build"
```

Expected: final MVP implementation is committed.

---

## Coverage Checklist

- [ ] Static Next.js app initialized.
- [ ] MDX content is parsed, validated, normalized, and filtered.
- [ ] `updated` is the only update-date field name.
- [ ] Config files are validated at build time.
- [ ] `/posts` supports pagination, category filter, tag filter, keyword search, highlights, and empty state.
- [ ] `/categories` and `/tags` overview pages exist.
- [ ] Category and tag detail pages exist.
- [ ] Post detail page supports MDX, code highlighting, line numbers, copy, TOC, reading time, dates, and adjacent post links.
- [ ] Search index excludes full body and drafts.
- [ ] RSS, Sitemap, and robots are static files.
- [ ] Theme follows system by default and supports persisted manual selection.
- [ ] Vercel / Cloudflare Pages static build path works.
- [ ] GitHub Pages export strategy is verified.
- [ ] MVP exclusions remain excluded.
