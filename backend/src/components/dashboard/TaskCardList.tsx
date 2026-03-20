"use client";

import FolderIcon from "@/components/ui/icons/FolderIcon";
import CalenderIcon from "@/components/ui/icons/CalenderIcon";
import CommentsIcon from "@/components/ui/icons/CommentsIcon";
import { formatDate } from "@/lib/utils/format";
import { statusLabel, statusColor } from "@/lib/utils/task";
import type { TaskWithProject } from "@/types/index";
import Button from "@/components/ui/Button";

type Props = {
  task: TaskWithProject;
  ownerId?: string;
  onEdit?: (task: TaskWithProject) => void; // optionnel = parfait pour Dashboard
};

export default function TaskCardList({ task, onEdit }: Props) {
  return (
    <div
      className="bg-bg-content rounded-[8px] shadow-card px-7 flex items-start justify-between gap-4 border border-bg-grey-border"
      aria-label={`Tâche : ${task.title}`}
    >
      <div className="flex flex-col gap-1 mt-4 mb-2 flex-1 min-w-0">

        <h3 className="font-semibold text-black text-sm truncate">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs text-text-secondary line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap my-5">

          <span className="flex items-center gap-1">
            <FolderIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {task.projectName}
          </span>

          {task.dueDate && (
            <>
              <span aria-hidden="true" className="w-px h-2 bg-text-secondary inline-block" />
              <span className="flex items-center gap-1">
                <CalenderIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
              </span>
            </>
          )}

          {task.comments.length > 0 && (
            <>
              <span aria-hidden="true" className="w-px h-2 bg-text-secondary inline-block" />
              <span
                className="flex items-center gap-1"
                aria-label={`${task.comments.length} commentaire${task.comments.length > 1 ? "s" : ""}`}
              >
                <CommentsIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {task.comments.length}
              </span>
            </>
          )}

        </div>
      </div>

      <div className="flex flex-col items-end mt-4 gap-5 shrink-0">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor[task.status]}`}>
          {statusLabel[task.status]}
        </span>

        {/* Bouton Voir seulement si onEdit est fourni */}
        {onEdit && (
          <Button
            variant="voir"
            onClick={() => onEdit(task)}
            ariaLabel={`Voir la tâche ${task.title}`}
          >
            Voir
          </Button>
        )}
      </div>

    </div>
  );
}
