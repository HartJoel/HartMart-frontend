import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import { cn } from "@/lib/cn";

const navigation = [
  { to: "/account", label: "Profile", end: true },
  { to: "/account/addresses", label: "Addresses", end: true },
  { to: "/orders", label: "Orders", end: false },
  { to: "/notifications", label: "Notifications", end: false },
];

/** Sidebar layout shared by the account pages: profile, addresses, orders and notifications. */
export default function AccountShell({ children }: { children: ReactNode }) {
  const { unreadCount } = useNotifications();

  return (
    <div className="grid grid-cols-[200px_1fr] gap-[70px] max-[900px]:gap-10 max-[600px]:grid-cols-1">
      <nav aria-label="Account" className="flex flex-col pt-20 max-[600px]:flex-row max-[600px]:overflow-x-auto max-[600px]:pt-5">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-between gap-3 rounded-[10px] p-3 text-[13px] no-underline transition-colors duration-200 max-[600px]:min-w-max",
                isActive ? "bg-hm-text text-white" : "text-hm-muted hover:bg-hm-field hover:text-hm-text",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span>{item.label}</span>
                {item.to === "/notifications" && unreadCount > 0 && (
                  <span
                    aria-label={`${unreadCount} unread`}
                    className={cn(
                      "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-[650]",
                      isActive ? "bg-white text-hm-text" : "bg-hm-accent text-white",
                    )}
                  >
                    {unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
        <Link
          to="/login"
          className="mt-3 rounded-[10px] p-3 text-[13px] font-[600] text-hm-error no-underline transition-colors duration-200 hover:bg-hm-error-soft max-[600px]:min-w-max max-[600px]:mt-0"
        >
          Logout
        </Link>
      </nav>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
