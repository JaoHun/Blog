import { siteConfig } from '@/config/site';

import { getPublishedPosts } from './posts';
import type { Lang } from './posts';
import { joinSiteUrl, routeSegment } from './route';

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function urlEntry(pathname: string) {
  return `  <url><loc>${xmlEscape(joinSiteUrl(siteConfig.url, pathname))}</loc></url>`;
}

function localizedPath(pathname: string, lang: Lang) {
  return lang === 'zh' ? pathname : `/en${pathname}`;
}

async function buildLanguageRoutes(lang: Lang) {
  const posts = await getPublishedPosts(lang);
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const staticRoutes = ['/', '/tech', '/moments', '/posts', '/categories', '/tags', '/about', '/projects'];
  const postRoutes = posts.map((post) => `/posts/${post.slug}`);
  const categoryRoutes = categories.map((category) => `/categories/${routeSegment(category)}`);
  const tagRoutes = tags.map((tag) => `/tags/${routeSegment(tag)}`);

  return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes].map((route) =>
    localizedPath(route, lang),
  );
}

export async function buildSitemapXml() {
  const routes = [...(await buildLanguageRoutes('zh')), ...(await buildLanguageRoutes('en'))];
  const entries = routes.map(urlEntry);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}
