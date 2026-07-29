import type { Metadata } from 'next';

import { ProjectList } from '@/components/project/ProjectList';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A configured list of selected projects, project status, technology stack, and related links.',
};

export default function ProjectsPage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-3 text-muted">
          Project records with scope, technology choices, source links, and related writing.
        </p>
      </div>
      <ProjectList />
    </section>
  );
}
