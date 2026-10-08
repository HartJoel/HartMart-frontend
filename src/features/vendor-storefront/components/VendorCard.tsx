import { Link } from "react-router";
import Icon from "@/components/Icon";
import type { Crumb } from "@/components/Breadcrumbs";
import Rating from "@/components/Rating";
import StatusBadge, { type StatusTone } from "@/components/StatusBadge";
import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/format";
import type { VendorOriginState } from "@/features/vendor-storefront/vendorOrigin";
import type { VendorProfile } from "@/types/vendor";

type VendorCardProps = {
  vendor: VendorProfile;
  /** Trail the shopper is coming from, passed to the storefront breadcrumb. */
  from: Crumb[];
  className?: string;
};

const statusBadge: Record<string, { label: string; tone: StatusTone }> = {
  VERIFIED: { label: "Verified", tone: "success" },
  PENDING_VERIFICATION: { label: "Pending verification", tone: "warning" },
  SUSPENDED: { label: "Suspended", tone: "danger" },
  REJECTED: { label: "Rejected", tone: "danger" },
};

/** The one vendor card, used on the home page and the vendor directory. The whole card links to the storefront. */
export default function VendorCard({ vendor, from, className }: VendorCardProps) {
  const state: VendorOriginState = { origin: from };
  const badge = statusBadge[vendor.status];

  return (
    <Link
      to={`/vendors/${vendor.id}`}
      state={state}
      className={cn(
        "group flex flex-col gap-5 rounded-hm-md border border-hm-border bg-hm-surface p-6 text-hm-text no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-24px_rgba(26,26,26,0.32)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {vendor.storeLogo ? (
          <img src={vendor.storeLogo} alt="" className="size-14 shrink-0 rounded-full object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-full bg-hm-field text-[15px] font-bold"
          >
            {getInitials(vendor.storeName)}
          </span>
        )}
        {badge && <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>}
      </div>

      <div>
        <h2 className="m-0 text-[17px] font-[650] tracking-[-0.02em]">{vendor.storeName}</h2>
        <p className="m-0 mt-1 text-[12px] text-hm-muted">{vendor.storeCategory}</p>
      </div>

      <p className="m-0 text-[13px] leading-[1.6] text-hm-muted">{vendor.storeDescription}</p>

      <div className="mt-auto flex items-center justify-between border-t border-hm-border pt-4 text-[11px] text-hm-muted">
        <span className="flex items-center gap-2">
          <Rating value={vendor.averageRating} size={12} />
          {vendor.averageRating.toFixed(1)}
        </span>
        <span className="flex items-center gap-3">
          {vendor.totalReviews} {vendor.totalReviews === 1 ? "review" : "reviews"}
          <Icon name="arrow" size={16} className="text-hm-text transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
