// /hooks/usePermissions.ts
import { useQuery } from "@tanstack/react-query";
import { getProjectPermissions } from "@/lib/api/permissions";

export function usePermissions(projectId: string) {
  return useQuery({
    queryKey: ["permissions", projectId],
    queryFn: () => getProjectPermissions(projectId),
    enabled: !!projectId,
  });
}
