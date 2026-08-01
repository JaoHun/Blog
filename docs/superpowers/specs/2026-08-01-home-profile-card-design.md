# Home Profile Card Design

## Goal

Improve the home sidebar into a warmer personal profile card inspired by lightweight personal blog sidebars, while keeping the current static blog architecture simple.

## Scope

This iteration only changes the home sidebar profile presentation:

- Show the selected avatar as a circular image.
- Add a subtle hover rotation to the avatar.
- Show author name and short bio.
- Show published content statistics: posts, categories, and tags.
- Show a clear GitHub button when a GitHub link exists.
- Keep quick internal links to the technical section and about page.

This iteration does not add comments, friend links, visitor analytics, music players, external counters, or a new route.

## Data

Statistics must come from published MDX posts for the current language. Draft posts must remain excluded because the home page should reflect public content.

The home page computes the stats at build time and passes them to `HomeSidebar`. The sidebar stays presentational and does not read content files directly.

## UI Rules

- The card should feel warmer and more personal than the technical content sidebar.
- Animation must be optional and restrained: avatar rotates only on hover.
- Respect reduced-motion users by disabling the rotation animation when `prefers-reduced-motion` is active.
- The layout must remain readable on mobile, with the sidebar stacking below the home content.

## Testable Outcomes

- The home sidebar renders the avatar.
- The home sidebar shows content statistics.
- The GitHub link is visually promoted as the primary external action.
- Chinese routes use `/tech` and `/about`; English routes use `/en/tech` and `/en/about`.
- Build, lint, and launch checks pass.
