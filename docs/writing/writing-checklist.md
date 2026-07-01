# Writing Checklist

Use this checklist before changing an article from `draft: true` to `draft: false`.

## Frontmatter

- [ ] `title` is complete and specific.
- [ ] `date` is a quoted `YYYY-MM-DD` string.
- [ ] `updated` is present when the article changed after publication.
- [ ] `excerpt` clearly summarizes the article.
- [ ] `category` is a single clear category.
- [ ] `tags` has at least one tag.
- [ ] `draft` is `false` only when ready to publish.

## Body

- [ ] The opening section explains context.
- [ ] Headings are scannable.
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

After build:

- [ ] The article appears in `/posts`.
- [ ] The category page includes the article.
- [ ] The tag pages include the article.
- [ ] RSS and Sitemap include the article.
- [ ] Search can find the article by title, category, or tag.
