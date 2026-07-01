# Preview Deployment Guide

This guide is for deploying the current MVP as a preview site while keeping placeholder content.

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

`frontend/config/site.ts` uses this URL so RSS, Sitemap, Canonical, and Open Graph links point at the deployed preview site.

## What This Preview Does Not Prove

- Final production SEO quality, because a stable custom domain has not been configured yet.
- Final author branding, because author links are placeholders.
- Final content quality, because sample posts are still present.

## Vercel Preview Steps

1. Import the repository into Vercel.
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

```powershell
Install Command:
corepack pnpm install

Build Command:
corepack pnpm build

Output Directory:
out
```

## GitHub Pages Preview Check

Run locally from `frontend` before configuring Pages:

```powershell
$env:DEPLOY_TARGET='github-pages'
$env:GITHUB_PAGES_REPO='Blog'
corepack pnpm build
Remove-Item Env:\DEPLOY_TARGET
Remove-Item Env:\GITHUB_PAGES_REPO
```

Use GitHub Pages only after confirming the repository name matches `GITHUB_PAGES_REPO`.

## Local Static Preview

Run from `frontend`:

```powershell
corepack pnpm build
corepack pnpm preview
```

Open `http://localhost:4173` and verify the same checklist below before deploying.

## Preview Acceptance Checklist

- Home page renders without console-visible broken layout.
- `/posts` lists published posts and search can find `MDX`.
- `/posts/hello-next-mdx` renders code with highlighted tokens, line numbers, and copy button.
- `/categories` and `/tags` render overview pages.
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`, and `/search-index.json` are reachable.
- Mobile viewport has no horizontal page overflow except inside code blocks.

## Before Public Launch

Replace placeholder config and content before indexing or sharing the site publicly:

- `frontend/config/site.ts` if you add a custom domain later
- `frontend/config/author.ts`
- `frontend/config/projects.ts`
- `frontend/content/posts/*.mdx`
