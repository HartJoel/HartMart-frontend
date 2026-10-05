import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import VendorCard from "@/features/vendor-storefront/components/VendorCard";
import { productsByVendor } from "@/lib/mock/products";
import { vendors } from "@/lib/mock/vendors";

export default function VendorDirectoryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Vendors" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="MARKETPLACE SELLERS"
        title="Vendors."
        description="Independent makers and stores selling on HartMart. Open a storefront to see everything they list."
      />

      {vendors.length === 0 ? (
        <p className="m-0 text-[13px] text-hm-muted">No vendors are listed yet.</p>
      ) : (
        <RevealGroup className="grid grid-cols-3 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
          {vendors.map((vendor) => (
            <RevealItem key={vendor.id}>
              <VendorCard vendor={vendor} productCount={productsByVendor(vendor.id).length} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </>
  );
}
