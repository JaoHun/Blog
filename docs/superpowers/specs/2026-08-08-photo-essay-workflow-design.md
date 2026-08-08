# Photo Essay Publishing Workflow Design

## Goal

Make photo essays easy to publish with the existing MDX workflow while keeping the blog static, simple, and maintainable.

The completed flow should let the author place images in one post-specific folder, copy a dedicated essay template, fill in Frontmatter and content, and publish the post to `/moments` without learning a second content system.

## Scope

This change includes:

- A dedicated draft template for travel notes, life records, reading fragments, and photo essays.
- Optional cover rendering in post cards.
- A compact visual layout for cards with covers.
- The existing text-only card layout when no cover is provided.
- Automated tests for both covered and coverless cards.
- Writing-guide updates that point to the dedicated template.

This change does not include:

- A CMS, browser editor, upload service, or image library.
- A separate gallery data model or gallery detail route.
- Image lightboxes, slideshows, EXIF processing, or automatic compression.
- Sample personal stories presented as real published content.

## Approaches Considered

### Selected: Reuse the Post Model

Keep photo essays as normal posts with `type: "essay"` and an optional `cover` field. Reuse the existing parser, routes, RSS, Sitemap, search index, and article detail page.

This adds the smallest amount of code and keeps every publication in one content pipeline.

### Alternative: Template Only

Add an essay template without changing post cards. This is lower effort, but photos remain invisible on the list page and `/moments` does not gain a distinct, useful presentation.

### Alternative: Separate Gallery System

Create gallery configuration, gallery cards, and gallery routes. This offers more visual control but duplicates content handling and introduces complexity that is not justified before real photo content exists.

## Content Model

The existing `Post` model remains the source of truth. Photo essays use:

```yaml
lang: "zh"
type: "essay"
cover: "/images/posts/example-trip/cover.jpg"
```

`cover` remains optional. Existing validation continues to require image paths to begin with `/images/`.

The dedicated template is a draft and must contain neutral prompts rather than invented personal experiences. It uses one category and a small set of lowercase tags so it passes current validation.

## UI Behavior

`PostCard` remains the shared card used by post lists. When `post.cover` exists, the card displays a responsive image above the metadata, title, excerpt, and tags. The entire image links to the article.

When `post.cover` is absent, the component renders the existing text-only layout without an empty image container or layout gap.

The cover uses a stable aspect ratio and `object-fit: cover`. It is decorative context for the article card, while the linked article title remains the primary accessible label. The image receives alt text derived from the article title.

This behavior applies consistently to `/moments`, `/posts`, category pages, and tag pages because they already share `PostCard`.

## File and Publishing Flow

1. Copy the dedicated essay template into `frontend/content/posts` and rename it with a lowercase kebab-case file name.
2. Create `frontend/public/images/posts/<slug>/`.
3. Add a compressed `cover.jpg` and any body images to that folder.
4. Update the template Frontmatter and body.
5. Keep `draft: true` during writing.
6. Run content checks and local preview.
7. Set `draft: false` when ready to publish.

The existing build pipeline then includes the essay in `/moments`, article routes, search, RSS, and Sitemap.

## Error Handling

- Missing optional covers fall back to the text-only card.
- Invalid cover paths continue to fail Frontmatter validation during content checks and builds.
- Missing image files are not automatically discoverable by the current schema; the author verifies them in local preview before publishing.
- Broken image fallback UI is not added in this iteration because static assets are versioned in the same repository and build-time path validation would require a broader content-pipeline change.

## Testing

Component tests will verify:

- A post with a cover renders the image with the expected source, alt text, and article link.
- A post without a cover renders no image container and preserves the text content.

Project verification will run:

```powershell
corepack pnpm content:check
corepack pnpm test
corepack pnpm lint
corepack pnpm build
corepack pnpm launch:check
```

## Acceptance Criteria

- A valid essay draft can be created by copying one documented template.
- Cover images appear on shared post cards when configured.
- Coverless technical and essay posts remain visually valid.
- The moments page does not require a separate data source.
- Static export, search, RSS, Sitemap, and draft filtering continue to use the existing content pipeline.
- No new runtime service or deployment dependency is introduced.
