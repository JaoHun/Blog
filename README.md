# Blog MVP

Static-first personal blog MVP built with Next.js, MDX, file-based content, Shiki code highlighting, static search assets, RSS, Sitemap, and robots.txt.

## Current Status

This branch is ready for preview deployment and technical validation.

The following values are still placeholders and should be replaced before public launch:

- `frontend/config/site.ts`: `url`, site name, description, default OG image
- `frontend/config/author.ts`: author bio and social links
- `frontend/config/projects.ts`: real featured projects
- `frontend/content/posts/*.mdx`: first real published posts

## Local Development

Run from `frontend`:

```powershell
corepack pnpm install
corepack pnpm dev
```

## Verification

Run from `frontend`:

```powershell
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
```

The static export output is generated in `frontend/out`.

## Preview Deployment

Recommended preview target: Vercel.

Vercel settings:

- Root Directory: `frontend`
- Install Command: `corepack pnpm install`
- Build Command: `corepack pnpm build`
- Output Directory: `out`

Use the preview URL only for technical validation until real site configuration and real content are added.

## Documentation

- Requirements: `docs/requirements/blog-mvp-requirements.md`
- Overall design: `docs/designs/blog-overall-design.md`
- Technical architecture: `docs/designs/blog-technical-architecture.md`
- Launch checklist: `docs/launch/blog-mvp-launch-checklist.md`
