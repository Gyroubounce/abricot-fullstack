"use client";

import { useState } from "react";
import BaseModal from "@/components/modals/BaseModal";
import TaskForm from "@/components/forms/TaskForm";
import type { Task, ProjectMember } from "@/types/index";

type Props = {
  members: ProjectMember[];
  initialTask?: Partial<Task>;
  onClose: () => void;
  onSubmit: (
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ) => Promise<void>;
};

export default function CreateTaskModal({
  members,
  initialTask,
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
      await onSubmit(title, description, dueDate, assigneeIds, status, priority);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  const isEdit = !!initialTask;

  return (
    <BaseModal
      id="task-modal-title"
      title={isEdit ? "Modifier la tâche" : "Créer une tâche"}
      onClose={onClose}
    >
      <TaskForm
        initialTask={initialTask}
        members={members}
        submitLabel={isEdit ? "Enregistrer" : "+ Ajouter une tâche"}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </BaseModal>
  );
}