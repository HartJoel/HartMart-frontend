import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { initialNotifications } from "@/lib/mock/notifications";
import type { Notification } from "@/types/notification";

type NotificationsValue = {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: number) => void;
  markAllRead: () => void;
  remove: (id: number) => void;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

/** Holds the shopper's notifications so the header badge and the notifications page stay in step. */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markRead = useCallback((id: number) => {
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  }, []);

  const remove = useCallback((id: number) => {
    setNotifications((items) => items.filter((item) => item.id !== id));
  }, []);

  const value = useMemo<NotificationsValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      markRead,
      markAllRead,
      remove,
    }),
    [notifications, markRead, markAllRead, remove],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error("useNotifications must be used inside NotificationsProvider");
  return value;
}
