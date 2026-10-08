import { Link } from "react-router";
import Button, { buttonClasses } from "@/components/Button";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import { toCardProduct, useCategories, useProducts } from "@/features/catalog/api";
import ProductCard from "@/features/catalog/components/ProductCard";
import VendorSpotlight from "@/features/catalog/components/VendorSpotlight";
import { productGridClass, sectionHeadClass } from "@/features/catalog/styles";

const FEATURED_COUNT = 4;

export default function HomePage() {
  const { data, isPending, isError, refetch } = useProducts({ limit: FEATURED_COUNT });
  const featured = data?.data ?? [];
  const { data: allCategories, isPending: categoriesPending } = useCategories();
  const categories = (allCategories ?? []).filter((category) => category.parentId === null);

  return (
    <>
      <section className="relative min-h-[620px] overflow-hidden rounded-hm-md text-white max-[600px]:min-h-[540px]">
        <img
          className="absolute inset-0 size-full object-cover"
          src="https://images.unsplash.com/photo-1708170236295-20ab8fbadcef?auto=format&fit=crop&w=1800&q=90"
          alt="Contemporary African fashion"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,13,12,0.78),transparent)]" />
        <div className="relative z-[1] max-w-[720px] px-[7vw] py-[120px] max-[600px]:px-[26px] max-[600px]:py-[90px]">
          <span className="text-[10px] font-[750] tracking-[0.15em] text-[#cbc8ff]">
            THE NEW NIGERIAN MARKETPLACE
          </span>
          <h1 className="mt-4 mb-6 text-[clamp(54px,7vw,90px)] leading-[0.95] tracking-[-0.065em]">
            Find your next favourite thing.
          </h1>
          <p className="mb-9 max-w-[520px] leading-[1.7] text-[#ddd]">
            Exceptional products from independent vendors, all in one beautifully considered place.
          </p>
          <Link className={buttonClasses()} to="/products">
            Explore the collection
          </Link>
        </div>
      </section>

      {(categoriesPending || categories.length > 0) && (
        <section className="pt-[100px]">
          <div className={sectionHeadClass}>
            <h2 className="m-0 text-[32px] tracking-[-0.045em]">Shop by category</h2>
          </div>
          <RevealGroup className="flex gap-7 overflow-auto">
            {categoriesPending
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex min-w-max shrink-0 items-center gap-2.5">
                    <span className="size-11 animate-pulse rounded-full bg-hm-field" />
                    <span className="h-3 w-16 animate-pulse rounded-[8px] bg-hm-field" />
                  </div>
                ))
              : categories.map((category) => (
                  <RevealItem key={category.id} className="shrink-0">
                    <Link
                      to={`/products?categoryId=${encodeURIComponent(category.id)}`}
                      className="flex min-w-max items-center gap-2.5 text-[12px] font-[650] text-hm-text no-underline transition-colors duration-200 hover:text-hm-accent"
                    >
                      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-hm-field">
                        {category.icon ? (
                          <img src={category.icon} alt="" className="size-full object-cover" />
                        ) : (
                          category.name.slice(0, 1)
                        )}
                      </span>
                      {category.name}
                    </Link>
                  </RevealItem>
                ))}
          </RevealGroup>
        </section>
      )}

      <VendorSpotlight />

      <section className="pt-[100px]">
        <div className={sectionHeadClass}>
          <div>
            <small className="text-[10px] font-[750] tracking-[0.15em] text-[#cbc8ff]">CURATED FOR YOU</small>
            <h2 className="m-0 text-[32px] tracking-[-0.045em]">Featured products</h2>
          </div>
          <Link className="text-[12px] text-hm-accent no-underline" to="/products">
            View all
          </Link>
        </div>
        {isError ? (
          <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
            <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load featured products.</p>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isPending ? (
          <div className={productGridClass}>
            {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[4/5] rounded-hm-md bg-hm-field" />
                <span className="mx-1 my-3.5 block h-3 w-[60%] rounded-[8px] bg-hm-field" />
              </div>
            ))}
          </div>
        ) : (
          <RevealGroup className={productGridClass}>
            {featured.map((product) => (
              <RevealItem key={product.id}>
                <ProductCard product={toCardProduct(product)} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </section>
    </>
  );
}
