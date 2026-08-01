# Home Personal Sidebar Design

## Goal

Add a lightweight personal sidebar to the home page so it can carry both personal introduction and navigation guidance without changing the home page into a dense technical index.

The home page remains warm and personal. The technical content sidebar stays reserved for `/tech/`, `/posts/`, and article pages.

## Scope

Apply this sidebar only to:

- `/`
- `/en/`

Do not apply it to category, tag, project, or article pages.

## Sidebar Content

First version modules:

- Personal card: name, short bio, GitHub link.
- Current focus: a short line describing current writing or building direction.
- Quick links:
  - Technical notes and project records.
  - About page.
  - GitHub.

Content can be intentionally light in the first version. Missing real personal details, photos, and richer updates can be added later without blocking the layout.

## Home Page Layout

Desktop:

- Main column keeps the current home content:
  - Personal notes and sharing heading.
  - Placeholder for future essays.
  - Technical notes and project records entry card.
- Right column shows the lightweight personal sidebar.

Mobile:

- Main home content appears first.
- Sidebar stacks below the main content.
- No drawer, floating sidebar, sticky behavior, or complex mobile interaction.

## Non-Goals

Do not implement these in the first version:

- Avatar or profile photo.
- Full technical content stats.
- Category/tag statistics.
- Latest posts list.
- Visitor statistics.
- Comments.
- Customizable sidebar modules.
- Complex card nesting.

## Data Sources

Use existing configuration and i18n patterns:

- `authorConfig` for name and links.
- `getAuthorBio(lang)` for short bio.
- Existing localized route helpers for links.
- `messages` for Chinese and English copy.

Do not hardcode reusable personal data directly inside page components.

## Success Criteria

- `/` and `/en/` show a lightweight personal sidebar on desktop.
- Home page still feels like a personal notes and sharing entry, not a technical index.
- Sidebar provides both personal context and clear navigation entry points.
- Mobile layout stacks sidebar below main content.
- Existing technical sidebar behavior remains unchanged.
- Existing `content:check`, `test`, `lint`, `build`, and `launch:check` pass.

