# Warm Site Palette Design

## Goal

Shift the full site from a deep technical mood to a warmer personal-record mood while preserving readability for technical articles and code blocks.

The palette should feel calm, clean, and personal. It should not become decorative, heavy, or image-dependent.

## Scope

Apply the palette update globally:

- Home page.
- Technical section.
- Post list and article detail pages.
- Category, tag, about, and project pages.
- Chinese and English routes.
- Light and dark theme modes.

## Visual Direction

Use a warm neutral foundation with restrained blue accents:

- Light mode: soft warm off-white background, dark warm-gray text, subtle warm-gray borders.
- Dark mode: softer charcoal or ink-gray background instead of deep blue-black.
- Accent/link color: keep a readable blue, but reduce the saturated technical feel.
- Cards and panels: keep existing simple borders and small radius, but make contrast softer.
- Code blocks: preserve strong contrast and syntax readability above visual warmth.

## Background Strategy

First version:

- Do not add a background image.
- Do not use heavy gradients, decorative blobs, or stock-like imagery.
- Use token-level color changes plus, at most, a very subtle page background tone.

Rationale:

- Current content is still light, so a strong image may make the site feel like a template.
- Avoiding background images keeps the site fast and easier to maintain.
- Real personal images can be added later once suitable assets exist.

## Theme Rules

- Keep the existing system theme behavior and manual theme switch.
- Update CSS variables in one central place where possible.
- Avoid page-specific hardcoded color values.
- Ensure both themes keep accessible contrast for body text, links, borders, and code.
- Do not break code highlighting readability.

## Non-Goals

Do not implement these in the first version:

- Custom theme editor.
- Multiple named theme presets.
- Background image upload or selection.
- Complex animated background.
- Large visual redesign of layout structure.
- Typography scale overhaul.

## Success Criteria

- The whole site feels less deep and less heavy than the current dark blue-black mood.
- Home page feels warmer and more personal.
- Technical pages remain clean and readable.
- Code highlighting remains readable in light and dark modes.
- Existing theme switching behavior still works.
- Existing `content:check`, `test`, `lint`, `build`, and `launch:check` pass.

## Implementation Status

Implemented as global CSS variable updates in `frontend/app/globals.css`.

The first version does not use a background image. It keeps the existing theme switch behavior and preserves readable code block colors.

