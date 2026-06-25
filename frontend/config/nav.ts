import { navItemSchema } from '@/lib/content/schema';

export const navConfig = [
  { label: '首页', href: '/' },
  { label: '文章', href: '/posts' },
  { label: '分类', href: '/categories' },
  { label: '标签', href: '/tags' },
  { label: '项目', href: '/projects' },
  { label: '关于', href: '/about' },
].map((item) => navItemSchema.parse(item));
