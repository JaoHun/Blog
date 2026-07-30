import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

type Lang = 'zh' | 'en';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function assertNotExists(filePath: string) {
  try {
    await access(filePath);
  } catch {
    return;
  }

  throw new Error(`Post already exists: ${filePath}`);
}

function parseArgs() {
  const [, , titleArg, slugArg, langArg] = process.argv;
  const title = titleArg?.trim();
  const slug = slugify(slugArg ?? title ?? '');
  const lang = (langArg ?? 'zh') as Lang;

  if (!title) {
    throw new Error('Usage: corepack pnpm new-post "文章标题" [custom-slug] [zh|en]');
  }

  if (!slug) {
    throw new Error('Slug must contain at least one lowercase letter or number.');
  }

  if (lang !== 'zh' && lang !== 'en') {
    throw new Error('Language must be zh or en.');
  }

  return { lang, slug, title };
}

function frontmatter({ lang, slug, title }: ReturnType<typeof parseArgs>) {
  const date = today();
  const category = lang === 'zh' ? '未分类' : 'Uncategorized';
  const excerpt =
    lang === 'zh'
      ? '这里写一段 20 到 220 字之间的摘要，用于文章列表、搜索、RSS 和 SEO。'
      : 'Write a concise 20 to 220 character excerpt for lists, search, RSS, and SEO.';
  const body =
    lang === 'zh'
      ? '这里开始写正文。保持 `draft: true`，确认完成后再改为 `draft: false`。'
      : 'Start writing here. Keep `draft: true` until the post is ready to publish.';

  return `---
title: "${title}"
date: "${date}"
updated: "${date}"
excerpt: "${excerpt}"
category: "${category}"
tags:
  - note
slug: "${slug}"
lang: "${lang}"
cover: "/images/og/default.png"
featured: false
sticky: false
draft: true
type: "tech"
---

# ${title}

${body}

## 背景

## 记录

## 总结
`;
}

async function main() {
  const post = parseArgs();
  const postsDir = path.join(process.cwd(), 'content/posts');
  const suffix = post.lang === 'zh' ? '.zh' : '';
  const filePath = path.join(postsDir, `${post.slug}${suffix}.mdx`);

  await mkdir(postsDir, { recursive: true });
  await assertNotExists(filePath);
  await writeFile(filePath, frontmatter(post), 'utf8');

  console.log(`Created ${path.relative(process.cwd(), filePath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
