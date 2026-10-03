import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type IconName =
  | "account"
  | "cart"
  | "categories"
  | "check"
  | "close"
  | "dashboard"
  | "edit"
  | "logs"
  | "orders"
  | "plus"
  | "reports"
  | "search"
  | "shop"
  | "users"
  | "vendors";

const paths: Record<IconName, ReactNode> = {
  account: (
    <>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  cart: (
    <>
      <path d="M4.5 8.5h15l-1.3 11H5.8l-1.3-11Z" />
      <path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
    </>
  ),
  categories: <path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m7 7 10 10M17 7 7 17" />,
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  edit: (
    <>
      <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
      <path d="m13.8 7.8 3 3" />
    </>
  ),
  logs: <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />,
  orders: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8.5h6M9 12.5h6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  reports: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  shop: (
    <>
      <path d="M4 10 5.5 4h13L20 10" />
      <path d="M4 10a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
      <path d="M5.5 12.5V20h13v-7.5M10 20v-4.5h4V20" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 4.5 5" />
    </>
  ),
  vendors: (
    <>
      <path d="M4 10v10h16V10M3 4h18l-1 6H4L3 4Z" />
      <path d="M4 10a3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 4 0" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  /** Rendered width and height in px. */
  size?: number;
  className?: string;
};

export default function Icon({ name, size = 21, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      style={{ width: size, height: size }}
      className={cn(
        "fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]",
        className,
      )}
    >
      {paths[name]}
    </svg>
  );
}
