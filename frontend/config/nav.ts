import { navItemSchema } from '@/lib/content/schema';

export const navConfig = [
  { label: 'Home', href: '/' },
  { label: 'Posts', href: '/posts' },
  { label: 'Categories', href: '/categories' },
  { label: 'Tags', href: '/tags' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
].map((item) => navItemSchema.parse(item));
