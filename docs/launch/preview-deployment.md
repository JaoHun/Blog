# Preview Deployment Guide

This guide is for deploying the current static blog as a public preview site.

## What This Preview Proves

- Static build completes.
- MDX posts render.
- Draft posts are filtered from production pages.
- RSS, Sitemap, robots.txt, and search index are generated.
- Theme switching, search, code highlighting, TOC, and copy-code work in a hosted environment.

## Current Preview URL

The current Vercel preview domain is:

```text
https://blog-nu-wine-76.vercel.app
```

`frontend/config/site.ts` resolves the public site URL from `SITE_URL`, falling back to this Vercel URL. RSS, Sitemap, Canonical, and Open Graph links use that resolved URL.

## Remaining Limits

- No stable custom domain has been configured yet.
- The default Open Graph image still needs a real branded image.
- The site has only one real published post; publish more before treating it as a complete personal brand site.

## Vercel Preview Steps

1. Import `JaoHun/Blog` into Vercel.
2. Keep Root Directory as the repository root.
3. Vercel should read the root-level `vercel.json`.
4. Confirm the detected settings:

```text
Install Command: cd frontend && corepack pnpm install --frozen-lockfile
Build Command: cd frontend && corepack pnpm build
Output Directory: frontend/out
```

5. Deploy and open the generated preview URL.

Manual fallback settings, if you choose Root Directory `frontend` in the Vercel UI:

```text
Install Command: corepack pnpm install --frozen-lockfile
Build Command: corepack pnpm build
Output Directory: out
```

## Local Static Preview

Run from `frontend`:

```powershell
corepack pnpm build
corepack pnpm preview
```

Open `http://localhost:4173` and verify the checklist below before deploying.

## Preview Acceptance Checklist

- Home page renders without broken layout.
- `/posts/` lists published posts and search can find `MDX`.
- `/posts/static-blog-mvp/` renders code with highlighted tokens, line numbers, and copy button.
- `/categories/` and `/tags/` render overview pages.
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`, and `/search-index.json` are reachable.
- Mobile viewport has no horizontal page overflow except inside code blocks.

## Before Formal Launch

- Publish at least 3 real posts.
- Add a stable custom domain if the site will be shared widely.
- Add a real default Open Graph image.
- Review `frontend/config/projects.ts` and remove anything that is not useful to show publicly.
