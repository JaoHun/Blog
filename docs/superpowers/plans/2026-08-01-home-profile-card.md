# Home Profile Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the home sidebar into a personal profile card with avatar, content stats, GitHub action, and quick links.

**Architecture:** Keep content data loading in the async home page. Pass a small stats object into the presentational `HomeSidebar` component. Reuse current Tailwind tokens and avoid new dependencies.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, Testing Library.

## Global Constraints

- Keep the site statically exportable.
- Do not add runtime services or external counters.
- Draft posts must not count toward public stats.
- Keep animation subtle and disable it for reduced-motion users.
- Do not add comments, friend links, visitor analytics, or new routes in this iteration.

---

### Task 1: Pass Home Stats Into Sidebar

**Files:**
- Modify: `frontend/app/_localized-pages.tsx`
- Modify: `frontend/components/sidebar/HomeSidebar.tsx`

**Interfaces:**
- Produces: `HomeSidebarStats = { posts: number; categories: number; tags: number }`
- Consumes: `HomeSidebar({ lang, stats }: { lang: Lang; stats: HomeSidebarStats })`

- [ ] **Step 1: Add a test expectation for stats**

```tsx
render(<HomeSidebar lang="en" stats={{ posts: 4, categories: 2, tags: 7 }} />);

expect(screen.getByText('4')).toBeInTheDocument();
expect(screen.getByText('Posts')).toBeInTheDocument();
expect(screen.getByText('2')).toBeInTheDocument();
expect(screen.getByText('Categories')).toBeInTheDocument();
expect(screen.getByText('7')).toBeInTheDocument();
expect(screen.getByText('Tags')).toBeInTheDocument();
```

- [ ] **Step 2: Run the sidebar test and confirm it fails**

Run: `corepack pnpm test -- tests/ui/home-sidebar.test.tsx`

Expected: the new stat labels or numbers are missing.

- [ ] **Step 3: Compute stats in `HomePage`**

```tsx
const posts = await getPublishedPosts(lang);
const stats = {
  posts: posts.length,
  categories: new Set(posts.map((post) => post.category)).size,
  tags: new Set(posts.flatMap((post) => post.tags)).size,
};
```

- [ ] **Step 4: Pass stats to `HomeSidebar`**

```tsx
<ContentWithSidebar sidebar={<HomeSidebar lang={lang} stats={stats} />}>
```

### Task 2: Build the Profile Card UI

**Files:**
- Modify: `frontend/components/sidebar/HomeSidebar.tsx`
- Modify: `frontend/lib/i18n.ts`
- Test: `frontend/tests/ui/home-sidebar.test.tsx`

**Interfaces:**
- Consumes: `messages[lang].sidebar.posts`, `messages[lang].sidebar.categories`, `messages[lang].sidebar.tags`

- [ ] **Step 1: Render avatar, name, bio, stats, GitHub button, and links**

Use a single primary card for identity and stats, then keep a compact quick-links card below it.

- [ ] **Step 2: Keep hover animation restrained**

Use `hover:rotate-[360deg]` and `motion-reduce:hover:rotate-0`.

- [ ] **Step 3: Promote GitHub only when configured**

If `authorConfig.links` does not contain `GitHub`, omit the button.

### Task 3: Verify

**Files:**
- Test: `frontend/tests/ui/home-sidebar.test.tsx`

- [ ] **Step 1: Run focused UI test**

Run: `corepack pnpm test -- tests/ui/home-sidebar.test.tsx`

- [ ] **Step 2: Run lint**

Run: `corepack pnpm lint`

- [ ] **Step 3: Run build**

Run: `corepack pnpm build`

- [ ] **Step 4: Run static launch check**

Run: `corepack pnpm launch:check`

- [ ] **Step 5: Confirm local preview**

Request `http://localhost:4173/` and confirm the response contains `jaohun-avatar.png`.
