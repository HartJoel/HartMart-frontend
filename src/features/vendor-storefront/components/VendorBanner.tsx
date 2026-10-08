import Rating from "@/components/Rating";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getInitials } from "@/lib/format";
import type { VendorProfile } from "@/types/vendor";

type VendorBannerProps = {
  vendor: VendorProfile;
};

/** Store header: identity, description, and the facts a shopper checks before buying. */
export default function VendorBanner({ vendor }: VendorBannerProps) {
  const facts = [
    { label: "Category", value: vendor.storeCategory },
    { label: "Location", value: vendor.businessAddress ?? "—" },
    { label: "Reviews", value: String(vendor.totalReviews) },
    { label: "Member since", value: formatDate(vendor.createdAt) },
  ];

  return (
    <header
      className="grid gap-8 rounded-hm-md bg-hm-text p-8 text-white md:grid-cols-[auto_1fr] max-[600px]:p-6"
      style={
        vendor.storeBanner
          ? { backgroundImage: `linear-gradient(0deg, rgba(20,20,22,0.82), rgba(20,20,22,0.82)), url(${vendor.storeBanner})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      {vendor.storeLogo ? (
        <img src={vendor.storeLogo} alt="" className="size-24 shrink-0 rounded-full object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-24 shrink-0 place-items-center rounded-full bg-white text-[22px] font-bold text-hm-text"
        >
          {getInitials(vendor.storeName)}
        </span>
      )}

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="m-0 text-[clamp(32px,4vw,48px)] leading-none tracking-[-0.05em]">{vendor.storeName}</h1>
          {vendor.status === "VERIFIED" && <StatusBadge tone="success">Verified</StatusBadge>}
        </div>

        <p className="m-0 mt-4 text-[15px] text-[#d4d4d8]">{vendor.storeDescription}</p>

        <div className="mt-4 flex items-center gap-3 text-[12px] text-[#d4d4d8]">
          <Rating value={vendor.averageRating} size={13} className="text-white" />
          <span>
            {vendor.averageRating.toFixed(1)} · {vendor.totalReviews} reviews
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
