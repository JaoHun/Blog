# Subtle Language Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing language switch less prominent while preserving bilingual routing.

**Architecture:** Keep `SiteHeader` as the single owner of header navigation. Change only the rendered language label and utility-control styling, then add a focused header test for Chinese and English paths.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library.

## Global Constraints

- Do not remove `/en` routes.
- Do not add a dropdown or language menu.
- Chinese pages show compact label `EN`.
- English pages show compact label `中`.
- Keep theme toggle behavior unchanged.
- Existing `test`, `lint`, `build`, and `launch:check` must pass.

---

### Task 1: Header Language Switch

**Files:**
- Modify: `frontend/components/layout/SiteHeader.tsx`
- Create: `frontend/tests/ui/site-header.test.tsx`

**Interfaces:**
- Consumes: existing `toggleLanguagePath(pathname, lang)`.
- Produces: compact language switch labels without changing target URLs.

- [ ] **Step 1: Add focused header tests**

Mock `next/navigation` `usePathname`.

Assert:

```tsx
expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
expect(screen.queryByRole('link', { name: 'English' })).toBeNull();
```

For `/en`, assert:

```tsx
expect(screen.getByRole('link', { name: '中' })).toHaveAttribute('href', '/');
```

- [ ] **Step 2: Update `SiteHeader`**

Change the language switch class to match a low-weight utility button:

```tsx
className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:text-foreground"
```

Change label:

```tsx
{lang === 'zh' ? 'EN' : '中'}
```

- [ ] **Step 3: Verify and commit**

Run:

```powershell
cd D:\Codex_workspace\Blog\frontend
corepack pnpm test -- tests/ui/site-header.test.tsx
corepack pnpm lint
corepack pnpm build
corepack pnpm launch:check
```

Commit:

```powershell
git add frontend/components/layout/SiteHeader.tsx frontend/tests/ui/site-header.test.tsx docs/superpowers/specs/2026-08-01-subtle-language-switch-design.md docs/superpowers/plans/2026-08-01-subtle-language-switch.md
git commit -m "feat: make language switch subtle"
```

