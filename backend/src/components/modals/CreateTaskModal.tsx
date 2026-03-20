"use client";

import { useState } from "react";
import BaseModal from "@/components/modals/BaseModal";
import TaskForm from "@/components/forms/TaskForm";
import type { Task, ProjectMember } from "@/types/index";

type Props = {
  members: ProjectMember[];
  initialTask?: Partial<Task>;
  ownerId?: string;
  onClose: () => void;
  onSubmit: (
    title: string,
    description: string,
    dueDate: string | null,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ) => Promise<void>;
};

export default function CreateTaskModal({
  members,
  initialTask,
  ownerId,
  onClose,
  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ) {
    setError(null);
    setLoading(true);

    try {
      const isoDate =
        dueDate && dueDate.trim() !== ""
          ? new Date(dueDate).toISOString()
          : null;

      await onSubmit(
        title,
        description,
        isoDate,
        assigneeIds,
        status,
        priority
      );

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  const isEdit = !!initialTask;


  return (
    <BaseModal
      id="task-modal-title"
      title={isEdit ? "Modifier" : "Créer une tâche"}
      onClose={onClose}
    >
      <TaskForm
        members={members}   // 🔥 indispensable
        initialTask={initialTask}
        ownerId={ownerId}
        submitLabel={isEdit ? "Enregistrer" : "+ Ajouter une tâche"}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </BaseModal>
  );
}
