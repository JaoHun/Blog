# Summer Part-Time Food Note Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish one photo-first life note about food eaten during a part-time job from mid-June to early July 2025.

**Architecture:** Reuse the existing MDX content pipeline and moments page. Keep the ten user-provided JPEG files under `public/images/moments`, optimize them in place for web delivery, and reference them from one `type: "essay"` post.

**Tech Stack:** Next.js static export, MDX Frontmatter, Sharp image processing, Vitest.

## Global Constraints

- Do not invent a location, restaurant, employer, or detailed personal story.
- Use `2025-07-01` as the representative Frontmatter date and state the actual range in the article body.
- Keep all ten photos in one life note.
- Preserve image content and filenames; only rotate from metadata, resize, and compress.
- Do not introduce a gallery framework, backend, database, or new runtime dependency.

---

### Task 1: Add the life note to the content pipeline

**Files:**
- Create: `frontend/content/posts/summer-part-time-food-2025.mdx`
- Modify: `frontend/tests/content/static-assets.test.ts`

**Interfaces:**
- Consumes: existing MDX Frontmatter schema and `buildSearchIndex()`.
- Produces: published post with slug `summer-part-time-food-2025` and type `essay`.

- [ ] **Step 1: Add a failing search-index assertion**

Assert that the Chinese search index contains `summer-part-time-food-2025` with category `生活` and type `essay`.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `corepack pnpm test tests/content/static-assets.test.ts`

Expected: FAIL because the post does not exist.

- [ ] **Step 3: Create the MDX article**

Use title `暑假兼职时吃到的味道`, tags `兼职`, `美食`, `生活记录`, and `2025暑假`, with all ten photos and factual captions based on filenames.

- [ ] **Step 4: Run the focused test and content validation**

Run: `corepack pnpm test tests/content/static-assets.test.ts`

Run: `corepack pnpm content:check`

Expected: PASS.

### Task 2: Optimize the user-provided photos

**Files:**
- Modify: `frontend/public/images/moments/*.jpg` for the ten new food photos only.

**Interfaces:**
- Consumes: ten JPEG source files identified by exact filenames.
- Produces: same filenames, auto-rotated, maximum 1920px on either side, JPEG quality 82 with MozJPEG encoding.

- [ ] **Step 1: Record original byte sizes and dimensions**

Use Sharp metadata and filesystem sizes for the ten exact files.

- [ ] **Step 2: Compress through temporary files**

Write each optimized image to a sibling temporary file, verify it can be decoded, then replace only the corresponding source file.

- [ ] **Step 3: Verify size and image integrity**

Confirm all ten images decode, dimensions are no greater than 1920px, and total size is materially lower than the originals.

### Task 3: Regenerate and verify the static site

**Files:**
- Modify generated assets: `frontend/public/search-index.json`, `frontend/public/rss.xml`, and `frontend/public/sitemap.xml`.

**Interfaces:**
- Consumes: the new published MDX post.
- Produces: static page, search entry, RSS item, and sitemap URL.

- [ ] **Step 1: Run full validation**

Run: `corepack pnpm content:check`

Run: `corepack pnpm test`

Run: `corepack pnpm lint`

Run: `corepack pnpm build`

Run: `corepack pnpm launch:check`

- [ ] **Step 2: Check local routes**

Verify `/moments/` and `/posts/summer-part-time-food-2025/` return HTTP 200 and contain the expected title.
