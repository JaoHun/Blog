# Home Sidebar Warm Palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight personal sidebar to the home page and shift the whole site to a warmer, less heavy color palette.

**Architecture:** Keep the technical sidebar separate from the home sidebar. Implement the home sidebar as a small reusable server component backed by existing author config and i18n messages, then wrap only the home page with the existing two-column layout helper. Implement the palette by changing global CSS variables in one place, preserving the existing theme switch and code block readability.

**Tech Stack:** Next.js App Router static export, React Server Components, TypeScript, Tailwind CSS v4 theme variables, Vitest, Testing Library.

## Global Constraints

- Apply the home sidebar only to `/` and `/en/`.
- Do not add the technical sidebar to the home page.
- Home sidebar must provide both personal context and navigation entry points.
- Home sidebar content can stay intentionally light until real personal details are available.
- Do not add avatar/profile photo, background image, visitor statistics, comments, category/tag statistics, latest posts list, or complex sidebar customization.
- Apply the warm palette globally across home, technical, post, category, tag, about, and project pages.
- Keep existing system theme behavior and manual theme switch.
- Do not break code highlighting readability in light or dark mode.
- Avoid page-specific hardcoded color values for the palette change.
- Existing `content:check`, `test`, `lint`, `build`, and `launch:check` must pass.

---

## File Structure

- Create `frontend/components/sidebar/HomeSidebar.tsx`
  - Renders the home-only personal card, current focus, and quick links.
- Modify `frontend/lib/i18n.ts`
  - Adds localized `homeSidebar` copy for Chinese and English.
- Modify `frontend/app/_localized-pages.tsx`
  - Wraps only `HomePage` with `ContentWithSidebar` and `HomeSidebar`.
- Modify `frontend/app/globals.css`
  - Updates global theme variables to warm neutral light and softer charcoal dark colors.
- Modify `frontend/app/page.test.tsx`
  - Verifies home sidebar appears on the default Chinese home page.
- Create `frontend/tests/ui/home-sidebar.test.tsx`
  - Verifies the home sidebar component renders localized personal context and quick links.
- Modify `frontend/tests/ui/theme.test.tsx`
  - Verifies updated theme variables remain present and distinguish light/dark values.
- Modify `frontend/scripts/launch-check.ts`
  - Verifies generated home pages include the home sidebar markers.

---

### Task 1: Home Sidebar Messages And Component

**Files:**
- Create: `frontend/components/sidebar/HomeSidebar.tsx`
- Modify: `frontend/lib/i18n.ts`
- Test: `frontend/tests/ui/home-sidebar.test.tsx`

**Interfaces:**
- Consumes:
  - `type Lang` from `@/lib/content/posts`
  - `authorConfig.name`
  - `authorConfig.links`
  - `getAuthorBio(lang)`
  - `localizedPath(pathname, lang)`
  - `messages[lang].homeSidebar`
- Produces:
  - `HomeSidebar({ lang }: { lang: Lang }): ReactElement`

- [ ] **Step 1: Add failing component test**

Create `frontend/tests/ui/home-sidebar.test.tsx`:

```tsx
import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HomeSidebar } from '@/components/sidebar/HomeSidebar';

describe('HomeSidebar', () => {
  it('renders Chinese personal context and navigation links', () => {
    render(<HomeSidebar lang="zh" />);

    expect(screen.getByRole('heading', { name: 'JaoHun' })).toBeTruthy();
    expect(screen.getByText('当前关注')).toBeTruthy();
    expect(screen.getByText('慢慢记录日常、技术笔记和项目过程。')).toBeTruthy();
    expect(screen.getByRole('link', { name: '技术笔记与项目记录' })).toHaveAttribute('href', '/tech');
    expect(screen.getByRole('link', { name: '关于我' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/JaoHun');
  });

  it('renders English personal context and localized links', () => {
    render(<HomeSidebar lang="en" />);

    expect(screen.getByText('Current focus')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Technical notes and project records' })).toHaveAttribute(
      'href',
      '/en/tech',
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/en/about');
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```powershell
cd D:\Codex_workspace\Blog\frontend
corepack pnpm test -- tests/ui/home-sidebar.test.tsx
```

Expected: FAIL because `HomeSidebar` and `homeSidebar` messages do not exist.

- [ ] **Step 3: Add localized messages**

Modify `frontend/lib/i18n.ts` by adding this object to both language entries.

Chinese:

```ts
homeSidebar: {
  label: '个人侧栏',
  focusTitle: '当前关注',
  focusDescription: '慢慢记录日常、技术笔记和项目过程。',
  linksTitle: '快速入口',
  tech: '技术笔记与项目记录',
  about: '关于我',
  github: 'GitHub',
},
```

English:

```ts
homeSidebar: {
  label: 'Personal sidebar',
  focusTitle: 'Current focus',
  focusDescription: 'Slowly recording daily notes, technical writing, and project process.',
  linksTitle: 'Quick links',
  tech: 'Technical notes and project records',
  about: 'About',
  github: 'GitHub',
},
```

Use actual UTF-8 Chinese text in source. If PowerShell displays mojibake, verify with:

```powershell
node -e "const fs=require('fs'); const s=fs.readFileSync('lib/i18n.ts','utf8'); console.log(s.includes('当前关注')); console.log(s.includes('慢慢记录日常、技术笔记和项目过程。'));"
```

- [ ] **Step 4: Implement `HomeSidebar`**

Create `frontend/components/sidebar/HomeSidebar.tsx`:

```tsx
import type { ReactElement } from 'react';
import Link from 'next/link';

import { ExternalLink } from '@/components/common/ExternalLink';
import { authorConfig, getAuthorBio } from '@/config/author';
import type { Lang } from '@/lib/content/posts';
import { localizedPath, messages } from '@/lib/i18n';

type HomeSidebarProps = {
  lang: Lang;
};

export function HomeSidebar({ lang }: HomeSidebarProps): ReactElement {
  const t = messages[lang].homeSidebar;
  const github = authorConfig.links.find((link) => link.label === 'GitHub');

  return (
    <div aria-label={t.label} className="space-y-5 text-sm">
      <section className="rounded-lg border border-border bg-background/70 p-5">
        <h2 className="text-xl font-semibold tracking-tight">{authorConfig.name}</h2>
        <p className="mt-3 leading-6 text-muted">{getAuthorBio(lang)}</p>
      </section>

      <section className="rounded-lg border border-border bg-background/70 p-5">
        <h2 className="text-base font-semibold">{t.focusTitle}</h2>
        <p className="mt-3 leading-6 text-muted">{t.focusDescription}</p>
      </section>

      <nav aria-label={t.linksTitle} className="rounded-lg border border-border bg-background/70 p-5">
        <h2 className="text-base font-semibold">{t.linksTitle}</h2>
        <div className="mt-4 grid gap-3">
          <Link className="text-link transition hover:text-foreground" href={localizedPath('/tech', lang)}>
            {t.tech}
          </Link>
          <Link className="text-link transition hover:text-foreground" href={localizedPath('/about', lang)}>
            {t.about}
          </Link>
          {github ? (
            <ExternalLink className="text-link transition hover:text-foreground" href={github.href}>
              {t.github}
            </ExternalLink>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
```

- [ ] **Step 5: Run component test**

Run:

```powershell
corepack pnpm test -- tests/ui/home-sidebar.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```powershell
git add frontend/lib/i18n.ts frontend/components/sidebar/HomeSidebar.tsx frontend/tests/ui/home-sidebar.test.tsx
git commit -m "feat: add home personal sidebar"
```

---

### Task 2: Apply Home Sidebar To Home Page

**Files:**
- Modify: `frontend/app/_localized-pages.tsx`
- Modify: `frontend/app/page.test.tsx`
- Modify: `frontend/scripts/launch-check.ts`

**Interfaces:**
- Consumes:
  - `HomeSidebar({ lang })`
  - `ContentWithSidebar({ children, sidebar })`
- Produces:
  - `/` and `/en/` render home content first and lightweight personal sidebar second.

- [ ] **Step 1: Update home page test first**

Modify `frontend/app/page.test.tsx` to keep the current heading/link checks and add:

```tsx
expect(screen.getByLabelText('个人侧栏')).toBeTruthy();
expect(screen.getByText('当前关注')).toBeTruthy();
expect(screen.getByRole('link', { name: '关于我' })).toHaveAttribute('href', '/about');
```

- [ ] **Step 2: Run failing home test**

Run:

```powershell
cd D:\Codex_workspace\Blog\frontend
corepack pnpm test -- app/page.test.tsx
```

Expected: FAIL because the home page does not yet render `HomeSidebar`.

- [ ] **Step 3: Wrap `HomePage`**

Modify `frontend/app/_localized-pages.tsx`:

```tsx
import { HomeSidebar } from '@/components/sidebar/HomeSidebar';
```

Change `HomePage` return to:

```tsx
return (
  <ContentWithSidebar sidebar={<HomeSidebar lang={lang} />}>
    <div className="space-y-12">
      {/* existing home sections unchanged */}
    </div>
  </ContentWithSidebar>
);
```

Do not modify `TechPage`, article pages, category pages, tag pages, or project pages in this task.

- [ ] **Step 4: Update launch check**

Modify `frontend/scripts/launch-check.ts` so generated home pages verify the home sidebar:

```ts
const home = await readOutFile('index.html');
const enHome = await readOutFile('en/index.html');

assertContains(home, '个人侧栏', 'home sidebar');
assertContains(home, '当前关注', 'home sidebar');
assertContains(enHome, 'Personal sidebar', 'English home sidebar');
assertContains(enHome, 'Current focus', 'English home sidebar');
```

Reuse existing `home` variables if the script already has them. Do not duplicate reads of the same file if a variable already exists.

- [ ] **Step 5: Run focused verification**

Run:

```powershell
corepack pnpm test -- app/page.test.tsx tests/ui/home-sidebar.test.tsx
corepack pnpm lint
corepack pnpm build
corepack pnpm launch:check
```

Expected: all PASS.

- [ ] **Step 6: Commit**

Run:

```powershell
git add frontend/app/_localized-pages.tsx frontend/app/page.test.tsx frontend/scripts/launch-check.ts
git commit -m "feat: show personal sidebar on home"
```

---

### Task 3: Warm Global Palette

**Files:**
- Modify: `frontend/app/globals.css`
- Modify: `frontend/tests/ui/theme.test.tsx`

**Interfaces:**
- Consumes:
  - Existing CSS variable names: `--background`, `--foreground`, `--muted`, `--border`, `--link`, `--code-bg`, `--code-fg`, `--accent`.
- Produces:
  - Warmer global light and dark palette without changing theme switch behavior.

- [ ] **Step 1: Update theme test first**

Modify `frontend/tests/ui/theme.test.tsx` to assert the global CSS contains these target values:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Keep existing ThemeToggle tests. Add this test in the same file.
it('defines the warm global palette tokens', () => {
  const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

expect(css).toContain('--background: #faf7f2');
expect(css).toContain('--foreground: #2f2a25');
expect(css).toContain('--muted: #6f665d');
expect(css).toContain('--border: #e6ded4');
expect(css).toContain('--link: #2f6f9f');
expect(css).toContain('--code-bg: #f3eee7');
expect(css).toContain('--code-fg: #1f2933');
expect(css).toContain('--accent: #2f6f9f');
expect(css).toContain('--background: #181715');
expect(css).toContain('--foreground: #eee9e2');
expect(css).toContain('--muted: #b8afa4');
expect(css).toContain('--border: #34302b');
expect(css).toContain('--link: #8ab6d6');
expect(css).toContain('--code-bg: #211f1c');
expect(css).toContain('--code-fg: #f8f4ee');
expect(css).toContain('--accent: #8ab6d6');
});
```

Keep the existing `ThemeToggle` interaction tests unchanged.

- [ ] **Step 2: Run failing theme test**

Run:

```powershell
cd D:\Codex_workspace\Blog\frontend
corepack pnpm test -- tests/ui/theme.test.tsx
```

Expected: FAIL because the palette variables still use the old values.

- [ ] **Step 3: Update CSS variables**

Modify `frontend/app/globals.css`:

```css
:root {
  --background: #faf7f2;
  --foreground: #2f2a25;
  --muted: #6f665d;
  --border: #e6ded4;
  --link: #2f6f9f;
  --code-bg: #f3eee7;
  --code-fg: #1f2933;
  --accent: #2f6f9f;
}

[data-theme="dark"] {
  --background: #181715;
  --foreground: #eee9e2;
  --muted: #b8afa4;
  --border: #34302b;
  --link: #8ab6d6;
  --code-bg: #211f1c;
  --code-fg: #f8f4ee;
  --accent: #8ab6d6;
}
```

Do not add a background image, heavy gradient, decorative blobs, or new theme presets.

- [ ] **Step 4: Run focused verification**

Run:

```powershell
corepack pnpm test -- tests/ui/theme.test.tsx tests/ui/reading-experience.test.tsx
corepack pnpm lint
corepack pnpm build
corepack pnpm launch:check
```

Expected: all PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add frontend/app/globals.css frontend/tests/ui/theme.test.tsx
git commit -m "style: warm global site palette"
```

---

### Task 4: Final Verification And Documentation Alignment

**Files:**
- Modify: `docs/superpowers/specs/2026-08-01-home-personal-sidebar-design.md`
- Modify: `docs/superpowers/specs/2026-08-01-warm-site-palette-design.md`
- Modify: `docs/launch/blog-mvp-launch-checklist.md`

**Interfaces:**
- Consumes:
  - Final behavior from Tasks 1-3.
- Produces:
  - Documentation and checklist matching implemented home sidebar and warm palette behavior.

- [ ] **Step 1: Update design docs status**

Append this section to `docs/superpowers/specs/2026-08-01-home-personal-sidebar-design.md`:

```md
## Implementation Status

Implemented for:

- `/`
- `/en/`

The home sidebar is intentionally lightweight and contains personal context plus quick navigation links. Richer personal content can be added later without changing the layout.
```

Append this section to `docs/superpowers/specs/2026-08-01-warm-site-palette-design.md`:

```md
## Implementation Status

Implemented as global CSS variable updates in `frontend/app/globals.css`.

The first version does not use a background image. It keeps the existing theme switch behavior and preserves readable code block colors.
```

- [ ] **Step 2: Update launch checklist**

Add these acceptance checks to `docs/launch/blog-mvp-launch-checklist.md`:

```md
- `/` and `/en/` show the lightweight personal sidebar on desktop.
- Home sidebar stacks below the main home content on mobile.
- Global light and dark themes use the warmer palette.
- Code blocks remain readable in both themes.
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

Expected before commit: only docs changed, plus possible build-generated public-file line-ending noise. Do not commit generated public-file noise unless there is a real content diff.

- [ ] **Step 5: Commit documentation**

Run:

```powershell
git add docs/superpowers/specs/2026-08-01-home-personal-sidebar-design.md docs/superpowers/specs/2026-08-01-warm-site-palette-design.md docs/launch/blog-mvp-launch-checklist.md
git commit -m "docs: update home sidebar launch checklist"
```

---

## Self-Review

- Spec coverage: The plan covers homepage sidebar, personal context, navigation links, deliberately light first-version content, global warm palette, no background image, theme preservation, code readability, tests, launch checks, and docs.
- Placeholder scan: No TBD, TODO, vague "add tests", or unspecified files remain.
- Type consistency: `HomeSidebar({ lang }: { lang: Lang }): ReactElement` is defined once and consumed by `HomePage`.
- Scope check: The plan keeps home sidebar separate from the technical sidebar and keeps palette changes centralized in global CSS variables.
