import { NavLink } from "react-router";
import Brand from "@/components/Brand";
import Icon, { type IconName } from "@/components/Icon";
import RoleSwitcher from "@/features/auth/components/RoleSwitcher";
import { cn } from "@/lib/cn";

export type WorkspaceNavItem = {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
};

type WorkspaceSidebarProps = {
  /** Small label under the brand, such as "VENDOR" or "ADMIN". */
  subtitle: string;
  navLabel: string;
  navigation: WorkspaceNavItem[];
  identity: {
    initials: string;
    name: string;
    detail: string;
  };
};

/** Sidebar shared by the vendor and admin areas: role switcher, icon navigation and the signed-in identity. */
export default function WorkspaceSidebar({ subtitle, navLabel, navigation, identity }: WorkspaceSidebarProps) {
  return (
    <aside className="sticky top-0 z-20 flex h-screen flex-col bg-hm-text text-white max-[760px]:h-auto max-[760px]:w-full max-[760px]:p-3">
      {/* The top section scrolls on short windows, so the identity card stays pinned at the bottom. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-8 max-[760px]:overflow-visible max-[760px]:p-0">
        <div className="px-3 max-[760px]:hidden">
          <Brand tone="light" size="sm" subtitle={subtitle} />
        </div>

        <RoleSwitcher className="mt-8 max-[760px]:mt-0 max-[760px]:mb-2" />

        <nav
          aria-label={navLabel}
          className="mt-8 flex flex-col gap-1 max-[760px]:mt-2 max-[760px]:flex-row max-[760px]:overflow-x-auto"
        >
          <p className="m-0 mb-2 px-3 text-[9px] font-[750] tracking-[0.16em] text-[#6e6e76] max-[760px]:hidden">MENU</p>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 items-center gap-3 rounded-hm-sm px-3 text-[12px] font-[600] text-[#a1a1aa] no-underline transition-colors duration-200 hover:bg-white/[0.06] hover:text-white max-[760px]:min-w-max",
                  isActive && "bg-white text-hm-text hover:bg-white hover:text-hm-text",
                )
              }
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mx-4 mb-8 flex shrink-0 items-center gap-3 border-t border-[#2a2a2f] px-3 pt-5 max-[760px]:hidden">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[#36363c] text-[10px] font-[700]"
        >
          {identity.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[11px] font-[650]">{identity.name}</span>
          <span className="mt-0.5 block truncate text-[9px] text-[#77777f]">{identity.detail}</span>
        </span>
      </div>
    </aside>
  );
}
