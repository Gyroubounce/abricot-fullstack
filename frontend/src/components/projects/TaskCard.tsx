"use client";

import { useState, useRef, useEffect } from "react";
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils/format";
import { statusLabel, statusColor, priorityLabel } from "@/lib/utils/task";
import { getInitials } from "@/lib/utils/initials";
import type { Task } from "@/types/index";

type Props = {
  task: Task;
  ownerId: string;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
};

export default function TaskCard({ task, ownerId,onDelete, onEdit, onStatusChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      className="bg-bg-content rounded-[8px] shadow-card px-5 py-4 flex flex-col gap-3"
      aria-label={`Tâche : ${task.title}`}
    >
      {/* Ligne 1 : titre + label + menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <h3 className="font-manrope font-semibold text-text-primary text-sm truncate">
            {task.title}
          </h3>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${statusColor[task.status]}`}>
            {statusLabel[task.status]}
          </span>
        </div>

        {/* Menu 3 points */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 rounded hover:bg-bg-grey-light transition text-text-secondary"
            aria-label="Options de la tâche"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <EllipsisVerticalIcon className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-7 z-20 bg-bg-content border border-system-neutral rounded-[8px] shadow-modal w-40 py-1 overflow-hidden"
            >
              {(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"] as Task["status"][])
                .filter((s) => s !== task.status)
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onStatusChange(task.id, s);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-text-primary hover:bg-bg-grey-light transition"
                  >
                    → {statusLabel[s]}
                  </button>
                ))}

              <hr className="my-1 border-system-neutral" aria-hidden="true" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-text-primary hover:bg-bg-grey-light transition"
              >
                Modifier
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-system-error hover:bg-bg-grey-light transition"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-text-secondary line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Échéance */}
      {task.dueDate && (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Échéance :</span>
          <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
        </div>
      )}

      {/* Assignés */}
      {task.assignees.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>Assigné à :</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {task.assignees.map((a) => (
              <div key={a.id} className="flex items-center gap-1">
                <div
                  className="w-5 h-5 rounded-full bg-bg-grey-light flex items-center justify-center"
                  title={a.user.name}
                  aria-label={a.user.name}
                >
                  <span className="text-[10px] font-semibold text-text-primary">
                    {getInitials(a.user.name)}
                  </span>
                </div>
                <span className="text-text-primary">{a.user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priorité */}
      <div className="text-xs text-text-secondary">
        Priorité : <span className="text-text-primary font-medium">{priorityLabel[task.priority]}</span>
      </div>

      <hr className="border-system-neutral" aria-hidden="true" />

      {/* Commentaires */}
      <button
        type="button"
        onClick={() => setCommentsOpen((v) => !v)}
        className="flex items-center justify-between text-xs text-text-secondary hover:text-text-primary transition"
        aria-expanded={commentsOpen}
        aria-controls={`comments-${task.id}`}
      >
        <span className="flex items-center gap-1.5">
          
          Commentaires ({task.comments.length})
        </span>
        {commentsOpen ? (
          <ChevronUpIcon className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>

    {commentsOpen && (
      <div id={`comments-${task.id}`} className="flex flex-col gap-2">
        {task.comments.length === 0 ? (
          <p className="text-xs text-text-secondary">Aucun commentaire.</p>
        ) : (
          task.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">

              {/* Initiales — en dehors du container */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  comment.author.id === ownerId ? "bg-brand-light" : "bg-[#E5E7EB]"
                }`}
                aria-hidden="true"
              >
                <span className="text-[10px] font-semibold text-text-primary">
                  {getInitials(comment.author.name)}
                </span>
              </div>

              {/* Container commentaire */}
              <div className="flex flex-col gap-0.5 bg-bg-grey-light rounded-[8px] px-3 py-2 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-text-primary">
                    {comment.author.name}
                  </span>
                  <time
                    className="text-[10px] text-[#1F1F1F] shrink-0"
                    dateTime={comment.createdAt}
                  >
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p className="text-xs text-[#1F1F1F]">{comment.content}</p>
              </div>

            </div>
          ))
        )}
      </div>
    )}

    </div>
  );
}