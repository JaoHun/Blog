import { siteConfig } from '@/config/site';

import { getPublishedPosts } from './posts';
import { joinSiteUrl } from './route';

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function buildRssXml() {
  const posts = await getPublishedPosts();
  const items = posts.map((post) => {
    const link = joinSiteUrl(siteConfig.url, `/posts/${post.slug}`);

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
    `    <link>${xmlEscape(siteConfig.url)}</link>`,
    `    <description>${xmlEscape(siteConfig.description)}</description>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
