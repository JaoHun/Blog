# Blog MVP Launch Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the current static blog MVP from functional scaffold to launch-ready quality without expanding product scope.

**Architecture:** Keep the static-first Next.js + MDX architecture unchanged. Improve the existing MDX code path with build-time Shiki rendering, add deployment/content handoff documentation, and verify the static export matrix.

**Tech Stack:** Next.js App Router, TypeScript, MDX, Shiki, Vitest, pnpm, static export.

---

## Task 1: Add Shiki Syntax Highlighting

**Files:**
- Create: `frontend/lib/content/highlight.ts`
- Modify: `frontend/components/post/CodeBlock.tsx`
- Create: `frontend/tests/content/highlight.test.ts`

- [ ] Write a failing test that verifies highlighted HTML contains Shiki token spans and preserves code text.
- [ ] Run `corepack pnpm test tests/content/highlight.test.ts` and confirm it fails because the highlighter module does not exist.
- [ ] Implement `highlightCode(code, language)` with Shiki using light/dark theme CSS variables.
- [ ] Update `CodeBlock` to render highlighted HTML while preserving line numbers, copy, and horizontal scrolling.
- [ ] Run targeted tests, full tests, lint, and build.
- [ ] Commit with `feat: add shiki code highlighting`.

## Task 2: Add Launch Handoff Documentation

**Files:**
- Create: `docs/launch/blog-mvp-launch-checklist.md`
- Create: `frontend/content/posts/writing-template.mdx`

- [ ] Add a launch checklist covering real config replacement, first posts, SEO files, deployment targets, and rollback.
- [ ] Add a draft MDX writing template with valid Frontmatter, kept out of production through `draft: true`.
- [ ] Run `corepack pnpm content:check` and `corepack pnpm build`.
- [ ] Commit with `docs: add blog launch checklist`.

## Task 3: Final Launch-Readiness Verification

**Files:**
- Modify only files required by failed verification.

- [ ] Run `corepack pnpm content:check`.
- [ ] Run `corepack pnpm test`.
- [ ] Run `corepack pnpm lint`.
- [ ] Run `corepack pnpm build`.
- [ ] Verify `public/robots.txt`, `public/sitemap.xml`, `public/rss.xml`, and `public/search-index.json` exist.
- [ ] Run GitHub Pages export build with `DEPLOY_TARGET=github-pages` and `GITHUB_PAGES_REPO=Blog`.
- [ ] Check implementation files do not introduce comments, analytics, login/auth, CMS, or database features.
- [ ] Commit any verification fixes only if needed.
