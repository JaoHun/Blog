import { readFile } from 'node:fs/promises';

import matter from 'gray-matter';
import readingTime from 'reading-time';

import { postFrontmatterSchema } from './schema';
import { normalizeCategory, normalizeSlug, normalizeTags, slugFromFilePath } from './normalize';
import type { Post } from './posts';

function headingId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function extractHeadings(content: string) {
  return content
    .split('\n')
    .map((line) => /^(#{2,3})\s+(.+)$/.exec(line))
    .filter((match): match is RegExpExecArray => Boolean(match))
    .map((match) => ({
      id: headingId(match[2]),
      text: match[2].trim(),
      level: match[1].length,
    }));
}

export async function parsePostFile(filePath: string): Promise<Post> {
  const source = await readFile(filePath, 'utf8');
  const parsed = matter(source);
  const frontmatter = postFrontmatterSchema.parse(parsed.data);
  const slug = normalizeSlug(frontmatter.slug ?? slugFromFilePath(filePath));

  return {
    slug,
    lang: frontmatter.lang,
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
    headings: extractHeadings(parsed.content),
  };
}
