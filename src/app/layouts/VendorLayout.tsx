import { Outlet } from "react-router";
import PageTransition from "@/components/PageTransition";
import WorkspaceSidebar, { type WorkspaceNavItem } from "@/components/WorkspaceSidebar";
import { useVendorProfile } from "@/features/vendor-dashboard/api";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useUnreadNotificationsCount } from "@/features/notifications/api";
import { getInitials } from "@/lib/format";

export default function VendorLayout() {
  const unreadCount = useUnreadNotificationsCount();
  const { data: vendor } = useVendorProfile();
  const storeName = vendor?.storeName ?? "Your store";
  const storeInitials = vendor ? getInitials(vendor.storeName) : "··";

  const navigation: WorkspaceNavItem[] = [
    { to: "/vendor/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/vendor/products", label: "Products", icon: "categories" },
    { to: "/vendor/orders", label: "Orders", icon: "orders" },
    { to: "/vendor/reviews", label: "Reviews", icon: "star" },
    { to: "/vendor/settings", label: "Settings", icon: "settings" },
    { to: "/vendor/notifications", label: "Notifications", icon: "bell", badge: unreadCount },
  ];

  return (
    <div className="grid min-h-screen grid-cols-[244px_minmax(0,1fr)] bg-hm-background max-[760px]:block">
      <WorkspaceSidebar
        subtitle="VENDOR"
        navLabel="Vendor dashboard"
        navigation={navigation}
        identity={{ initials: storeInitials, name: storeName, detail: "Vendor account" }}
      />
      <main className="min-w-0">
        <header className="flex min-h-[76px] items-center justify-end gap-3 border-b border-hm-border px-[clamp(24px,4vw,56px)] text-[11px] font-[650] max-[760px]:min-h-[68px]">
          <NotificationBell to="/vendor/notifications" />
          <span>{storeName}</span>
          <b className="grid size-[38px] place-items-center rounded-full bg-hm-text text-white">{storeInitials}</b>
        </header>
        <div className="mx-auto max-w-[1400px] px-[clamp(24px,4vw,56px)] pt-[65px] pb-[100px] max-[760px]:pt-10">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
