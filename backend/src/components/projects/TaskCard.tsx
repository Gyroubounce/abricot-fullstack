"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils/format";
import { statusLabel, statusColor, priorityLabel } from "@/lib/utils/task";
import { getInitials } from "@/lib/utils/initials";
import type { Task } from "@/types/index";
import CalendarIcon from "@/components/ui/icons/CalenderIcon";
import CommentForm from "@/components/forms/CommentForm";

type Props = {
  task: Task;
  ownerId: string;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onRefresh: () => void;
};

export default function TaskCard({ task, ownerId,onDelete, onEdit, onStatusChange, onRefresh }: Props) {
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
      className="bg-bg-content rounded-[10px] border border-bg-grey-border px-5 py-4 flex flex-col gap-3"
      aria-label={`Tâche : ${task.title}`}
    >
          {/* Ligne 1 : titre + label + menu */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-police-black text-lg truncate">
                {task.title}
              </h3>
              <span className={`text-sm px-2.5 py-0.5 rounded-full shrink-0 ${statusColor[task.status]}`}>
                {statusLabel[task.status]}
              </span>
            </div>

            {/* Description — en dessous du titre */}
            {task.description && (
              <p className="text-sm text-text-secondary line-clamp-2">
                {task.description}
              </p>
            )}
          </div>                

        {/* Menu 3 points */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex justify-center items-center pb-2.5 text-lg rounded-[10px] w-14.25 h-14.25 text-police-grey border border-bg-grey-border hover:border-brand-dark hover:text-brand-dark transition"
            aria-label="Options de la tâche"
            aria-expanded="false"
            aria-haspopup="menu"
          >
            ...
          </button>

          {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-7 z-20 bg-bg-content border border-system-neutral rounded-[8px] shadow-modal w-30 py-3 overflow-hidden"
            >
            <div className="flex flex-col items-center gap-2">
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
                    className={`w-fit px-2 py-1 text-xs rounded-full transition ${statusColor[s]} status-hover`}
                  >
                    {statusLabel[s]}
                  </button>
                ))}
            </div>

            <hr className="my-2 border-system-neutral" aria-hidden="true" />

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
                className="w-fit px-2 py-1 text-xs text-brand-dark underline hover:text-text-primary transition"
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
                className="w-fit px-2 py-1 text-xs text-text-error hover:underline transition"
              >
                Supprimer
              </button>
            </div>
          </div>

          )}
        </div>
      </div>


      {/* Échéance */}
      {task.dueDate && (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-4">
          <span>Échéance :</span>
          <CalendarIcon className="h-3.75 w-3.75 text-text-primary" aria-hidden="true" />
          <time dateTime={task.dueDate} className="text-text-primary" >{formatDate(task.dueDate)}</time>
        </div>
      )}

      {/* Assignés */}
      {task.assignees.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
          <span>Assigné à :</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {task.assignees.map((a) => (
              <div key={a.id} className="flex items-center gap-1">
                <div
                  className={`w-6.75 h-6.75 rounded-full flex items-center justify-center ${
                    a.user.id === ownerId ? "bg-brand-light" : "bg-bg-grey-border"
                  }`}
                  title={a.user.name}
                  aria-label={a.user.name}
                >
                  <span className={`text-[10px] ${
                    a.user.id === ownerId ? "text-text-primary" : "text-text-secondary"
                  }`}>
                    {getInitials(a.user.name)}
                  </span>
                </div>
                <span className={`text-sm px-2 py-0.5 rounded-full ${
                  a.user.id === ownerId 
                    ? "bg-brand-light text-text-primary" 
                    : "bg-bg-grey-border text-text-secondary"
                }`}>
                  {a.user.name}
                </span>
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
        className="flex items-center justify-between text-xs text-text-primary hover:text-text-primary transition"
        aria-expanded="false"
        aria-controls={`comments-${task.id}`}
      >
        <span className="flex items-center gap-1.5">
          
          Commentaires ({task.comments.length})
        </span>
        {commentsOpen ? (
          <ChevronDownIcon className="h-5 w-5 text-btn-black" aria-hidden="true" />
        ) : (
          <ChevronUpIcon className="h-5 w-5 text-btn-black" aria-hidden="true" />
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
                className={`w-6.75 h-6.75 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  comment.author.id === ownerId ? "bg-brand-light" : "bg-[#E5E7EB]"
                }`}
                aria-hidden="true"
              >
                <span className="text-[10px] text-btn-black">
                  {getInitials(comment.author.name)}
                </span>
              </div>

              {/* Container commentaire */}
              <div className="flex flex-col justify-center h-20.75 gap-5 bg-bg-grey-light rounded-[10px] px-3 py-2 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-police-black">
                    {comment.author.name}
                  </span>
                  <time
                    className="text-[10px] text-text-secondary shrink-0"
                    dateTime={comment.createdAt}
                  >
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p className="text-[10px] text-police-black">{comment.content}</p>
              </div>

            </div>
          ))
        )}

        {/* Ajouter un commentaire */}
           <CommentForm
            projectId={task.projectId}
            taskId={task.id}
            onRefresh={onRefresh}
          />
      </div>
    )}

    </div>
  );
}