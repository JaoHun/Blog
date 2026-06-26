import { readFile } from 'node:fs/promises';

import matter from 'gray-matter';
import readingTime from 'reading-time';

import { postFrontmatterSchema } from './schema';
import { normalizeCategory, normalizeSlug, normalizeTags, slugFromFilePath } from './normalize';
import type { Post } from './posts';

export async function parsePostFile(filePath: string): Promise<Post> {
  const source = await readFile(filePath, 'utf8');
  const parsed = matter(source);
  const frontmatter = postFrontmatterSchema.parse(parsed.data);
  const slug = normalizeSlug(frontmatter.slug ?? slugFromFilePath(filePath));

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    updated: frontmatter.updated,
    excerpt: frontmatter.excerpt,
    category: normalizeCategory(frontmatter.category),
    tags: normalizeTags(frontmatter.tags),
    featured: frontmatter.featured,
    sticky: frontmatter.sticky,
    draft: frontmatter.draft,
    cover: frontmatter.cover,
    type: frontmatter.type,
    body: parsed.content.trim(),
    readingTimeMinutes: Math.max(1, Math.ceil(readingTime(parsed.content).minutes)),
  };
}
