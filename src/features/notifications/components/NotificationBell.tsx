import { Link } from "react-router";
import Icon from "@/components/Icon";
import { useNotifications } from "@/features/notifications/NotificationsContext";

/** Header bell for the vendor and admin areas, with the unread count. */
export default function NotificationBell({ to }: { to: string }) {
  const { unreadCount } = useNotifications();
  const label = unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications";

  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className="relative grid size-10 place-items-center rounded-full text-hm-muted no-underline transition-colors duration-200 hover:bg-hm-field hover:text-hm-text"
    >
      <Icon name="bell" size={19} />
      {unreadCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-hm-accent px-1 text-[9px] font-[650] text-white"
        >
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
