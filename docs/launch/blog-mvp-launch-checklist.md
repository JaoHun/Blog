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
  - Author name and GitHub link are configured.
  - Add email or more social links only when they are meant to be public.
- `frontend/config/projects.ts`
  - Current blog project is configured.
  - Add more projects only when there is useful context or a real link.

## 2. Content Readiness

- Current published post: `frontend/content/posts/static-blog-mvp.mdx`.
- Current post URL: `/posts/static-blog-mvp/`.
- Draft templates remain unpublished:
  - `frontend/content/posts/writing-template.mdx`
  - `frontend/content/posts/static-blog-writing-workflow.mdx`
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

- Home page opens and shows `JaoHun Blog`.
- `/posts/` lists the published post.
- `/posts/static-blog-mvp/` renders MDX and highlighted code.
- `/categories/` and `/tags/` render overview pages.
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`, and `/search-index.json` are reachable.
- Draft route `/posts/draft-example/` is not available in production.
- Mobile viewport has no horizontal page overflow except inside code blocks.

## 6. Rollback

- If deployment fails, keep the previous deployment active.
- Fix locally, run the full verification commands, then redeploy.
- Do not disable draft filtering or content validation to force a build through.
