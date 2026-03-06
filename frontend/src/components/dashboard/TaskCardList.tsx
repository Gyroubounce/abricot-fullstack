"use client";

import { FolderIcon, CalendarIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils/format";
import { statusLabel, statusColor } from "@/lib/utils/task";
import type { TaskWithProject } from "@/types/index";

type Props = {
  task: TaskWithProject;
  onEdit: (task: TaskWithProject) => void;
};

export default function TaskCardList({ task, onEdit }: Props) {
  return (
    <div
      className="bg-bg-content rounded-[8px] shadow-card px-5 py-4 flex items-start justify-between gap-4"
      aria-label={`Tâche : ${task.title}`}
      role="listitem"
    >
      <div className="flex flex-col gap-2 flex-1 min-w-0">

        <h3 className="font-manrope font-semibold text-text-primary text-sm truncate">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs text-text-secondary line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">

          <span className="flex items-center gap-1">
            <FolderIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {task.projectName}
          </span>

          {task.dueDate && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
              </span>
            </>
          )}

          {task.comments.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span
                className="flex items-center gap-1"
                aria-label={`${task.comments.length} commentaire${task.comments.length > 1 ? "s" : ""}`}
              >
                <ChatBubbleLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {task.comments.length}
              </span>
            </>
          )}

        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[task.status]}`}>
          {statusLabel[task.status]}
        </span>
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="text-xs font-medium bg-btn-black text-text-white hover:text-brand-dark hover:bg-bg-content hover:border-brand-dark focus:ring-2 focus:ring-brand-dark rounded-md px-3 py-1 transition"
          aria-label={`Modifier la tâche ${task.title}`}
        >
          Voir
        </button>
      </div>

    </div>
  );
}