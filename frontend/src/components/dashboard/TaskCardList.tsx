import Link from "next/link";
import { FolderIcon, CalendarIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import type { TaskWithProject } from "@/types/index";

const statusLabel: Record<TaskWithProject["status"], string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Terminée",
  CANCELLED: "Annulée",
};

const statusColor: Record<TaskWithProject["status"], string> = {
  TODO: "bg-brand-light text-brand-dark",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
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
};

export default function TaskCardList({ task }: Props) {
  return (
    <article
      className="bg-bg-content rounded-[8px] shadow-card px-5 py-4 flex items-start justify-between gap-4"
      aria-label={`Tâche : ${task.title}`}
    >
      {/* Contenu principal */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">

        {/* Titre */}
        <h3 className="font-manrope font-semibold text-text-primary text-sm truncate">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-text-secondary line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Meta : projet / date / commentaires */}
        <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">

          {/* Projet */}
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

      {/* Droite : label statut + bouton */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[task.status]}`}>
          {statusLabel[task.status]}
        </span>
        <Link
          href={`/dashboard/tasks/${task.id}`}
          className="text-xs font-medium  bg-btn-black text-text-white  hover:text-brand-dark hover:bg-bg-content hover:border-brand-dark focus:ring-2 focus:ring-brand-dark rounded-md px-3 py-1 transition"
          aria-label={`Voir la tâche ${task.title}`}
        >
          Voir
        </Link>
      </div>

    </article>
  );
}