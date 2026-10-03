import Rating from "@/components/Rating";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import type { Vendor } from "@/types/vendor";

type VendorBannerProps = {
  vendor: Vendor;
  productCount: number;
};

/** Store header: identity, tagline, and the facts a shopper checks before buying. */
export default function VendorBanner({ vendor, productCount }: VendorBannerProps) {
  const facts = [
    { label: "Category", value: vendor.category },
    { label: "Location", value: vendor.location },
    { label: "Products", value: String(productCount) },
    { label: "Member since", value: formatDate(vendor.joined) },
  ];

  return (
    <header className="grid gap-8 rounded-hm-md bg-hm-text p-8 text-white md:grid-cols-[auto_1fr] max-[600px]:p-6">
      <span
        aria-hidden="true"
        className="grid size-24 shrink-0 place-items-center rounded-full bg-white text-[22px] font-bold text-hm-text"
      >
        {vendor.initials}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="m-0 text-[clamp(32px,4vw,48px)] leading-none tracking-[-0.05em]">{vendor.name}</h1>
          {vendor.verified && <StatusBadge tone="success">Verified</StatusBadge>}
        </div>

        <p className="m-0 mt-4 text-[15px] text-[#d4d4d8]">{vendor.tagline}</p>

        <div className="mt-4 flex items-center gap-3 text-[12px] text-[#d4d4d8]">
          <Rating value={vendor.rating} size={13} className="text-white" />
          <span>
            {vendor.rating.toFixed(1)} · {vendor.reviewCount} reviews
          </span>
        </div>

        <dl className="m-0 mt-7 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[#2a2a2f] pt-6 text-[12px] sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[#a1a1aa]">{fact.label}</dt>
              <dd className="m-0 mt-1 font-[650]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
