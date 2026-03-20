// /lib/api/permissions.ts
import { apiRequest } from "./client";

export async function getProjectPermissions(projectId: string) {
  return apiRequest(`/projects/${projectId}/permissions`);
}
