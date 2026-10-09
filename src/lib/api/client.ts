const API_URL = import.meta.env.VITE_API_URL ?? "";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

/** Envelope every HartMart API response is wrapped in. Some list endpoints add `pagination`. */
type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
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
  // A FormData body (e.g. the avatar upload) needs the browser to set its own multipart boundary.
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

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

/** Runs one request, retrying once after a silent refresh on a 401 outside the auth module. */
async function requestEnvelope<T>(path: string, init: RequestInit): Promise<ApiEnvelope<T>> {
  const { response, body } = await send<T>(path, init);

  if (response.status === 401 && !path.startsWith(AUTH_PREFIX) && (await refreshSession())) {
    const retry = await send<T>(path, init);
    if (retry.response.ok) return retry.body ?? { success: true, message: "", data: undefined as T };
    throw new ApiError(
      retry.body?.message ?? `Request failed with status ${retry.response.status}`,
      retry.response.status,
    );
  }

  if (!response.ok) {
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status);
  }

  // A DELETE with no response body (e.g. Delete Address) parses to a null `body`.
  return body ?? { success: true, message: "", data: undefined as T };
}

/**
 * Shared JSON client. Feature `api.ts` files build TanStack Query hooks on top of this.
 * The session is an httpOnly cookie set by the backend on login/register, so every request
 * sends credentials and no Authorization header is attached from JS. A 401 on a non-auth
 * request triggers one silent refresh-and-retry before giving up.
 */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const envelope = await requestEnvelope<T>(path, init);
  return envelope.data;
}

/**
 * For the one list endpoint confirmed to carry `pagination` as a sibling of `data` rather than
 * nested inside it — `GET /payment`. Most list endpoints use the nested shape instead
 * (`apiRequest<{ data: T[]; pagination }>`); check a live response before reusing this elsewhere.
 */
export async function apiRequestPage<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ data: T; pagination: PaginationMeta }> {
  const envelope = await requestEnvelope<T>(path, init);
  if (!envelope.pagination) throw new Error(`Expected a paginated response from ${path}`);
  return { data: envelope.data, pagination: envelope.pagination };
}

