"use client";

import { FolderIcon, CalendarIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskWithProject } from "@/types/index";

const statusColor: Record<TaskWithProject["status"], string> = {
  TODO: "bg-brand-light text-brand-dark",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const statusLabel: Record<TaskWithProject["status"], string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Terminée",
  CANCELLED: "Annulée",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

type Props = {
  task: TaskWithProject;
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
      className="bg-bg-content rounded-[8px] shadow-card flex flex-col w-full"
      aria-label={`Tâche : ${task.title}`}
    >
      {/* Zone drag — poignée uniquement sur le haut */}
      <div
        {...attributes}
        {...listeners}
        className="px-4 pt-4 pb-2 cursor-grab active:cursor-grabbing flex flex-col gap-3"
      >
        <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[task.status]}`}>
          {statusLabel[task.status]}
        </span>

        <h3 className="font-semibold text-text-primary text-sm">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs text-text-secondary line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="flex flex-col gap-1 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <FolderIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {task.projectName}
          </span>

          {task.dueDate && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
            </span>
          )}

          {task.comments.length > 0 && (
            <span
              className="flex items-center gap-1"
              aria-label={`${task.comments.length} commentaire${task.comments.length > 1 ? "s" : ""}`}
            >
              <ChatBubbleLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {task.comments.length}
            </span>
          )}
        </div>
      </div>

      {/* Zone cliquable — séparée des listeners drag */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="mt-1 text-xs bg-btn-black text-text-white hover:text-brand-dark hover:bg-bg-content hover:border-brand-dark focus:ring-2 focus:ring-brand-dark rounded-md px-3 py-1 transition"
          aria-label={`Modifier la tâche ${task.title}`}
        >
          Voir
        </button>
      </div>

    </div>
  );
}