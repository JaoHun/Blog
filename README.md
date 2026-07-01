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

## Local Static Preview

After `corepack pnpm build`, run from `frontend`:

```powershell
corepack pnpm preview
```

Then open `http://localhost:4173`.

## Preview Deployment

Recommended preview target: Vercel.

This repository includes a root-level `vercel.json` for preview deployment. Import `JaoHun/Blog` in Vercel and keep the project root as the repository root.

The included Vercel settings are:

- Install Command: `cd frontend && corepack pnpm install --frozen-lockfile`
- Build Command: `cd frontend && corepack pnpm build`
- Output Directory: `frontend/out`

Manual fallback settings, if you choose Root Directory `frontend` in the Vercel UI:

- Install Command: `corepack pnpm install --frozen-lockfile`
- Build Command: `corepack pnpm build`
- Output Directory: `out`

Use the preview URL only for technical validation until real site configuration and real content are added.

## Domestic Temporary Deployment

For domestic access testing without a domain, build with `SITE_URL` set to the server IP and deploy `frontend/out` behind Nginx:

```powershell
cd frontend
$env:SITE_URL='http://SERVER_PUBLIC_IP'
corepack pnpm build
Remove-Item Env:\SITE_URL
```

See `docs/launch/domestic-server-deployment.md`.

## Documentation

- Requirements: `docs/requirements/blog-mvp-requirements.md`
- Overall design: `docs/designs/blog-overall-design.md`
- Technical architecture: `docs/designs/blog-technical-architecture.md`
- Launch checklist: `docs/launch/blog-mvp-launch-checklist.md`
- Domestic server deployment: `docs/launch/domestic-server-deployment.md`
