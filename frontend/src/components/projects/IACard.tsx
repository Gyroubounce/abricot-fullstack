"use client";

import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import type { Task } from "@/types/index";

type AITask = {
  id: string;
  title: string;
  description: string;
  priority: Task["priority"];
};

type Props = {
  task: AITask;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (field: keyof Omit<AITask, "id">, value: string) => void;
  onSave: () => void;
};

export default function IACard({ task, isEditing, onEdit, onDelete, onUpdate, onSave }: Props) {
  return (
    <div
      className="bg-bg-content border border-bg-grey-border rounded-[10px] p-3 shadow-card px-8 py-3 flex flex-col mb-5"
      
    >
      {isEditing ? (
        <div className="flex flex-col gap-2 h-full justify-between">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={task.title}
              onChange={(e) => onUpdate("title", e.target.value)}
              className="border border-system-neutral rounded-[8px] px-3 py-1.5 text-sm text-text-primary bg-bg-content"
              aria-label="Titre de la tâche"
            />
            <textarea
              value={task.description}
              onChange={(e) => onUpdate("description", e.target.value)}
              className="border border-system-neutral rounded-[8px] px-3 py-1.5 text-sm text-text-primary bg-bg-content resize-none"
              rows={2}
              aria-label="Description de la tâche"
            />
            <select
              value={task.priority}
              onChange={(e) => onUpdate("priority", e.target.value)}
              className="border border-system-neutral rounded-[8px] px-3 py-1.5 text-sm text-text-primary bg-bg-content"
              aria-label="Priorité de la tâche"
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="self-end text-xs text-brand-dark hover:underline"
          >
            Valider
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5 h-full">
          {/* Titre et description */}
          <div className="flex flex-col gap-.5 flex-1 mt-2">
            <h3 className="text-[18px] font-semibold text-police-black">
              {task.title}
            </h3>
            <p className="text-[14px] text-text-secondary line-clamp-3">
              {task.description}
            </p>
          </div>

          {/* Icônes en dessous */}
          <div className="flex items-center gap-2 mb-2">
             <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-1 text-text-secondary hover:text-brand-dark transition"
              aria-label={`Supprimer la tâche ${task.title}`}
            >
              <TrashIcon className="h-4w w-4" />
              <span className="text-xs">Supprimer</span>
            </button>         
            
             <div className="w-px h-2 bg-text-secondary"></div>
            
               <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1 text-text-secondary hover:text-brand-dark transition"
              aria-label={`Modifier la tâche ${task.title}`}
            >
              <PencilIcon className="h-4 w-4" />
              <span className="text-xs">Modifier</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}