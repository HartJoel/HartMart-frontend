import { useQuery } from "@tanstack/react-query";
import { apiRequest, apiRequestPaged } from "@/lib/api/client";
import type { AdminUserSummary } from "@/types/auth";

const USERS_PREFIX = "/api/v1/users";

export type UsersParams = {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
};

function usersQuery(params: UsersParams) {
  const query = new URLSearchParams();
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const value = query.toString();
  return value ? `?${value}` : "";
}

/** Admin-only user directory, filterable by role/status and paginated by the API. */
export function useUsers(params: UsersParams) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => apiRequestPaged<AdminUserSummary[]>(`${USERS_PREFIX}${usersQuery(params)}`),
  });
}

/** A single user's full detail, for the admin user drawer. */
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => apiRequest<AdminUserSummary>(`${USERS_PREFIX}/${id}`),
    enabled: id !== undefined,
  });
}
