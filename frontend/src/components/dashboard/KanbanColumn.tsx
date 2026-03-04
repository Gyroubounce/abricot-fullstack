import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCardKanban from "@/components/dashboard/TaskCardKanban";
import type { TaskWithProject } from "@/types/index";

type Props = {
  id: TaskWithProject["status"];
  title: string;
  tasks: TaskWithProject[];
  onEdit: (task: TaskWithProject) => void;
};

export default function KanbanColumn({ id, title, tasks, onEdit }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      aria-label={`Colonne ${title} — ${tasks.length} tâche${tasks.length > 1 ? "s" : ""}`}
      className="flex flex-col gap-3 flex-1 min-w-0"
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-text-primary text-sm">
          {title}
        </h3>
        <span
          className="text-xs font-medium bg-bg-grey-light text-text-secondary px-2 py-0.5 rounded-full"
          aria-label={`${tasks.length} tâche${tasks.length > 1 ? "s" : ""}`}
        >
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`rounded-[8px] p-2 min-h-50 transition-colors ${
          isOver ? "bg-brand-light" : "bg-bg-grey-light"
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-3">
            {tasks.length === 0 ? (
              <li className="text-xs text-text-secondary text-center mt-6">
                Aucune tâche
              </li>
            ) : (
              tasks.map((task) => (
                <li key={task.id}>
                  <TaskCardKanban task={task} onEdit={onEdit} />
                </li>
              ))
            )}
          </ul>
        </SortableContext>
      </div>

    </section>
  );
}