import type { Metadata } from 'next';

import { ProjectsPage } from '@/app/_localized-pages';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A configured list of selected projects, project status, technology stack, and related links.',
};

export default function Page() {
  return <ProjectsPage lang="en" />;
}
