# Blog MVP Launch Checklist

The current project is ready for public preview. Use this checklist before treating it as a formal personal-brand launch.

For preview deployment steps, see `docs/launch/preview-deployment.md`.

## 1. Site Configuration

- `frontend/config/site.ts`
  - `name`: `JaoHun Blog`
  - `description`: public SEO description.
  - `url`: currently resolved from `SITE_URL`, with Vercel fallback.
  - `defaultOgImage`: still uses the default path and should receive a real image later.
  - `pageSize`: keep between 5 and 12 for the first launch.
- `frontend/config/author.ts`
  - Author name, GitHub link, and skills are configured.
  - Add email or more social links only when they are meant to be public.
- `frontend/config/footer.ts`
  - Copyright text is configured.
  - ICP fields are intentionally empty until a formal domain and filing are ready.
  - Add footer links only when they are useful for public navigation.
- `frontend/config/projects.ts`
  - Current blog project is configured.
  - Add more projects only when there is useful context or a real link.

## 2. Content Readiness

- Current published post: `frontend/content/posts/static-blog-mvp.mdx`.
- Current post URL: `/posts/static-blog-mvp/`.
- Draft templates remain unpublished:
  - `frontend/content/posts/writing-template.mdx`
  - `frontend/content/posts/draft-example.mdx`
- Recommended before formal launch: publish at least 3 real posts.

## 3. Verification

Run from `frontend`:

```powershell
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
```

Confirm these files exist after build:

- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml`
- `frontend/public/rss.xml`
- `frontend/public/rss.en.xml`
- `frontend/public/search-index.json`

## 4. Deployment

Recommended preview target: Vercel.

Root-level `vercel.json` settings:

- Install command: `cd frontend && corepack pnpm install --frozen-lockfile`
- Build command: `cd frontend && corepack pnpm build`
- Output directory: `frontend/out`

Manual fallback settings, if the Vercel project root is set to `frontend`:

- Install command: `corepack pnpm install --frozen-lockfile`
- Build command: `corepack pnpm build`
- Output directory: `out`

## 5. Acceptance Checks

Run after `corepack pnpm build`:

```powershell
corepack pnpm launch:check
```

- Home page opens and shows the personal notes/sharing positioning.
- Home page links to the life notes and photo records section.
- Home page links to the technical notes and project records section.
- `/moments/` renders the life notes and photo records section.
- `/en/moments/` renders the English life notes and photo records section.
- `/tech/` renders the technical notes and project records section.
- `/tech/` and `/posts/` show the technical content sidebar on desktop.
- `/en/tech/` renders the English technical section.
- Chinese is the default language at `/`; English is available at `/en/`.
- Header language switch works between `/` and `/en/`.
- Header includes the moments navigation link in both languages.
- `/posts/` lists the published post.
- `/en/posts/` lists the English version of the published post.
- `/posts/page/1/` may exist as a static export compatibility route; the canonical first page remains `/posts/`.
- `/posts/static-blog-mvp/` renders MDX and highlighted code.
- `/posts/static-blog-mvp/` shows author context, TOC, and latest posts in one right sidebar.
- `/en/posts/static-blog-mvp/` renders the English MDX article.
- `/categories/` and `/tags/` render overview pages.
- `/rss.xml`, `/rss.en.xml`, `/sitemap.xml`, `/robots.txt`, and `/search-index.json` are reachable.
- Draft route `/posts/draft-example/` is not available in production.
- Mobile viewport has no horizontal page overflow except inside code blocks.
- Mobile layout stacks the sidebar below the main content.
- `/` and `/en/` show the lightweight personal sidebar on desktop.
- Home sidebar stacks below the main home content on mobile.
- Global light and dark themes use the warmer palette.
- Code blocks remain readable in both themes.

## 6. Rollback

- If deployment fails, keep the previous deployment active.
- Fix locally, run the full verification commands, then redeploy.
- Do not disable draft filtering or content validation to force a build through.
