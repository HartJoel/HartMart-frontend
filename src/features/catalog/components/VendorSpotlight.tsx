import { Link } from "react-router";
import Icon from "@/components/Icon";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import { sectionHeadClass } from "@/features/catalog/styles";
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
          <RevealItem key={vendor.id}>
            <Link
              to={`/vendors/${vendor.id}`}
              className="flex items-center gap-4 rounded-hm-md border border-hm-border bg-hm-surface p-5 text-hm-text no-underline transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-hm-text"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-hm-field text-[13px] font-[700] tracking-[0.02em]">
                {vendor.initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="m-0 text-[14px] font-[650] leading-snug">{vendor.name}</h3>
                <p className="m-0 mt-1 text-[12px] leading-snug text-hm-muted">{vendor.tagline}</p>
              </div>
              <Icon name="arrow" size={18} className="shrink-0 text-hm-muted" />
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
