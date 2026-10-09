import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type PaginationMeta } from "@/lib/api/client";
import type { AdminUserSummary } from "@/types/auth";
import type { AdminDashboardStats, AuditLog } from "@/types/admin";
import type { Category } from "@/types/category";
import type { VendorMetrics, VendorProfile } from "@/types/vendor";

const ADMIN_PREFIX = "/api/v1/admin";
const USERS_PREFIX = `${ADMIN_PREFIX}/users`;
/** Single-user lookup lives outside the admin namespace — confirmed separately from the list endpoint. */
const USER_DETAIL_PREFIX = "/api/v1/users";
const CATEGORY_PREFIX = "/api/v1/category";
const VENDOR_PREFIX = "/api/v1/vendor";
const CATEGORIES_KEY = ["categories"] as const;
/** Shared with the public `useVendors()`/`useVendor()` in vendor-storefront/api — moderation actions invalidate the same cache. */
const VENDORS_KEY = ["vendors"] as const;

export type UsersParams = {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
};

function usersQuery(params: UsersParams) {
  const query = new URLSearchParams();
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const value = query.toString();
  return value ? `?${value}` : "";
}

/**
 * Admin-only user directory, filterable by role/status/search and paginated by the API.
 * The pagination block sits nested inside `data` (`{ data: { data: [...], pagination } }`),
 * same convention as the catalog and vendor-dashboard product lists.
 */
export function useUsers(params: UsersParams) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () =>
      apiRequest<{ data: AdminUserSummary[]; pagination: PaginationMeta }>(`${USERS_PREFIX}${usersQuery(params)}`),
  });
}

/** A single user's full detail, for the admin user drawer. */
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => apiRequest<AdminUserSummary>(`${USER_DETAIL_PREFIX}/${id}`),
    enabled: id !== undefined,
  });
}

/** Platform KPI summary for the admin command centre. */
export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => apiRequest<AdminDashboardStats>(`${ADMIN_PREFIX}/dashboard`),
  });
}

export type ActivityLogsParams = {
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

function activityLogsQuery(params: ActivityLogsParams) {
  const query = new URLSearchParams();
  if (params.action) query.set("action", params.action);
  if (params.resource) query.set("resource", params.resource);
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const value = query.toString();
  return value ? `?${value}` : "";
}

/** Audit/activity trail, filterable by action/resource/date range and paginated by the API. */
export function useActivityLogs(params: ActivityLogsParams) {
  return useQuery({
    queryKey: ["admin", "logs", params],
    queryFn: () =>
      apiRequest<{ data: AuditLog[]; pagination: PaginationMeta }>(`${ADMIN_PREFIX}/logs${activityLogsQuery(params)}`),
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

/** A vendor's rating/status summary, for the moderation detail view. */
export function useVendorMetrics(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "vendor", id, "metrics"],
    queryFn: () => apiRequest<VendorMetrics>(`${VENDOR_PREFIX}/${id}/metrics`),
    enabled: id !== undefined,
  });
}

/** Approves a pending vendor application. */
export function useVerifyVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<VendorProfile>(`${VENDOR_PREFIX}/${id}/verify`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VENDORS_KEY }),
  });
}

/** Rejects a pending vendor application with a reason shown to the applicant. */
export function useRejectVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiRequest<VendorProfile>(`${VENDOR_PREFIX}/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VENDORS_KEY }),
  });
}

/** Suspends an active vendor, e.g. for a trust & safety violation. */
export function useSuspendVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<VendorProfile>(`${VENDOR_PREFIX}/${id}/suspend`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VENDORS_KEY }),
  });
}
