# Writing Workflow Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the blog's writing workflow with clear human-facing rules, reusable MDX templates, a realistic draft example, and more useful content-check warnings without changing the static-first architecture.

**Architecture:** Keep `frontend/lib/content/schema.ts` as the machine rule source. Add `docs/writing/*` as human documentation, keep templates as draft MDX files, and extend `content:check` with warning-level writing quality checks.

**Tech Stack:** Next.js static export, MDX, Zod, TypeScript, Vitest, pnpm.

---

## Task 1: Document the Writing System

**Files:**
- Create: `docs/writing/post-writing-guide.md`
- Create: `docs/writing/post-rules.md`
- Create: `docs/writing/writing-checklist.md`
- Modify: `README.md`

- [ ] Add a writing guide that explains the author workflow from copying the template to running checks.
- [ ] Add human-readable post rules that mirror `frontend/lib/content/schema.ts` and explicitly state that schema is the machine source of truth.
- [ ] Add a publishing checklist for humans.
- [ ] Add a README link to the writing guide.

## Task 2: Improve Draft Templates

**Files:**
- Modify: `frontend/content/posts/writing-template.mdx`
- Create: `frontend/content/posts/static-blog-writing-workflow.mdx`

- [ ] Update `writing-template.mdx` with stronger article structure, image syntax, code syntax, and pre-publish checklist.
- [ ] Add `static-blog-writing-workflow.mdx` as a realistic draft example that remains excluded from production.
- [ ] Run `corepack pnpm content:check`.
- [ ] Run `corepack pnpm build` and confirm the new draft is not generated as a public route.

## Task 3: Add Content Check Warnings

**Files:**
- Modify: `frontend/scripts/content-check.ts`
- Create: `frontend/tests/content/content-check.test.ts`

- [ ] Add tests for warning generation: short excerpt, too many tags, and missing optional cover.
- [ ] Implement a focused `collectWritingWarnings(posts)` helper exported from `content-check.ts`.
- [ ] Keep warnings non-blocking and errors blocking.
- [ ] Run targeted tests, full tests, lint, and build.
