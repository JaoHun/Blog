# Post Rules

`frontend/lib/content/schema.ts` is the machine source of truth. This document is the human-readable mirror of those rules.

## Content Source

- Articles live in `frontend/content/posts/*.mdx`.
- MDX files are the only article content source.
- Runtime article data sources are not allowed.

## Required Frontmatter

```yaml
title: string
date: "YYYY-MM-DD"
excerpt: string
category: string
tags: string[]
```

Validation rules:

- `title` must be non-empty.
- `date` must be a quoted calendar date string.
- `excerpt` must be 20-220 characters.
- `category` must be non-empty.
- `tags` must contain at least one non-empty tag.

## Optional Frontmatter

```yaml
updated?: "YYYY-MM-DD"
featured?: boolean
sticky?: boolean
draft?: boolean
cover?: string
slug?: string
type?: "tech" | "essay"
```

Validation rules:

- `updated`, when present, must not be earlier than `date`.
- `featured`, `sticky`, and `draft` default to `false`.
- `cover`, when present, must start with `/images/`.
- `slug`, when present, must use lowercase letters, numbers, and hyphens.
- `type` defaults to `tech`.

## Draft Rules

- Drafts may exist in the repository.
- Production collections must exclude drafts.
- RSS, Sitemap, search index, and static post routes must exclude drafts.
- A draft file is not an error by itself.

## Slug Rules

- If `slug` is omitted, the file name becomes the slug.
- Slugs must be unique.
- Duplicate slugs fail content validation.

## Category And Tag Rules

- Each article has exactly one category.
- Each article has one or more tags.
- Tags are normalized and deduplicated by the content pipeline.

## Warning-Level Writing Guidance

The following should be treated as warnings, not build blockers:

- Very short or overly broad excerpts.
- More than 10 tags.
- Missing optional cover image.
- Article structure that is hard to scan.
