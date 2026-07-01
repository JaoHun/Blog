# Post Writing Guide

This project is a static-first writing system. Articles are local MDX files, validated at build time, and published through Git.

## Writing Flow

1. Copy `frontend/content/posts/writing-template.mdx`.
2. Rename the copy with a lowercase kebab-case file name, for example `nextjs-static-export-notes.mdx`.
3. Fill in Frontmatter.
4. Keep `draft: true` while writing.
5. Write the article body in MDX.
6. Run checks from `frontend`:

```powershell
corepack pnpm content:check
corepack pnpm build
```

7. Change `draft` to `false` only when the article is ready to publish.

## Frontmatter

Required fields:

```yaml
title: "Article title"
date: "2026-07-01"
excerpt: "A concise summary between 20 and 220 characters."
category: "Next.js"
tags:
  - nextjs
draft: true
```

Optional fields:

```yaml
updated: "2026-07-01"
featured: false
sticky: false
cover: "/images/posts/article-slug/cover.png"
slug: "custom-slug"
type: "tech"
```

Rules:

- Dates must be quoted `YYYY-MM-DD` strings.
- Use `updated`, not `updateDate`.
- Use one category and one or more tags.
- Tags should be lowercase where practical.
- `draft: true` is excluded from production pages, RSS, Sitemap, and search index.
- `cover`, when present, must start with `/images/`.

## Images

Use normal MDX image syntax and always provide meaningful alt text:

```mdx
![Screenshot of the build output](/images/posts/static-blog/build-output.png)
```

Place article images under:

```text
frontend/public/images/posts/<article-slug>/
```

## Code Blocks

Always add a language tag so Shiki can highlight the code:

````mdx
```ts
export const message = 'hello';
```
````

Long code blocks can scroll horizontally on small screens.

## Common Errors

- Unquoted dates become YAML date objects and fail validation.
- Empty `tags` fails validation.
- `updated` earlier than `date` fails validation.
- Duplicate `slug` fails validation.
- Draft articles do not appear in production output.
