# JaoHun Blog

Static-first personal technical blog built with Next.js, MDX, file-based content, Shiki code highlighting, static search assets, RSS, Sitemap, and robots.txt.

## Current Status

The project is ready for public preview as a lightweight personal blog base. It includes one real published article, validated draft templates, GitHub deployment flow, and static export output for Vercel or other static hosting platforms.

Remaining work before a formal launch:

- Add 2-3 more real technical posts.
- Replace or add a stable custom domain when ready.
- Add a real default Open Graph image under `frontend/public/images`.
- Add more real projects to `frontend/config/projects.ts` when available.
- Update `frontend/config/footer.ts` when ICP filing or footer links are ready.

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

## Vercel Preview Deployment

Current Vercel preview URL:

```text
https://blog-nu-wine-76.vercel.app
```

This repository includes a root-level `vercel.json`. Import `JaoHun/Blog` in Vercel and keep the project root as the repository root.

The included Vercel settings are:

- Install Command: `cd frontend && corepack pnpm install --frozen-lockfile`
- Build Command: `cd frontend && corepack pnpm build`
- Output Directory: `frontend/out`

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
- Writing guide: `docs/writing/post-writing-guide.md`
- Writing rules: `docs/writing/post-rules.md`
- Publishing checklist: `docs/writing/writing-checklist.md`
- Launch checklist: `docs/launch/blog-mvp-launch-checklist.md`
- Preview deployment: `docs/launch/preview-deployment.md`
- Domestic server deployment: `docs/launch/domestic-server-deployment.md`
