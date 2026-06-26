import { EmptyState } from '@/components/common/EmptyState';
import { ProjectCard } from '@/components/project/ProjectCard';
import { projectConfig } from '@/config/projects';

type ProjectListProps = {
  featuredOnly?: boolean;
};

export function ProjectList({ featuredOnly = false }: ProjectListProps) {
  const projects = featuredOnly ? projectConfig.filter((project) => project.featured) : projectConfig;

  if (projects.length === 0) {
    return <EmptyState title="暂无项目" description="后续会在这里展示项目记录。" />;
  }

  return (
    <div className="grid gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </div>
  );
}
