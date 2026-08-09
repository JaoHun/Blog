# Post Writing Guide

This project is a static-first writing system. Articles are local MDX files, validated at build time, and published through Git.

`frontend/lib/content/schema.ts` is the machine source of truth. This guide is the human-readable writing rulebook.

## Create A Draft

Recommended manual flow:

1. Copy `frontend/content/posts/writing-template.mdx`.
2. Rename the copy with a lowercase kebab-case file name, for example `nextjs-static-export-notes.zh.mdx`.
3. Fill in Frontmatter.
4. Keep `draft: true` while writing.
5. Change `draft` to `false` only when ready to publish.

For travel notes, life records, and photo essays, copy `frontend/content/posts/photo-essay-template.mdx` instead. Keep `type: "essay"`; add the real images under `frontend/public/images/moments/`, then enable `cover` only after the cover file exists.

Optional helper command, run from `frontend`:

```powershell
corepack pnpm new-post "文章标题"
```

Create an English draft with a custom slug:

```powershell
corepack pnpm new-post "Post Title" post-title en
```

## Frontmatter

Required fields:

```yaml
title: "Article title"
date: "2026-08-01"
excerpt: "A concise summary between 20 and 220 characters."
category: "Next.js"
tags:
  - nextjs
```

Optional fields:

```yaml
updated: "2026-08-01"
featured: false
sticky: false
draft: true
cover: "/images/posts/article-slug/cover.png"
slug: "custom-slug"
lang: "zh"
type: "tech"
```

Rules:

- Dates must be quoted `YYYY-MM-DD` strings.
- Use `updated`, not `updateDate`.
- `updated`, when present, must not be earlier than `date`.
- Use exactly one category and one or more tags.
- Tags are normalized and deduplicated by the content pipeline.
- `featured`, `sticky`, and `draft` default to `false`.
- `draft: true` is excluded from production pages, RSS, Sitemap, search index, and static post routes.
- `cover`, when present, must start with `/images/`.
- `slug`, when present, must use lowercase letters, numbers, and hyphens.
- `type` defaults to `tech`; use `essay` for content that belongs in `/moments`.
- Use `type: "essay"` for travel photos, life notes, reading fragments, and personal records that should appear in `/moments`.

## Body

- Start with context: what problem, note, or experience is being recorded.
- Use scannable headings.
- Keep paragraphs short enough to read comfortably.
- Use descriptive link text.
- Add a language tag to every code block.

Example code block:

````mdx
```ts
export const message = 'hello';
```
````

## Images

Place technical article images under:

```text
frontend/public/images/posts/<article-slug>/
```

Place travel photos, life records, and photo essays under:

```text
frontend/public/images/moments/
  2024-11-17-bipenggou-cover.jpg
  2024-11-17-bipenggou-summit.jpg
```

Recommended image rules:

- Use lowercase English file names with hyphens or numbers.
- Avoid raw names such as `IMG_1234.JPG`. Chinese file names work, but English slugs are easier to maintain.
- Compress photos before committing; `1600px` to `1800px` wide is usually enough.
- Keep most web images around `300KB` to `800KB` when practical.
- Remove private location, people, or document details before publishing.

Use normal MDX image syntax and always provide meaningful alt text:

```mdx
![Screenshot of the build output](/images/posts/static-blog/build-output.png)
```

For a photo essay card and article body:

```yaml
cover: "/images/moments/2024-11-17-bipenggou-cover.jpg"
type: "essay"
```

```mdx
![Bipenggou lake view](/images/moments/2024-11-17-bipenggou-cover.jpg)

![Bipenggou summit view](/images/moments/2024-11-17-bipenggou-summit.jpg)
```

## Photo Publishing Flow

Use this flow when publishing travel photos or life records:

1. Put original photos in `frontend/public/images/incoming/` or directly in `frontend/public/images/moments/`.
2. Compress each public photo before committing. A good default is width `1800px` and JPEG quality around `82`.
3. Create or update an MDX file under `frontend/content/posts/`.
4. Set `type: "essay"` so the post appears in `/moments`.
5. Keep `draft: true` while writing. Change it to `draft: false` only when ready to publish.
6. Use a real image path in `cover`; the path must start with `/images/`.
7. Preview `/moments/` and `/posts/<slug>/` locally before pushing.

## Pre-Publish Checklist

- [ ] `title` is complete and specific.
- [ ] `date` is a quoted `YYYY-MM-DD` string.
- [ ] `updated` is present when the article changed after publication.
- [ ] `excerpt` clearly summarizes the article.
- [ ] `category` is a single clear category.
- [ ] `tags` has at least one tag.
- [ ] `draft` is `false` only when ready to publish.
- [ ] Code blocks include language tags.
- [ ] Images have meaningful alt text.
- [ ] Links are still valid.

## Verification

Run from `frontend`:

```powershell
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
```

### Preview Images Locally

`content:check` and the production build validate an image path's `/images/` prefix, but they do not prove that the referenced file exists. Before publishing a photo essay or any post with images:

1. When the draft and image files are final, temporarily set `draft: false` locally.
2. Run `corepack pnpm dev`.
3. Check the `/moments` card and `/posts/<slug>` article route. Confirm the cover crop looks correct and every body image loads.
4. Keep `draft: false` when the post is ready to publish, or restore `draft: true` before committing unfinished work.

After build:

- [ ] The article appears in `/posts`.
- [ ] The category page includes the article.
- [ ] The tag pages include the article.
- [ ] RSS and Sitemap include the article.
- [ ] Search can find the article by title, category, or tag.

## Common Errors

- Unquoted dates become YAML date objects and fail validation.
- Empty `tags` fails validation.
- `updated` earlier than `date` fails validation.
- Duplicate `slug` fails validation.
- Draft articles do not appear in production output.
