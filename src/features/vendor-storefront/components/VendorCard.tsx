import { Link } from "react-router";
import Icon from "@/components/Icon";
import type { Crumb } from "@/components/Breadcrumbs";
import Rating from "@/components/Rating";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/cn";
import type { VendorOriginState } from "@/features/vendor-storefront/vendorOrigin";
import type { Vendor } from "@/types/vendor";

type VendorCardProps = {
  vendor: Vendor;
  productCount: number;
  /** Trail the shopper is coming from, passed to the storefront breadcrumb. */
  from: Crumb[];
  className?: string;
};

/** The one vendor card, used on the home page and the vendor directory. The whole card links to the storefront. */
export default function VendorCard({ vendor, productCount, from, className }: VendorCardProps) {
  const state: VendorOriginState = { origin: from };

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
        <span
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-full bg-hm-field text-[15px] font-bold"
        >
          {vendor.initials}
        </span>
        {vendor.verified && <StatusBadge tone="success">Verified</StatusBadge>}
      </div>

      <div>
        <h2 className="m-0 text-[17px] font-[650] tracking-[-0.02em]">{vendor.name}</h2>
        <p className="m-0 mt-1 text-[12px] text-hm-muted">
          {vendor.category} · {vendor.location}
        </p>
      </div>

      <p className="m-0 text-[13px] leading-[1.6] text-hm-muted">{vendor.tagline}</p>

      <div className="mt-auto flex items-center justify-between border-t border-hm-border pt-4 text-[11px] text-hm-muted">
        <span className="flex items-center gap-2">
          <Rating value={vendor.rating} size={12} />
          {vendor.rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-3">
          {productCount} {productCount === 1 ? "product" : "products"}
          <Icon name="arrow" size={16} className="text-hm-text transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
