# Technical Content Sidebar Design

## Goal

Add a Linzy-inspired sidebar pattern to technical content pages while keeping the home page warm, light, and personal. The sidebar should improve orientation and discovery without turning the whole site into a dense knowledge-base layout.

## Scope

Apply the sidebar to the technical content area:

- `/tech/`
- `/posts/`
- `/posts/[slug]/`

Later iterations may extend it to:

- `/categories/`
- `/tags/`
- `/projects/`

Do not add the sidebar to the home page in the first version.

## Sidebar Modules

First version modules:

- Author card: name, short bio, GitHub link.
- Content stats: published article count, category count, tag count.
- Notice: `慢慢记录，保持清醒。`
- Latest posts: latest 3 published posts for the current language.
- Table of contents: only on article detail pages.

Do not add an avatar until a real avatar image is available.

## Page Layout

List pages such as `/tech/` and `/posts/` use a two-column layout on desktop:

- Main column: existing article/project content.
- Sidebar column: author card, stats, notice, latest posts.

Article detail pages keep one right sidebar instead of creating three columns:

- Main column: article body.
- Right sidebar: author card, table of contents, latest posts.

This avoids a cramped layout caused by separate personal sidebar and TOC columns.

On mobile:

- Main content appears first.
- Sidebar stacks below the content.
- No drawer, floating sidebar, or complex mobile interaction in the first version.

## Data Sources

Use existing data and content functions:

- `authorConfig` and `getAuthorBio(lang)` for author information.
- `getPublishedPosts(lang)` for counts and latest posts.
- Existing categories and tags derived from published posts.
- `PostToc` for article detail TOC.

No new database, CMS, runtime API, or hardcoded article data.

## Non-Goals

Do not implement these in the first version:

- Fake or generic avatar image.
- Visitor statistics.
- Comment widget.
- Sticky animated sidebar.
- Category/tag pages redesign.
- Home page sidebar.
- Complex card nesting.

## Success Criteria

- `/tech/`, `/posts/`, and `/posts/[slug]/` have a consistent sidebar on desktop.
- Article detail pages include both personal sidebar context and TOC without becoming a three-column layout.
- Mobile layout remains readable with no horizontal overflow.
- Existing tests, build, and `launch:check` pass.
- Home page remains focused on personal notes and sharing.

## Implementation Status

Implementation exists for:

- `/tech/`
- `/posts/`
- `/posts/[slug]/`

Article detail pages use a single right sidebar containing author context, table of contents, and latest posts.
