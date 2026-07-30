# JaoHun Blog Frontend

This is the static frontend for JaoHun Blog. It uses Next.js static export, MDX content files, build-time content validation, Shiki code highlighting, local search assets, RSS, Sitemap, and robots.txt generation.

Chinese is the default language. English pages are generated under `/en` with explicit static routes so `output: 'export'` remains supported.

## Development

```powershell
corepack pnpm install
corepack pnpm dev
```

Open `http://localhost:3000`.

## Verification

```powershell
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
```

The static output is generated in `out`.

## Static Preview

```powershell
corepack pnpm preview
```

Open `http://localhost:4173`.

## Content

Posts live in `content/posts`. Keep drafts with `draft: true`; production builds automatically filter them out.

Site, author, navigation, footer, and project data live in `config`.
