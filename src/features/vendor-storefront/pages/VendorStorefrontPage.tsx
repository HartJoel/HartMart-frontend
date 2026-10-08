import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button, { buttonClasses } from "@/components/Button";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import { toCardProduct, useProducts } from "@/features/catalog/api";
import ProductCard from "@/features/catalog/components/ProductCard";
import { productGridClass, sectionHeadClass } from "@/features/catalog/styles";
import VendorBanner from "@/features/vendor-storefront/components/VendorBanner";
import { useVendor } from "@/features/vendor-storefront/api";
import type { VendorOriginState } from "@/features/vendor-storefront/vendorOrigin";

const PAGE_SIZE = 8;

export default function VendorStorefrontPage() {
  const { id } = useParams();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const { data: vendor, isPending, isError, refetch } = useVendor(id);
  const {
    data: productsData,
    isPending: productsPending,
    isError: productsError,
    refetch: refetchProducts,
  } = useProducts({ vendorId: id, page, limit: PAGE_SIZE });
  const products = productsData?.data ?? [];
  // Without origin state (a direct visit or a shared link) the trail falls back to the vendor directory.
  const origin = (location.state as Partial<VendorOriginState> | null)?.origin ?? [{ label: "Vendors", to: "/vendors" }];

  if (isPending) {
    return (
      <div className="pt-4">
        <div className="h-[260px] animate-pulse rounded-hm-md bg-hm-field" />
      </div>
    );
  }

  if (isError || !vendor) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Vendors", to: "/vendors" }, { label: "Not found" }]} />
        <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">
            {isError ? "Couldn't load this store. Please try again." : "We couldn't find that store."}
          </p>
          {isError ? (
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          ) : (
            <Link className={buttonClasses({ variant: "ghost", size: "sm" })} to="/vendors">
              All vendors
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, ...origin, { label: vendor.storeName }]} />
      <VendorBanner vendor={vendor} />

      <section className="pt-[80px]">
        <div className={sectionHeadClass}>
          <div>
            <small className="block text-[10px] font-[750] tracking-[0.15em] text-hm-muted">ABOUT THE STORE</small>
            <h2 className="m-0 text-[32px] tracking-[-0.045em]">About {vendor.storeName}</h2>
          </div>
        </div>
        <p className="m-0 max-w-[680px] leading-[1.7] text-hm-muted">{vendor.storeDescription}</p>
      </section>

      <section className="pt-[80px]">
        <div className={sectionHeadClass}>
          <div>
            <small className="block text-[10px] font-[750] tracking-[0.15em] text-hm-muted">FROM THIS STORE</small>
            <h2 className="m-0 text-[32px] tracking-[-0.045em]">Products</h2>
          </div>
        </div>

        {productsError ? (
          <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
            <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load this store&apos;s products.</p>
            <Button variant="ghost" size="sm" onClick={() => refetchProducts()}>
              Retry
            </Button>
          </div>
        ) : productsPending ? (
          <div className={productGridClass}>
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[4/5] rounded-hm-md bg-hm-field" />
                <span className="mx-1 my-3.5 block h-3 w-[60%] rounded-[8px] bg-hm-field" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <RevealGroup className={productGridClass}>
              {products.map((product) => (
                <RevealItem key={product.id}>
                  <ProductCard product={toCardProduct(product)} />
                </RevealItem>
              ))}
            </RevealGroup>

            {productsData && productsData.pagination.pages > 1 && (
              <div className="mt-10 flex items-center justify-between gap-4 border-t border-hm-border pt-6">
                <p className="m-0 text-[11px] text-hm-muted">
                  Page {productsData.pagination.page} of {productsData.pagination.pages}
                </p>
                <div className="flex items-center gap-1.5">
                  <IconButton label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                    <Icon name="arrow" size={15} className="rotate-180" />
                  </IconButton>
                  <IconButton
                    label="Next page"
                    disabled={page >= productsData.pagination.pages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    <Icon name="arrow" size={15} />
                  </IconButton>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
            <p className="m-0 text-[13px] text-hm-muted">{vendor.storeName} hasn&apos;t listed any products yet.</p>
            <Link className={buttonClasses({ variant: "ghost", size: "sm" })} to="/vendors">
              Browse other vendors
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
