"use client";

import { useState } from "react";
import MemberSearch from "@/components/ui/MemberSearch";
import { statusLabel, statusColor } from "@/lib/utils/task";
import type { Task, User, ProjectMember } from "@/types/index";

const statusOptions = (Object.entries(statusLabel) as [Task["status"], string][])
  .filter(([value]) => value !== "CANCELLED");

type TaskFormProps = {
  initialTask?: Partial<Task>;
  members: ProjectMember[];
  ownerId?: string;
  submitLabel: string;
  loading: boolean;
  error: string | null;
  onSubmit: (
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ) => Promise<void>;
};

export default function TaskForm({
  initialTask,
  members,
  ownerId,
  submitLabel,
  loading,
  error,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate ? initialTask.dueDate.split("T")[0] : ""
  );
  const [status, setStatus] = useState<Task["status"]>(
    initialTask?.status ?? "TODO"
  );
  const [priority, setPriority] = useState<Task["priority"]>(
    initialTask?.priority ?? "MEDIUM"
  );

  const [selectedAssignees, setSelectedAssignees] = useState<User[]>(
    initialTask?.assignees?.map((a) => a.user) ?? []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onSubmit(
      title,
      description,
      dueDate,
      selectedAssignees.map((u) => u.id),
      status,
      priority
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="w-113 h-133.75 mx-auto overflow-y-auto flex flex-col gap-4 pr-1">

        {/* Titre */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-primary">Titre *</label>
          <input
            aria-label="Titre de la tâche"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-13.25 border border-system-neutral rounded-sm px-4 py-3"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-primary">Description *</label>
          <textarea
            aria-label="Description de la tâche"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-13.25 border border-system-neutral rounded-sm px-4 py-3 resize-none"
            required
          />
        </div>

        {/* Échéance */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-text-primary">Échéance *</label>
          <input
            aria-label="Date d'échéance"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-13.25 border border-system-neutral rounded-sm px-4 py-3"
            required
          />
        </div>

        {/* Assignés */}
        <div className="flex flex-col gap-1">
          <span className="text-sm text-text-primary">Assigné à</span>

          <MemberSearch
            users={members.map((m) => m.user)}
            selectedUsers={selectedAssignees}
            onAdd={(u) => setSelectedAssignees((prev) => [...prev, u])}
            onRemove={(id) =>
              setSelectedAssignees((prev) => prev.filter((u) => u.id !== id))
            }
            ownerId={ownerId}
            buttonLabel={
              selectedAssignees.length > 0
                ? `${selectedAssignees.length} assigné(s)`
                : "Choisir des assignés"
            }
          />
        </div>

        {/* Statut */}
        <div className="flex flex-col gap-1">
          <span className="text-sm text-text-primary">Statut</span>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  status === value
                    ? "bg-system-info text-text-info"
                    : statusColor[value]
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Priorité */}
        <div className="flex flex-col gap-1">
          <span className="text-sm text-text-primary">Priorité</span>
          <select
            id="task-priority"
            aria-label="Sélectionner la priorité"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            className="h-13.25 border border-system-neutral rounded-sm px-4 py-3"
          >
            <option value="URGENT">Urgente</option>
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>
        </div>

        {error && <p className="text-sm text-text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading || !title || !description || !dueDate}
          className="w-45.25 h-12.5 bg-system-neutral rounded-[8px]"
        >
          {loading ? "En cours..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
