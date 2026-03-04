// ===== USER =====
export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// ===== PROJECT =====
export type ProjectMemberRole = "ADMIN" | "CONTRIBUTOR";

export type ProjectMember = {
  id: string;
  role: ProjectMemberRole;
  user: User;
  joinedAt: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
};

// ===== TASK =====
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskAssignee = {
  id: string;
  userId: string;
  taskId: string;
  user: User;
  assignedAt: string;
};

export type Comment = {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId: string;
  creatorId: string;
  assignees: TaskAssignee[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

// ===== TASK WITH PROJECT NAME =====
// Utilisé sur le dashboard pour afficher le nom du projet avec la tâche
export type TaskWithProject = Task & {
  projectName: string;
};