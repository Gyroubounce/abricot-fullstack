import Link from "next/link";
import type { ProjectWithStats } from "@/hooks/useProjects";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type Props = {
  project: ProjectWithStats;
};

export default function ProjectCard({ project }: Props) {
  const owner = project.members.find((m) => m.role === "OWNER") ?? null;
  const contributors = project.members.filter((m) => m.role !== "OWNER");

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="bg-bg-content rounded-[8px] shadow-card p-5 flex flex-col gap-4 hover:shadow-modal transition"
      aria-label={`Voir le projet ${project.name}`}
    >
      {/* Nom */}
      <h2 className="font-manrope font-semibold text-text-primary text-base">
        {project.name}
      </h2>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-text-secondary line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Progression */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Progression</span>
          <span className="text-xs font-medium text-text-primary">
            {project.progression}%
          </span>
        </div>

        {/* Barre */}
        <div
          className="w-full h-1.5 bg-bg-grey-light rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={project.progression}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression du projet : ${project.progression}%`}
        >
          <div
            className="h-full bg-brand-dark rounded-full transition-all"
            style={{ width: `${project.progression}%` }}
          />
        </div>

        {/* Tâches terminées */}
        <span className="text-xs text-text-secondary">
          {project.completedTasks}/{project.totalTasks} tâches terminées
        </span>
      </div>

      {/* Équipe */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-text-secondary">
            Équipe ({project.members.length})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">

          {/* Propriétaire */}
          {owner && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center"
                aria-label={`${owner.user.name} — Propriétaire`}
                title={owner.user.name}
              >
                <span className="text-xs font-semibold text-text-primary">
                  {getInitials(owner.user.name)}
                </span>
              </div>
              <span className="text-xs font-medium text-brand-dark bg-brand-light px-2 py-0.5 rounded-full">
                Propriétaire
              </span>
            </div>
          )}

          {/* Contributeurs */}
          {contributors.map((member) => (
            <div
              key={member.id}
              className="w-8 h-8 rounded-full bg-bg-grey-light flex items-center justify-center"
              aria-label={member.user.name}
              title={member.user.name}
            >
              <span className="text-xs font-semibold text-text-primary">
                {getInitials(member.user.name)}
              </span>
            </div>
          ))}

        </div>
      </div>

    </Link>
  );
}