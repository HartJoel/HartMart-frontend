/** `GET /notification`, `GET /notification/:id` — confirmed from live responses. */
export type Notification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  /** A frontend route to navigate to when the notification is clicked, e.g. "/orders/:id". */
  actionUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};
