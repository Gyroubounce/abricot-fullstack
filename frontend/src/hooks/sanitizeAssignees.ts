// /hooks/sanitizeAssignees.ts
import type { ProjectMember } from "@/types/index";

export function sanitizeAssigneeIds(
  assigneeIds: string[],
  members: ProjectMember[]
): string[] {
  const memberIds = members.map((m) => m.user.id);

  return assigneeIds
    .filter((id) => memberIds.includes(id)) // owner exclu automatiquement
    .filter((id, index, self) => self.indexOf(id) === index); // pas de doublons
}
