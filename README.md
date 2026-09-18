# JaoHun Blog

这是一个以静态内容为主导的个人技术博客，使用 Next.js、MDX、基于文件的内容、Shiki 代码高亮显示、静态搜索资源、RSS、站点地图和 robots.txt 构建。

## Current Status

该项目已准备好上线了，这只是一个轻量级的个人博客平台。它包含已发布的真实文章、经过验证的草稿模板、GitHub部署流程，以及用于Vercel或其他静态托管平台的静态导出输出。

默认语言为中文。英文页面生成时/en未使用 Next.js 内置的 i18n 功能，因此仍然支持静态导出。

Remaining work before a formal launch:

- Add 2-3 more real technical posts.
- Replace or add a stable custom domain when ready.
- Add a real default Open Graph image under `frontend/public/images`.
- Add more real projects to `frontend/config/projects.ts` when available.
- Update `frontend/config/footer.ts` when ICP filing or footer links are ready.
- Add both Chinese and English versions when publishing important posts.

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
corepack pnpm launch:check
```

The static export output is generated in `frontend/out`.

## Create A Draft Post

Run from `frontend`:

```powershell
corepack pnpm new-post "文章标题"
```

This creates a Chinese draft under `frontend/content/posts` with required Frontmatter filled in.

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
- Writing guide and checklist: `docs/writing/post-writing-guide.md`
- Launch checklist: `docs/launch/blog-mvp-launch-checklist.md`
- Preview deployment: `docs/launch/preview-deployment.md`
- Domestic server deployment: `docs/launch/domestic-server-deployment.md`
