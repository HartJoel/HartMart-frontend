import { Link, useLocation, useParams } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buttonClasses } from "@/components/Button";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import ProductCard from "@/features/catalog/components/ProductCard";
import { productGridClass, sectionHeadClass } from "@/features/catalog/styles";
import VendorBanner from "@/features/vendor-storefront/components/VendorBanner";
import type { VendorOriginState } from "@/features/vendor-storefront/vendorOrigin";
import { productsByVendor } from "@/lib/mock/products";
import { findVendor } from "@/lib/mock/vendors";

export default function VendorStorefrontPage() {
  const { id } = useParams();
  const location = useLocation();
  const vendor = findVendor(id);
  // Without origin state (a direct visit or a shared link) the trail falls back to the vendor directory.
  const origin = (location.state as Partial<VendorOriginState> | null)?.origin ?? [{ label: "Vendors", to: "/vendors" }];

  if (!vendor) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Vendors", to: "/vendors" }, { label: "Not found" }]} />
        <p className="m-0 text-[13px] text-hm-muted">We couldn't find that store.</p>
        <Link className={buttonClasses({ variant: "ghost", size: "sm", className: "mt-4" })} to="/vendors">
          All vendors
        </Link>
      </>
    );
  }

  const listed = productsByVendor(vendor.id);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, ...origin, { label: vendor.name }]} />
      <VendorBanner vendor={vendor} productCount={listed.length} />

      <section className="pt-[80px]">
        <div className={sectionHeadClass}>
          <div>
            <small className="block text-[10px] font-[750] tracking-[0.15em] text-hm-muted">ABOUT THE STORE</small>
            <h2 className="m-0 text-[32px] tracking-[-0.045em]">About {vendor.name}</h2>
          </div>
        </div>
        <p className="m-0 max-w-[680px] leading-[1.7] text-hm-muted">{vendor.description}</p>
      </section>

      <section className="pt-[80px]">
        <div className={sectionHeadClass}>
          <div>
            <small className="block text-[10px] font-[750] tracking-[0.15em] text-hm-muted">FROM THIS STORE</small>
            <h2 className="m-0 text-[32px] tracking-[-0.045em]">Products</h2>
          </div>
        </div>

        {listed.length > 0 ? (
          <RevealGroup className={productGridClass}>
            {listed.map((product) => (
              <RevealItem key={product.id}>
                <ProductCard product={product} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
            <p className="m-0 text-[13px] text-hm-muted">{vendor.name} hasn't listed any products yet.</p>
            <Link className={buttonClasses({ variant: "ghost", size: "sm" })} to="/vendors">
              Browse other vendors
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
