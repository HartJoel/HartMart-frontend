const API_URL = import.meta.env.VITE_API_URL ?? "";

/** Envelope every HartMart API response is wrapped in. */
type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const AUTH_PREFIX = "/api/v1/auth";

async function send<T>(path: string, init: RequestInit) {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, { ...init, headers, credentials: "include" });
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  return { response, body };
}

let refreshing: Promise<boolean> | null = null;

/** Single-flight refresh: concurrent 401s share one `/auth/refresh` call instead of racing. */
function refreshSession(): Promise<boolean> {
  refreshing ??= fetch(`${API_URL}${AUTH_PREFIX}/refresh`, { method: "POST", credentials: "include" })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

/**
 * Shared JSON client. Feature `api.ts` files build TanStack Query hooks on top of this.
 * The session is an httpOnly cookie set by the backend on login/register, so every request
 * sends credentials and no Authorization header is attached from JS. A 401 on a non-auth
 * request triggers one silent refresh-and-retry before giving up.
 */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { response, body } = await send<T>(path, init);

  if (response.status === 401 && !path.startsWith(AUTH_PREFIX) && (await refreshSession())) {
    const retry = await send<T>(path, init);
    if (retry.response.ok) return (retry.body as ApiEnvelope<T>).data;
    throw new ApiError(
      retry.body?.message ?? `Request failed with status ${retry.response.status}`,
      retry.response.status,
    );
  }

  if (!response.ok) {
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status);
  }

  return (body as ApiEnvelope<T>).data;
}
