import { apiRequest } from "@/lib/api/client";
import type { User } from "@/types/index";

export async function searchUsers(query: string) {
  return apiRequest<{ users: User[] }>(
    `/users/search?query=${encodeURIComponent(query)}`
  );
}

export async function getUsers(): Promise<User[]> {
  const res = await apiRequest<{ users: User[] }>("/users");
  return res.data?.users ?? [];
}