/**
 * Public Render API (Nest `/api`). Used for SSR and as fallback when env is unset.
 * Override with `NEXT_PUBLIC_API_URL` in `.env.production` if the backend URL changes.
 */
const DEFAULT_PROD_API = "https://e-commerce-food-u44s.onrender.com/api";

function resolveServerApiUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_PROD_API;
  return raw.replace(/\/$/, "");
}

/**
 * Browser production: same-origin `/api-backend/*` → rewritten to Render (see `next.config.ts`).
 * Avoids relying on `NEXT_PUBLIC_*` at build time and avoids CORS for `fetch`.
 * Local dev: direct `http://localhost:4000/api` unless overridden.
 */
export function getApiBase(): string {
  if (typeof window === "undefined") {
    return resolveServerApiUrl();
  }
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  if (isLocal) {
    const local =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
      "http://localhost:4000/api";
    return local;
  }
  return "/api-backend";
}

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
  const res = await fetch(`${getApiBase()}${path}`, {
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
