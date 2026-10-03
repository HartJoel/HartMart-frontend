import type { Notification } from "@/types/notification";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

// Placeholder notifications until GET /notification is wired.
export const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Your order has shipped",
    body: "HM-1982 is on its way and should arrive within two days.",
    createdAt: hoursAgo(2),
    read: false,
  },
  {
    id: 2,
    title: "Payment confirmed",
    body: "We received your payment for HM-1947. Processing has started.",
    createdAt: hoursAgo(26),
    read: false,
  },
  {
    id: 3,
    title: "How was your Classic Leather Tote?",
    body: "Your review helps independent vendors grow.",
    createdAt: hoursAgo(72),
    read: true,
  },
  {
    id: 4,
    title: "Lagos Leather Co. is now verified",
    body: "Look for the verified mark on their products.",
    createdAt: hoursAgo(168),
    read: true,
  },
];
