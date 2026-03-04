import { apiRequest } from "@/lib/api/client";
import type { User } from "@/types/index";

export async function searchUsers(query: string) {
  return apiRequest<{ users: User[] }>(
    `/users/search?query=${encodeURIComponent(query)}`
  );
}