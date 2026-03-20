const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; 
  body?: unknown;
};

type ApiResult<T> = {
  data: T | null;
  error: string | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResult<T>> {
  const { method = "GET", body } = options;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: json.message || `Erreur ${res.status}`,
      };
    }

    return { data: json.data as T, error: null };
  } catch {
    return { data: null, error: "Erreur réseau. Vérifiez votre connexion." };
  }
}