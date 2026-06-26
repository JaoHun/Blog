import { authorConfig } from '@/config/author';
import { navConfig } from '@/config/nav';
import { projectConfig } from '@/config/projects';
import { siteConfig } from '@/config/site';
import { getAllPosts, getPublishedPosts } from '@/lib/content/posts';
import { authorSchema, navItemSchema, projectSchema, siteSchema } from '@/lib/content/schema';

async function main() {
  siteSchema.parse(siteConfig);
  authorSchema.parse(authorConfig);
  navConfig.forEach((item) => navItemSchema.parse(item));
  projectConfig.forEach((project) => projectSchema.parse(project));

  await getAllPosts({ includeDrafts: true });
  const publishedPosts = await getPublishedPosts();

  if (publishedPosts.some((post) => post.draft)) {
    throw new Error('Published post collection contains drafts');
  }

  console.log('content:check passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
