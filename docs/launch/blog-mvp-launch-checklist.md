# Blog MVP Launch Checklist

The current project can be deployed as a preview with placeholder information. Do not treat the preview as a public launch until the site URL, author links, projects, and first real posts are replaced.

For preview deployment steps, see `docs/launch/preview-deployment.md`.

## 1. Replace Real Site Configuration

- Update `frontend/config/site.ts`
  - `name`: site name shown in title and header.
  - `description`: one-sentence site description for SEO.
  - `url`: production URL, for example `https://your-domain.com`.
  - `defaultOgImage`: default social share image path under `frontend/public/images`.
  - `pageSize`: keep between 5 and 12 for the first launch.
- Update `frontend/config/author.ts`
  - `name`, `bio`, and at least one contact link or email.
- Update `frontend/config/projects.ts`
  - Keep 1-3 featured projects for the home page.
  - Use `status: "active"`, `"maintained"`, `"archived"`, or `"planned"`.
- Update `frontend/config/nav.ts` only when a page is actually ready.

## 2. Prepare First Content

- Add 3-5 published posts under `frontend/content/posts`.
- Use `frontend/content/posts/writing-template.mdx` as the writing reference.
- Keep `date` and `updated` as quoted `YYYY-MM-DD` strings.
- Use one category and multiple tags per article.
- Set `draft: false` only after the article is ready to publish.
- Add descriptive `alt` text to every MDX image.

## 3. Verify Static Assets

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

## 4. Deploy

Recommended first deployment target: Vercel.

Build settings:

- Root directory: `frontend`
- Install command: `corepack pnpm install`
- Build command: `corepack pnpm build`
- Output directory: `out`

GitHub Pages check:

```powershell
$env:DEPLOY_TARGET='github-pages'
$env:GITHUB_PAGES_REPO='Blog'
corepack pnpm build
Remove-Item Env:\DEPLOY_TARGET
Remove-Item Env:\GITHUB_PAGES_REPO
```

## 5. Rollback

- If deployment fails, keep the previous deployment active.
- Fix locally, run the full verification commands, then redeploy.
- Do not disable draft filtering or content validation to force a build through.
