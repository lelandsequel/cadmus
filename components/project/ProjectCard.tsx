import Link from 'next/link';
import { Project } from '@/types';
import ScoreBadge from './ScoreBadge';
import StatusPill from './StatusPill';
import { getOverallScore } from '@/lib/scoring';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const overallScore = getOverallScore({
    clarity: project.clarity_score,
    completeness: project.completeness_score,
    logic_integrity: project.logic_integrity_score,
    edge_case: project.edge_case_score,
    build_readiness: project.build_readiness_score,
  });

  return (
    <Link href={`/projects/${project.id}/spec`}>
      <div className="clay-card bg-surface-container-low p-6 rounded-lg flex flex-col justify-between h-[240px] group cursor-pointer hover:translate-y-[-4px] transition-all duration-300 border border-white/60">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-on-surface leading-tight line-clamp-2">
              {project.title}
            </h3>
            <p className="text-xs text-on-surface-variant">{project.industry || project.project_type || 'General'}</p>
          </div>
          <StatusPill status={project.status as 'draft' | 'active' | 'complete' | 'archived'} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">Overall Readiness</span>
            <ScoreBadge score={overallScore} />
          </div>
          <div className="w-full h-1.5 bg-surface-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${overallScore}%` }}
            />
          </div>
          <p className="text-xs text-on-surface-variant">
            Updated {new Date(project.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
