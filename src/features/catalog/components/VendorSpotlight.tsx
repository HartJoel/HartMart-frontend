import { Link } from "react-router";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import { sectionHeadClass } from "@/features/catalog/styles";
import VendorCard from "@/features/vendor-storefront/components/VendorCard";
import { productsByVendor } from "@/lib/mock/products";
import { topVendors } from "@/lib/mock/vendors";

export default function VendorSpotlight() {
  return (
    <section className="pt-[100px]">
      <div className={sectionHeadClass}>
        <div>
          <small className="block text-[10px] font-[750] tracking-[0.15em] text-[#cbc8ff]">CURATED PARTNERS</small>
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">Top vendors</h2>
        </div>
        <div className="flex items-end gap-6">
          <p className="m-0 text-[13px] text-hm-muted">Local names doing exceptional work.</p>
          <Link to="/vendors" className="shrink-0 text-[12px] text-hm-accent no-underline">
            View all
          </Link>
        </div>
      </div>
      <RevealGroup className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {topVendors.map((vendor) => (
          <RevealItem key={vendor.id} className="flex">
            <VendorCard
              vendor={vendor}
              productCount={productsByVendor(vendor.id).length}
              from={[]}
              className="flex-1"
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
