export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit & { token?: string | null; json?: unknown },
): Promise<T> {
  const headers = new Headers(init?.headers);
  const token = init?.token ?? getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init?.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    body:
      init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(j.message)) msg = j.message.join(", ");
      else if (typeof j.message === "string") msg = j.message;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type");
  if (ct?.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as T;
}
