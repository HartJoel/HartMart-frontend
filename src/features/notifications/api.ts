import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import type { Notification } from "@/types/notification";

const NOTIFICATIONS_PREFIX = "/api/v1/notification";
const NOTIFICATIONS_KEY = ["notifications"] as const;

/** The signed-in user's notification feed. */
export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => apiRequest<Notification[]>(NOTIFICATIONS_PREFIX),
  });
}

/** Unread count, derived from the same cached list every bell/badge reads — no extra request. */
export function useUnreadNotificationsCount() {
  const { data } = useNotifications();
  return data?.filter((item) => !item.isRead).length ?? 0;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<Notification>(`${NOTIFICATIONS_PREFIX}/${id}/read`, { method: "PATCH" }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_KEY, (current) =>
        current?.map((item) => (item.id === updated.id ? updated : item)),
      );
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    // The response puts `updated` at the top level, not inside `data` like every other endpoint
    // — `apiRequest` would just return `undefined` here, so there's nothing useful to type it as.
    mutationFn: () => apiRequest<void>(`${NOTIFICATIONS_PREFIX}/read-all`, { method: "PATCH" }),
    onSuccess: () => {
      const now = new Date().toISOString();
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_KEY, (current) =>
        current?.map((item) => (item.isRead ? item : { ...item, isRead: true, readAt: now })),
      );
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<void>(`${NOTIFICATIONS_PREFIX}/${id}`, { method: "DELETE" }),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_KEY, (current) =>
        current?.filter((item) => item.id !== id),
      );
    },
  });
}
