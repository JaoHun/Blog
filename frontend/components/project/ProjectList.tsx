import { EmptyState } from '@/components/common/EmptyState';
import { ProjectCard } from '@/components/project/ProjectCard';
import { projectConfig } from '@/config/projects';
import type { Lang } from '@/lib/content/posts';
import { messages } from '@/lib/i18n';

type ProjectListProps = {
  featuredOnly?: boolean;
  lang?: Lang;
};

export function ProjectList({ featuredOnly = false, lang = 'zh' }: ProjectListProps) {
  const projects = featuredOnly ? projectConfig.filter((project) => project.featured) : projectConfig;

  if (projects.length === 0) {
    const t = messages[lang].projects;

    return <EmptyState title={t.emptyTitle} description={t.emptyDescription} />;
  }

  return (
    <div className="grid gap-5" data-testid="project-list">
      {projects.map((project) => (
        <ProjectCard key={project.name} lang={lang} project={project} />
      ))}
    </div>
  );
}
