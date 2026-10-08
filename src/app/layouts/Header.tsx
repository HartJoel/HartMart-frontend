import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Brand from "@/components/Brand";
import { buttonClasses } from "@/components/Button";
import Icon, { type IconName } from "@/components/Icon";
import { useSession } from "@/features/auth/SessionContext";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import { useCart } from "@/features/cart/CartContext";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { cn } from "@/lib/cn";
import { useMotionPresets } from "@/lib/motion";

/** `hideOnMobile` keeps the header within a 320px-wide screen; these links stay reachable from the page body and Account. */
const navItems: Array<{ to: string; label: string; icon: IconName; hideOnMobile?: boolean }> = [
  { to: "/products", label: "Shop", icon: "shop", hideOnMobile: true },
  { to: "/orders", label: "Orders", icon: "orders", hideOnMobile: true },
  { to: "/account", label: "Account", icon: "account" },
];

/** Icon-only nav entry. The label is kept as aria-label and tooltip. */
function HeaderIconLink({
  to,
  label,
  icon,
  badge,
  hideOnMobile,
}: {
  to: string;
  label: string;
  icon: IconName;
  badge?: string;
  hideOnMobile?: boolean;
}) {
  const { reduce } = useMotionPresets();

  return (
    <motion.div
      className={cn(hideOnMobile && "max-[600px]:hidden")}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <NavLink
        to={to}
        aria-label={label}
        title={label}
        className={({ isActive }) =>
          cn(
            "relative grid size-10 place-items-center rounded-full text-hm-muted no-underline transition-colors duration-200 hover:bg-hm-field hover:text-hm-text",
            isActive && "text-hm-text",
          )
        }
      >
        <Icon name={icon} size={19} />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-hm-accent px-1 text-[9px] font-[650] text-white">
            {badge}
          </span>
        )}
      </NavLink>
    </motion.div>
  );
}

export default function Header() {
  const { unreadCount } = useNotifications();
  const { savedIds } = useWishlist();
  const { itemCount } = useCart();
  const { roles } = useSession();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  }

  return (
    <header className="flex min-h-[82px] items-center gap-10 border-b border-hm-border bg-[rgba(250,250,250,0.9)] px-[clamp(20px,5vw,72px)] py-4 max-[600px]:gap-4">
      <Brand to="/" />
      <form
        role="search"
        onSubmit={submitSearch}
        className="flex h-[46px] max-w-[560px] flex-1 items-center gap-2.5 rounded-hm-sm bg-hm-field px-[18px] text-[12px] max-[900px]:hidden"
      >
        <Icon name="search" size={15} className="shrink-0 text-hm-muted" />
        <input
          aria-label="Search products and vendors"
          className="w-full border-0 bg-transparent text-hm-text outline-0 placeholder:text-hm-muted"
          type="search"
          placeholder="Search products and vendors"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </form>
      <nav aria-label="Primary" className="ml-auto flex items-center gap-2 max-[600px]:gap-1">
        {roles.includes("VENDOR") ? (
          <Link
            to="/vendor/dashboard"
            aria-label="Vendor dashboard"
            className={buttonClasses({
              variant: "ghost",
              size: "sm",
              className: "max-[900px]:min-h-10 max-[900px]:px-3",
            })}
          >
            <Icon name="dashboard" size={16} />
            <span className="max-[900px]:sr-only">Vendor dashboard</span>
          </Link>
        ) : (
          <Link
            to="/become-a-vendor"
            aria-label="Become a vendor"
            className={buttonClasses({
              variant: "ghost",
              size: "sm",
              className: "mr-3 max-[900px]:min-h-10 max-[900px]:px-3 max-[600px]:mr-1",
            })}
          >
            <Icon name="vendors" size={16} />
            <span className="max-[900px]:sr-only">Become a vendor</span>
          </Link>
        )}
        {roles.includes("ADMIN") && (
          <Link
            to="/admin"
            aria-label="Admin"
            className={buttonClasses({
              variant: "ghost",
              size: "sm",
              className: "mr-3 max-[900px]:min-h-10 max-[900px]:px-3 max-[600px]:mr-1",
            })}
          >
            <Icon name="users" size={16} />
            <span className="max-[900px]:sr-only">Admin</span>
          </Link>
        )}
        {navItems.map((item) => (
          <HeaderIconLink
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            hideOnMobile={item.hideOnMobile}
          />
        ))}
        <HeaderIconLink
          to="/notifications"
          label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
          icon="bell"
          badge={unreadCount ? String(unreadCount) : undefined}
        />
        <HeaderIconLink
          to="/wishlist"
          label={savedIds.length ? `Wishlist, ${savedIds.length} saved` : "Wishlist"}
          icon="heart"
          badge={savedIds.length ? String(savedIds.length) : undefined}
        />
        <HeaderIconLink
          to="/cart"
          label={itemCount ? `Cart, ${itemCount} items` : "Cart"}
          icon="cart"
          badge={itemCount ? String(itemCount) : undefined}
        />
      </nav>
    </header>
  );
}
