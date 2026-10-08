import { Link } from "react-router";
import Button from "@/components/Button";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import { sectionHeadClass } from "@/features/catalog/styles";
import VendorCard from "@/features/vendor-storefront/components/VendorCard";
import { useTopVendors } from "@/features/vendor-storefront/api";

export default function VendorSpotlight() {
  const { data: vendors, isPending, isError, refetch } = useTopVendors();

  if (!isPending && !isError && (vendors?.length ?? 0) === 0) return null;

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

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-12 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load top vendors.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[220px] animate-pulse rounded-hm-md bg-hm-field" />
          ))}
        </div>
      ) : (
        <RevealGroup className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {vendors?.map((vendor) => (
            <RevealItem key={vendor.id} className="flex">
              <VendorCard vendor={vendor} from={[]} className="flex-1" />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}
