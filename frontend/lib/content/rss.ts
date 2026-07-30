import { getSiteDescription, siteConfig } from '@/config/site';

import { getPublishedPosts } from './posts';
import type { Lang } from './posts';
import { joinSiteUrl } from './route';

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function localizedPath(pathname: string, lang: Lang) {
  return lang === 'zh' ? pathname : `/en${pathname}`;
}

export async function buildRssXml(lang: Lang = 'zh') {
  const posts = await getPublishedPosts(lang);
  const channelLink = joinSiteUrl(siteConfig.url, localizedPath('/', lang));
  const items = posts.map((post) => {
    const link = joinSiteUrl(siteConfig.url, localizedPath(`/posts/${post.slug}`, lang));

    return [
      '    <item>',
      `      <title>${xmlEscape(post.title)}</title>`,
      `      <link>${xmlEscape(link)}</link>`,
      `      <guid>${xmlEscape(link)}</guid>`,
      `      <description>${xmlEscape(post.excerpt)}</description>`,
      `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
      post.updated ? `      <lastBuildDate>${new Date(post.updated).toUTCString()}</lastBuildDate>` : '',
      '    </item>',
    ]
      .filter(Boolean)
      .join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${xmlEscape(siteConfig.name)}</title>`,
    `    <link>${xmlEscape(channelLink)}</link>`,
    `    <description>${xmlEscape(getSiteDescription(lang))}</description>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
