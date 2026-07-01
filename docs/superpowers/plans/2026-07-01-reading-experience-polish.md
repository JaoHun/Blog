# Reading Experience Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the article reading experience and search result clarity without changing the content architecture or adding new product features.

**Architecture:** Keep data generation build-time and client behavior lightweight. Reuse existing MDX component mapping, CSS variables, and client search index; add focused presentation improvements and tests.

**Tech Stack:** Next.js App Router, React, MDX, Tailwind CSS, Vitest, Testing Library.

---

## Task 1: Search Result Highlighting

**Files:**
- Modify: `frontend/components/search/search-client.ts`
- Modify: `frontend/components/search/SearchBox.tsx`
- Modify: `frontend/tests/ui/search.test.tsx`

- [ ] Add tests that verify `highlightMatch` wraps matched text in `<mark>` and escapes unsafe HTML.
- [ ] Run the targeted search test and confirm it fails before implementation.
- [ ] Update `highlightMatch` to return safe HTML.
- [ ] Render highlighted title and excerpt in `SearchBox`.
- [ ] Run targeted and full tests.

## Task 2: MDX Reading Styles

**Files:**
- Modify: `frontend/components/post/MdxComponents.tsx`
- Modify: `frontend/components/post/PostToc.tsx`
- Modify: `frontend/app/posts/[slug]/page.tsx`
- Modify: `frontend/app/globals.css`
- Create: `frontend/tests/ui/mdx-components.test.tsx`

- [ ] Add tests for MDX blockquote, list, and inline code rendering classes.
- [ ] Add MDX mappings for blockquote, ul, ol, li, and inline code.
- [ ] Improve post article layout with a readable content class.
- [ ] Hide TOC on small screens and keep it sticky on desktop.
- [ ] Run tests, lint, and build.

## Task 3: Final Verification

**Files:**
- Modify only files required by failed verification.

- [ ] Run `corepack pnpm content:check`.
- [ ] Run `corepack pnpm test`.
- [ ] Run `corepack pnpm lint`.
- [ ] Run `corepack pnpm build`.
- [ ] Commit and push to `origin/main`.
