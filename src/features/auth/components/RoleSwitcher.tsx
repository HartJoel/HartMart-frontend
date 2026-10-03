import { Link, useLocation } from "react-router";
import Icon from "@/components/Icon";
import { useSession } from "@/features/auth/SessionContext";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/mock/session";

/** Where each workspace starts. The customer side is the storefront at "/". */
const workspaces: Record<Exclude<Role, "CUSTOMER">, { label: string; home: string }> = {
  VENDOR: { label: "Vendor", home: "/vendor/dashboard" },
  ADMIN: { label: "Admin", home: "/admin" },
};

/** The area a path belongs to. Storefront, account and order pages all count as customer. */
export function activeRoleFor(pathname: string): Role {
  if (pathname.startsWith("/vendor")) return "VENDOR";
  if (pathname.startsWith("/admin")) return "ADMIN";
  return "CUSTOMER";
}

type RoleSwitcherProps = {
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Each workspace switches only with the customer side: from the storefront you can enter a
 * vendor or admin workspace you hold, and from a workspace you go back to the customer side.
 */
export default function RoleSwitcher({ tone = "dark", className }: RoleSwitcherProps) {
  const { roles } = useSession();
  const { pathname } = useLocation();
  const active = activeRoleFor(pathname);
  const dark = tone === "dark";

  const linkClass = cn(
    "flex min-h-10 w-full items-center justify-between gap-2 rounded-hm-sm px-3 text-[12px] font-[650] no-underline transition-colors duration-200",
    dark ? "bg-white/[0.06] text-white hover:bg-white/[0.12]" : "bg-hm-field text-hm-text hover:bg-hm-border",
  );

  if (active !== "CUSTOMER") {
    return (
      <div className={cn("flex", className)}>
        <Link to="/" className={linkClass}>
          Switch to customer
          <Icon name="arrow" size={14} className="rotate-180" />
        </Link>
      </div>
    );
  }

  const targets = (Object.keys(workspaces) as Array<keyof typeof workspaces>).filter((role) => roles.includes(role));
  if (targets.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {targets.map((role) => (
        <Link key={role} to={workspaces[role].home} className={linkClass}>
          Switch to {workspaces[role].label.toLowerCase()}
          <Icon name="arrow" size={14} />
        </Link>
      ))}
    </div>
  );
}
