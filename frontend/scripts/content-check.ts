import { authorConfig } from '@/config/author';
import { footerConfig } from '@/config/footer';
import { navConfig } from '@/config/nav';
import { projectConfig } from '@/config/projects';
import { siteConfig } from '@/config/site';
import { getAllPosts, getPublishedPosts } from '@/lib/content/posts';
import type { Post } from '@/lib/content/posts';
import {
  authorSchema,
  footerSchema,
  navItemSchema,
  projectSchema,
  siteSchema,
} from '@/lib/content/schema';

export function collectWritingWarnings(posts: Post[]) {
  return posts.flatMap((post) => {
    const warnings: string[] = [];

    if (post.excerpt.length < 40) {
      warnings.push(
        `WARN ${post.slug}: excerpt is short. FIX: expand excerpt to clearly summarize the article.`,
      );
    }

    if (post.tags.length > 10) {
      warnings.push(`WARN ${post.slug}: has ${post.tags.length} tags. FIX: keep tags focused.`);
    }

    if (!post.cover) {
      warnings.push(`WARN ${post.slug}: has no cover. FIX: add cover when a visual preview is useful.`);
    }

    return warnings;
  });
}

async function main() {
  siteSchema.parse(siteConfig);
  authorSchema.parse(authorConfig);
  footerSchema.parse(footerConfig);
  navConfig.forEach((item) => navItemSchema.parse(item));
  projectConfig.forEach((project) => projectSchema.parse(project));

  const allPosts = await getAllPosts({ includeDrafts: true });
  const publishedPosts = await getPublishedPosts();

  if (publishedPosts.some((post) => post.draft)) {
    throw new Error('Published post collection contains drafts');
  }

  const warnings = collectWritingWarnings(allPosts);

  warnings.forEach((warning) => {
    console.warn(warning);
  });

  console.log('content:check passed');
}

if (process.argv[1]?.endsWith('content-check.ts')) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
