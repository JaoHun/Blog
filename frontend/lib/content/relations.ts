import type { Post } from './posts';

export function getAdjacentPosts(posts: Post[], slug: string) {
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return {};
  }

  return {
    previous: posts[index - 1],
    next: posts[index + 1],
  };
}
