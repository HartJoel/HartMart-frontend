import { NavLink, Outlet } from "react-router";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/cn";

const navigation = [
  { to: "/vendor/dashboard", label: "Dashboard" },
  { to: "/vendor/products", label: "Products" },
  { to: "/vendor/orders", label: "Orders" },
  { to: "/vendor/reviews", label: "Reviews" },
  { to: "/vendor/settings", label: "Settings" },
];

export default function VendorLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[230px_1fr] bg-hm-background max-[700px]:block">
      <aside className="sticky top-0 h-screen bg-hm-text px-4 py-7 max-[700px]:z-10 max-[700px]:h-auto max-[700px]:w-full max-[700px]:overflow-auto max-[700px]:p-2">
        <NavLink to="/" className="flex items-center gap-2.5 font-[750] text-white no-underline max-[700px]:hidden">
          H <span className="flex flex-col">HartMart<small className="text-[7px] tracking-[0.14em] text-[#777]">VENDOR</small></span>
        </NavLink>
        <nav className="mt-[60px] flex flex-col gap-1 max-[700px]:m-0 max-[700px]:flex-row">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center rounded-[11px] px-4 text-[#aaa] no-underline max-[700px]:min-w-max",
                  isActive && "bg-white text-hm-text",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0">
        <header className="flex h-[78px] items-center justify-end gap-3 border-b border-hm-border px-[4vw] text-[11px] font-[650]">
          <span>AjoTech Gadgets</span>
          <b className="grid size-[38px] place-items-center rounded-full bg-hm-text text-white">AT</b>
        </header>
        <div className="mx-auto max-w-[1400px] px-[4vw] pt-[65px] pb-[100px] max-[700px]:pt-10">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
