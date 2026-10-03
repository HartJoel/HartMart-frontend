import { Link } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button, { buttonClasses } from "@/components/Button";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import AccountShell from "@/features/account/components/AccountShell";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Notification } from "@/types/notification";

type NotificationsPageProps = {
  /** Vendor and admin areas show the list inside their own shell; the default is the customer account. */
  area?: "vendor" | "admin";
};

export default function NotificationsPage({ area }: NotificationsPageProps) {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  const description =
    unreadCount > 0
      ? `You have ${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}.`
      : "You're all caught up.";

  const dashboard = area === "vendor" ? "/vendor/dashboard" : "/admin";
  const breadcrumbs = area
    ? [{ label: "Dashboard", to: dashboard }, { label: "Notifications" }]
    : [{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Notifications" }];

  const content = (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader
        eyebrow="INBOX"
        title="Notifications"
        description={description}
        action={
          unreadCount > 0 ? (
            <Button variant="ghost" onClick={markAllRead}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-hm-field">
            <Icon name="bell" size={18} />
          </span>
          <p className="m-0 text-[13px] text-hm-muted">No notifications right now.</p>
          <Link
            to={area ? dashboard : "/products"}
            className={buttonClasses({ variant: "ghost", size: "sm" })}
          >
            {area ? "Back to dashboard" : "Continue shopping"}
          </Link>
        </div>
      ) : (
        <ul className="m-0 list-none p-0">
          {notifications.map((item) => (
            <NotificationItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </>
  );

  return area ? content : <AccountShell>{content}</AccountShell>;
}

function NotificationItem({ item }: { item: Notification }) {
  const { markRead, remove } = useNotifications();

  return (
    <li className="flex flex-wrap items-start gap-x-5 gap-y-4 border-t border-hm-border py-6">
      <span
        aria-hidden="true"
        className={cn("mt-2 size-2 shrink-0 rounded-full", item.read ? "bg-transparent" : "bg-hm-text")}
      />
      <div className="min-w-[220px] flex-1">
        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1">
          {!item.read && <span className="sr-only">Unread: </span>}
          <strong className={cn("text-[14px]", item.read ? "font-normal text-hm-muted" : "font-[650] text-hm-text")}>
            {item.title}
          </strong>
          <time dateTime={item.createdAt} className="text-[11px] text-hm-muted">
            {formatRelativeTime(item.createdAt)}
          </time>
        </p>
        <p className="m-0 mt-1.5 text-[13px] leading-[1.6] text-hm-muted">{item.body}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!item.read && (
          <Button variant="link" size="sm" onClick={() => markRead(item.id)}>
            Mark as read
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => remove(item.id)}
          aria-label={`Delete notification: ${item.title}`}
          className="text-hm-error hover:bg-hm-error-soft"
        >
          Delete
        </Button>
      </div>
    </li>
  );
}
