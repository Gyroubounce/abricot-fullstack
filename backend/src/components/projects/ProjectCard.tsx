import Link from "next/link";
import { getInitials } from "@/lib/utils/initials";
import type { ProjectWithStats } from "@/hooks/useProjects";
import EquipeIcon from "@/components/ui/icons/EquipeIcon";

type Props = {
  project: ProjectWithStats;
};

export default function ProjectCard({ project }: Props) {
  const owner = project.owner;

  // 🔹 Contributeurs du projet (hors propriétaire)
  const projectContributors =
    project.members?.filter((m) => m.user.id !== owner.id).map((m) => m.user) ||
    [];

  // 🔹 Total = propriétaire + contributeurs
  const totalContributors = 1 + projectContributors.length;

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="bg-bg-content rounded-[8px] shadow-card p-5 flex flex-col hover:shadow-modal transition"
      aria-label={`Voir le projet ${project.name}`}
    >
      <h2 className="font-semibold text-text-primary text-lg">
        {project.name}
      </h2>

      {project.description && (
        <p className="text-sm text-text-secondary line-clamp-2 mb-10">
          {project.description}
        </p>
      )}

      <div className="flex flex-col mb-10 gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Progression</span>
          <span className="text-xs font-medium text-text-primary">
            {project.progression}%
          </span>
        </div>

        <div
          className="w-full h-1.5 mt-1 bg-bg-grey-light rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Number(project.progression) || 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression du projet : ${project.progression}%`}
        >
          <div
            className="h-full bg-brand-dark rounded-full transition-all"
            style={{ width: `${project.progression}%` }}
          />
        </div>

        <span className="text-xs text-text-secondary">
          {project.completedTasks}/{project.totalTasks} tâches terminées
        </span>
      </div>

      {/* Équipe */}
      <div className="flex flex-col gap-2">
        <span className="flex gap-1 text-[10px] font-medium text-text-secondary">
          <EquipeIcon className="w-3 h-3" />
          Équipe ({totalContributors})
        </span>

        <div className="flex items-center gap-2 flex-wrap">

          {/* Propriétaire */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center"
              aria-label={`${owner.name} — Propriétaire`}
              title={owner.name}
            >
              <span className="text-[10px] text-text-primary">
                {getInitials(owner.name)}
              </span>
            </div>
            <span className="text-[10px] text-brand-dark bg-brand-light px-2 py-0.5 rounded-full">
              Propriétaire
            </span>
          </div>

          {/* Contributeurs du projet */}
          {projectContributors.map((user) => (
            <div
              key={user.id}
              className="w-7 h-7 rounded-full bg-bg-grey-border flex items-center justify-center"
              aria-label={user.name}
              title={user.name}
            >
              <span className="text-[10px] text-text-secondary">
                {getInitials(user.name)}
              </span>
            </div>
          ))}

        </div>
      </div>
    </Link>
  );
}
