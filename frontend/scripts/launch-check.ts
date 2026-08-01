import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'out');

async function exists(relativePath: string) {
  try {
    await access(path.join(outDir, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readOutFile(relativePath: string) {
  return readFile(path.join(outDir, relativePath), 'utf8');
}

async function assertFile(relativePath: string) {
  if (!(await exists(relativePath))) {
    throw new Error(`Missing static output: out/${relativePath}`);
  }
}

function assertContains(content: string, expected: string, label: string) {
  if (!content.includes(expected)) {
    throw new Error(`${label} does not contain: ${expected}`);
  }
}

function assertNotContains(content: string, unexpected: string, label: string) {
  if (content.includes(unexpected)) {
    throw new Error(`${label} unexpectedly contains: ${unexpected}`);
  }
}

async function main() {
  const requiredFiles = [
    'index.html',
    'en/index.html',
    'tech/index.html',
    'en/tech/index.html',
    'posts/index.html',
    'en/posts/index.html',
    'posts/static-blog-mvp/index.html',
    'en/posts/static-blog-mvp/index.html',
    'categories/index.html',
    'tags/index.html',
    'about/index.html',
    'projects/index.html',
    'robots.txt',
    'sitemap.xml',
    'rss.xml',
    'rss.en.xml',
    'search-index.json',
    'search-index.en.json',
    'images/og/default.png',
  ];

  await Promise.all(requiredFiles.map(assertFile));

  const home = await readOutFile('index.html');
  const enHome = await readOutFile('en/index.html');
  const tech = await readOutFile('tech/index.html');
  const englishTech = await readOutFile('en/tech/index.html');
  const posts = await readOutFile('posts/index.html');
  const post = await readOutFile('posts/static-blog-mvp/index.html');
  const sitemap = await readOutFile('sitemap.xml');
  const rss = await readOutFile('rss.xml');
  const englishRss = await readOutFile('rss.en.xml');
  const searchIndex = await readOutFile('search-index.json');
  const englishSearchIndex = await readOutFile('search-index.en.json');

  assertContains(home, 'JaoHun Blog', 'home page');
  assertContains(home, '个人杂谈与分享', 'home page');
  assertContains(home, '技术笔记与项目记录', 'home page');
  assertContains(enHome, 'Personal notes and essays', 'English home page');
  assertContains(home, '个人侧栏', 'home sidebar');
  assertContains(home, '当前关注', 'home sidebar');
  assertContains(enHome, 'Personal sidebar', 'English home sidebar');
  assertContains(enHome, 'Current focus', 'English home sidebar');
  assertContains(tech, '技术笔记与项目记录', 'tech page');
  assertContains(tech, '内容统计', 'tech page sidebar');
  assertContains(tech, '最新文章', 'tech page sidebar');
  assertContains(posts, '内容统计', 'posts page sidebar');
  assertContains(posts, '最新文章', 'posts page sidebar');
  assertContains(englishTech, 'Technical notes and project records', 'English tech page');
  assertContains(englishTech, 'Content stats', 'English tech page sidebar');
  assertContains(englishTech, 'Latest posts', 'English tech page sidebar');
  assertContains(post, '构建一个轻量静态博客 MVP', 'post page');
  assertContains(post, '内容统计', 'post page sidebar');
  assertContains(post, '目录', 'post page table of contents');
  assertContains(post, '最新文章', 'post page sidebar');
  assertContains(post, 'twitter:card', 'post page metadata');
  assertContains(post, 'default.png', 'post page metadata');

  assertContains(sitemap, '/posts/static-blog-mvp', 'sitemap');
  assertContains(sitemap, '/tech', 'sitemap');
  assertContains(sitemap, '/en/tech', 'sitemap');
  assertContains(sitemap, '/en/posts/static-blog-mvp', 'sitemap');
  assertNotContains(sitemap, 'draft-example', 'sitemap');

  assertContains(rss, '构建一个轻量静态博客 MVP', 'RSS');
  assertContains(englishRss, 'Building a Lightweight Static Blog MVP', 'English RSS');
  assertNotContains(rss, 'Draft Example', 'RSS');
  assertNotContains(englishRss, 'Draft Example', 'English RSS');

  assertContains(searchIndex, 'static-blog-mvp', 'search index');
  assertContains(englishSearchIndex, 'static-blog-mvp', 'English search index');
  assertNotContains(searchIndex, 'draft-example', 'search index');
  assertNotContains(englishSearchIndex, 'draft-example', 'English search index');

  if (await exists('posts/draft-example/index.html')) {
    throw new Error('Draft post was exported: out/posts/draft-example/index.html');
  }

  console.log('launch:check passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
