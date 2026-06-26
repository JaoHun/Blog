# Preview Deployment Guide

This guide is for deploying the current MVP as a preview site while keeping placeholder content.

## What This Preview Proves

- Static build completes.
- MDX posts render.
- Draft posts are filtered from production pages.
- RSS, Sitemap, robots.txt, and search index are generated.
- Theme switching, search, code highlighting, TOC, and copy-code work in a hosted environment.

## What This Preview Does Not Prove

- Final SEO quality, because `siteConfig.url` is still `https://blog.example.com`.
- Final author branding, because author links are placeholders.
- Final content quality, because sample posts are still present.

## Vercel Preview Steps

1. Import the repository into Vercel.
2. Set Root Directory to `frontend`.
3. Set Install Command to:

```powershell
corepack pnpm install
```

4. Set Build Command to:

```powershell
corepack pnpm build
```

5. Set Output Directory to:

```text
out
```

6. Deploy and open the generated preview URL.

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

- `frontend/config/site.ts`
- `frontend/config/author.ts`
- `frontend/config/projects.ts`
- `frontend/content/posts/*.mdx`
