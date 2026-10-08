import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import VendorCard from "@/features/vendor-storefront/components/VendorCard";
import { useVendors } from "@/features/vendor-storefront/api";

export default function VendorDirectoryPage() {
  const { data: vendors, isPending, isError, refetch } = useVendors();

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Vendors" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="MARKETPLACE SELLERS"
        title="Vendors."
        description="Independent makers and stores selling on HartMart. Open a storefront to see everything they list."
      />

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load vendors.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div className="grid grid-cols-3 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[260px] animate-pulse rounded-hm-md bg-hm-field" />
          ))}
        </div>
      ) : vendors && vendors.length === 0 ? (
        <p className="m-0 text-[13px] text-hm-muted">No vendors are listed yet.</p>
      ) : (
        <RevealGroup className="grid grid-cols-3 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
          {vendors?.map((vendor) => (
            <RevealItem key={vendor.id}>
              <VendorCard vendor={vendor} from={[{ label: "Vendors", to: "/vendors" }]} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </>
  );
}
