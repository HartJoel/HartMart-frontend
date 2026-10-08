import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestPaged } from "@/lib/api/client";
import type { AdminUserSummary } from "@/types/auth";
import type { Category } from "@/types/category";

const USERS_PREFIX = "/api/v1/users";
const CATEGORY_PREFIX = "/api/v1/category";
const CATEGORIES_KEY = ["categories"] as const;

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

/** The full flat category list; `parentId` links each subcategory to its top-level category's id. */
export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => apiRequest<Category[]>(CATEGORY_PREFIX),
  });
}

export type CategoryInput = {
  name: string;
  description?: string;
  /** Only meaningful on create — the id of the top-level category this nests under, or null/omitted for a new top-level category. */
  parentId?: string | null;
  icon?: File;
};

/** Create a category. Multipart: the API expects form-data so it can accept an icon file. */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ icon, ...input }: CategoryInput) => {
      const form = new FormData();
      form.set("name", input.name);
      if (input.description) form.set("description", input.description);
      if (input.parentId) form.set("parentId", input.parentId);
      if (icon) form.set("icon", icon);
      return apiRequest<Category>(CATEGORY_PREFIX, { method: "POST", body: form });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

/** Edit a category's name, description or icon. The API doesn't support re-parenting on update. */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, icon, ...input }: { id: string } & Omit<CategoryInput, "parentId">) => {
      const form = new FormData();
      form.set("name", input.name);
      if (input.description) form.set("description", input.description);
      if (icon) form.set("icon", icon);
      return apiRequest<Category>(`${CATEGORY_PREFIX}/${id}`, { method: "PATCH", body: form });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<void>(`${CATEGORY_PREFIX}/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
