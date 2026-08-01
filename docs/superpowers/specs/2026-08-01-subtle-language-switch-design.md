# Subtle Language Switch Design

## Goal

Keep bilingual access available while reducing the visual weight of the language switch in the site header.

## Scope

Apply only to the header language switch on all routes.

## Design

- Keep existing Chinese and English routes.
- Keep one-click switching between current language and the alternate language.
- Display compact labels:
  - Chinese pages show `EN`.
  - English pages show `中`.
- Style the language switch as a small rounded utility control near the theme button.
- Do not add a dropdown, language menu, or content-area language selector.

## Success Criteria

- `/` links to `/en` through the compact `EN` switch.
- `/en` links to `/` through the compact `中` switch.
- Theme toggle remains unchanged.
- Existing tests, lint, build, and launch check pass.

