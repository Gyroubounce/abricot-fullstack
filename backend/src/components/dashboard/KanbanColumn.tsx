import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCardKanban from "@/components/dashboard/TaskCardKanban";
import type { TaskWithProject, Project } from "@/types/index";

type Props = {
  id: TaskWithProject["status"];
  title: string;
  tasks: TaskWithProject[];
  projects: Project[];
  onEdit: (task: TaskWithProject) => void;
};

export default function KanbanColumn({ id, title, tasks, projects, onEdit }: Props) {
  // 🔥 Sécurisation absolue
  const safeTasks = tasks ?? [];

  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      aria-label={`Colonne ${title} — ${safeTasks.length} tâche${safeTasks.length > 1 ? "s" : ""}`}
      className="flex flex-col gap-3 w-93.75"
    >
      <div className="flex items-center gap-2 px-1">
        <h3 className="font-semibold text-text-primary text-[18px]">
          {title}
        </h3>
        <span
          className="text-xs font-medium bg-bg-grey-light text-text-secondary px-2 py-0.5 rounded-full"
          aria-label={`${safeTasks.length} tâche${safeTasks.length > 1 ? "s" : ""}`}
        >
          {safeTasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`rounded-[8px] min-h-50 transition-colors ${
          isOver ? "bg-brand-light" : "bg-bg-content"
        }`}
      >
        <SortableContext
          items={safeTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-3">
            {safeTasks.length === 0 ? (
              <li className="text-xs text-text-secondary text-center mt-6">
                Aucune tâche
              </li>
            ) : (
              safeTasks.map((task) => {
                const taskProject = projects.find((p) => p.id === task.projectId);
                const taskOwnerId = taskProject?.owner?.id;

                return (
                  <li key={task.id}>
                    <TaskCardKanban
                      task={task}
                      ownerId={taskOwnerId}
                      onEdit={onEdit}
                    />
                  </li>
                );
              })
            )}
          </ul>
        </SortableContext>
      </div>
    </section>
  );
}
