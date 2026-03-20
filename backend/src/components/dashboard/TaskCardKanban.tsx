"use client";

import FolderIcon from "@/components/ui/icons/FolderIcon";
import CalenderIcon from "@/components/ui/icons/CalenderIcon";
import CommentsIcon from "@/components/ui/icons/CommentsIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDate } from "@/lib/utils/format";
import { statusLabel, statusColor } from "@/lib/utils/task";
import type { TaskWithProject } from "@/types/index";
import Button from "@/components/ui/Button";

type Props = {
  task: TaskWithProject;
  ownerId?: string;
  onEdit: (task: TaskWithProject) => void;
};

export default function TaskCardKanban({ task, onEdit }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-bg-content rounded-[8px] shadow-card flex flex-col w-full border border-bg-grey-border"
      aria-label={`Tâche : ${task.title}`}
    >
      {/* Zone draggable */}
      <div
        {...attributes}
        {...listeners}
        className="px-6 pt-4 pb-2 cursor-grab active:cursor-grabbing flex flex-col gap-1"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-black text-[18px]">
            {task.title}
          </h3>

          <span
            className={`mb-5 shrink-0 text-xs font-medium px-2 py-1 rounded-full ${statusColor[task.status]}`}
          >
            {statusLabel[task.status]}
          </span>
        </div>

        {task.description && (
          <p className="text-[14px] text-text-secondary line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-text-secondary flex-wrap my-5">
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

      {/* Bouton Voir */}
      <div className="px-6 pb-5">
        <Button
          variant="voir"
          onClick={() => onEdit(task)}
          ariaLabel={`Modifier la tâche ${task.title}`}
        >
          Voir
        </Button>
      </div>
    </div>
  );
}
