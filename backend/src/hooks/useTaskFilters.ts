"use client";

import { useState, useMemo } from "react";
import { priorityOrder } from "@/lib/utils/task";
import type { TaskWithProject } from "@/types/index";

type FilterStatus = TaskWithProject["status"] | "ALL";
type FilterPriority = TaskWithProject["priority"] | "ALL";

export function useTaskFilters(tasks: TaskWithProject[] | undefined) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("ALL");

  const filteredTasks = useMemo(() => {
    const safeTasks = tasks ?? [];

    return safeTasks
      .filter((task) => {
        const s = search.toLowerCase();

        const matchSearch =
          task.title.toLowerCase().includes(s) ||
          task.description?.toLowerCase().includes(s) ||
          task.projectName.toLowerCase().includes(s);

        const matchStatus =
          filterStatus === "ALL" || task.status === filterStatus;

        const matchPriority =
          filterPriority === "ALL" || task.priority === filterPriority;

        return matchSearch && matchStatus && matchPriority;
      })
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [tasks, search, filterStatus, filterPriority]);

  return {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filteredTasks,
  };
}
