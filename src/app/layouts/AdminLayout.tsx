import { NavLink, Outlet, useLocation } from "react-router";
import Brand from "@/components/Brand";
import Icon, { type IconName } from "@/components/Icon";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/cn";

const navigation: Array<{ to: string; label: string; icon: IconName }> = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/users", label: "Users", icon: "users" },
  { to: "/admin/vendors", label: "Vendors", icon: "vendors" },
  { to: "/admin/categories", label: "Categories", icon: "categories" },
  { to: "/admin/reports", label: "Reports", icon: "reports" },
  { to: "/admin/logs", label: "Logs", icon: "logs" },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  // The audit log is a wide table, so it drops the content width cap.
  const isLogs = pathname === "/admin/logs";

  return (
    <div className="grid min-h-screen grid-cols-[244px_minmax(0,1fr)] max-[760px]:block">
      <aside className="sticky top-0 z-20 flex h-screen flex-col bg-hm-text px-4 py-8 text-white max-[760px]:h-auto max-[760px]:w-full max-[760px]:flex-row max-[760px]:overflow-x-auto max-[760px]:px-3 max-[760px]:py-2">
        <div className="flex h-[52px] items-center gap-3 px-3 max-[760px]:hidden">
          <Brand tone="light" size="sm" subtitle="ADMIN" />
        </div>
        <nav aria-label="Admin dashboard" className="mt-16 flex flex-col gap-1 max-[760px]:m-0 max-[760px]:w-full max-[760px]:flex-row">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex min-h-[46px] w-full items-center gap-3 rounded-hm-sm px-4 text-left text-[12px] font-[600] text-[#a1a1aa] no-underline hover:bg-white/[0.06] hover:text-white max-[760px]:min-h-[42px] max-[760px]:min-w-max max-[760px]:justify-center max-[760px]:px-3 max-[480px]:min-w-11 max-[480px]:justify-center max-[480px]:px-0 max-[480px]:text-[0px]",
                  isActive && "bg-white text-hm-text hover:bg-white hover:text-hm-text",
                )
              }
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t border-[#333338] px-3 py-4 max-[760px]:hidden">
          <div className="grid size-[34px] place-items-center rounded-full bg-[#36363c] text-[9px] font-[700]">KA</div>
          <span>
            <span className="block text-[10px] font-[650]">Kemi Adebayo</span>
            <span className="mt-[3px] block text-[8px] text-[#77777f]">Super Admin</span>
          </span>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-[76px] items-center justify-end border-b border-hm-text/[0.06] px-[clamp(24px,4vw,56px)] max-[760px]:min-h-[68px] max-[760px]:justify-between">
          <span className="hidden text-[13px] font-[700] max-[760px]:block">HartMart Admin</span>
          <div className="flex items-center gap-2 text-[9px] font-[650] text-hm-muted">
            <span className="size-1.5 rounded-full bg-hm-success" />
            Production
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
