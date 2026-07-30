import { ExternalLink } from '@/components/common/ExternalLink';
import { getProjectDescription } from '@/config/projects';
import type { ProjectConfig } from '@/config/projects';
import type { Lang } from '@/lib/content/posts';
import { localizedPath, messages } from '@/lib/i18n';

type ProjectCardProps = {
  lang?: Lang;
  project: ProjectConfig;
};

const statusLabel: Record<ProjectConfig['status'], string> = {
  active: 'Active',
  maintained: 'Maintained',
  archived: 'Archived',
  planned: 'Planned',
};

export function ProjectCard({ lang = 'zh', project }: ProjectCardProps) {
  const t = messages[lang].projects;
  const status = t.status[project.status] ?? statusLabel[project.status];

  return (
    <article className="rounded-lg border border-border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{project.name}</h2>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
          {status}
        </span>
      </div>
      <p className="mt-3 leading-7 text-muted">{getProjectDescription(project, lang)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span className="rounded-full bg-code-bg px-3 py-1 text-xs text-muted" key={tech}>
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-4 text-sm text-link">
        {project.sourceUrl ? <ExternalLink href={project.sourceUrl}>{t.source}</ExternalLink> : null}
        {project.demoUrl ? <ExternalLink href={project.demoUrl}>{t.demo}</ExternalLink> : null}
        {project.articleUrl ? (
          <a href={project.articleUrl.startsWith('/') ? localizedPath(project.articleUrl, lang) : project.articleUrl}>
            {t.relatedPost}
          </a>
        ) : null}
      </div>
    </article>
  );
}
