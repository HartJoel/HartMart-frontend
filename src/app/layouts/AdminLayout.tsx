import { Outlet, useLocation } from "react-router";
import PageTransition from "@/components/PageTransition";
import WorkspaceSidebar, { type WorkspaceNavItem } from "@/components/WorkspaceSidebar";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useUnreadNotificationsCount } from "@/features/notifications/api";
import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/format";
import { sessionUser } from "@/lib/mock/session";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const unreadCount = useUnreadNotificationsCount();
  // The audit log is a wide table, so it drops the content width cap.
  const isLogs = pathname === "/admin/logs";

  const navigation: WorkspaceNavItem[] = [
    { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
    { to: "/admin/users", label: "Users", icon: "users" },
    { to: "/admin/vendors", label: "Vendors", icon: "vendors" },
    { to: "/admin/categories", label: "Categories", icon: "categories" },
    { to: "/admin/reports", label: "Reports", icon: "reports" },
    { to: "/admin/logs", label: "Logs", icon: "logs" },
    { to: "/admin/notifications", label: "Notifications", icon: "bell", badge: unreadCount },
  ];

  return (
    <div className="grid min-h-screen grid-cols-[244px_minmax(0,1fr)] max-[760px]:block">
      <WorkspaceSidebar
        subtitle="ADMIN"
        navLabel="Admin dashboard"
        navigation={navigation}
        identity={{ initials: getInitials(sessionUser.name), name: sessionUser.name, detail: "Admin" }}
      />
      <div className="min-w-0">
        <header className="flex min-h-[76px] items-center justify-between border-b border-hm-text/[0.06] px-[clamp(24px,4vw,56px)] max-[760px]:min-h-[68px]">
          <span className="text-[13px] font-[700] max-[760px]:block">HartMart Admin</span>
          <div className="flex items-center gap-5">
            <NotificationBell to="/admin/notifications" />
            <div className="flex items-center gap-2 text-[9px] font-[650] text-hm-muted">
              <span className="size-1.5 rounded-full bg-hm-success" />
              Production
            </div>
          </div>
        </header>
        <div
          className={cn(
            "mx-auto px-[clamp(24px,4vw,56px)] pt-18 pb-[120px] max-[760px]:pt-12 max-[760px]:pb-20",
            isLogs ? "max-w-none" : "max-w-[1500px]",
          )}
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
    </div>
  );
}
