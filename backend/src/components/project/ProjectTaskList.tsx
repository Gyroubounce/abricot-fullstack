"use client";

import TaskCard from "@/components/projects/TaskCard";
import type { Task } from "@/types";

type ProjectTaskListProps = {
  tasks: Task[];
  ownerId: string;

  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  onStatusChange: (taskId: string, status: Task["status"]) => Promise<void> | void;
  onRefresh: () => void;
};

export default function ProjectTaskList({
  tasks,
  ownerId,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onRefresh,
}: ProjectTaskListProps) {


  return (
    <section className="bg-bg-content rounded-[10px] shadow-card px-6 py-5 flex flex-col gap-4">
      {tasks.length === 0 ? (
        <p className="text-sm text-text-secondary py-4">
          Aucune tâche pour le moment.
        </p>
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Liste des tâches">
          {tasks.map((task: Task) => (
            <li key={task.id}>
              <TaskCard
                ownerId={ownerId}
                task={task}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
                onStatusChange={onStatusChange}
                onRefresh={onRefresh}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
