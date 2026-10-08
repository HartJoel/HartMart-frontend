import { useEffect, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import { cn } from "@/lib/cn";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useMotionPresets } from "@/lib/motion";
import { toCardProduct, useCategories, useProducts } from "@/features/catalog/api";
import ProductCard from "@/features/catalog/components/ProductCard";
import { productGridClass } from "@/features/catalog/styles";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId");
  const [query, setQuery] = useState(urlSearch);
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebouncedValue(query, 400);
  const { rise } = useMotionPresets();
  const { data: categories } = useCategories();

  // Keeps the box in sync when the header search bar submits a new term while already on this page.
  useEffect(() => setQuery(urlSearch), [urlSearch]);

  useEffect(() => {
    setPage(1);
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (debouncedQuery) next.set("search", debouncedQuery);
        else next.delete("search");
        return next;
      },
      { replace: true },
    );
  }, [debouncedQuery]);

  function selectCategory(id: string | null) {
    setPage(1);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (id) next.set("categoryId", id);
      else next.delete("categoryId");
      return next;
    });
  }

  const { data, isPending, isError, refetch } = useProducts({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery || undefined,
    categoryId: categoryId || undefined,
  });
  const products = data?.data ?? [];
  const roots = (categories ?? []).filter((category) => category.parentId === null);
  const activeCategoryName = (categories ?? []).find((category) => category.id === categoryId)?.name;

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Products" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="CATALOG"
        title="Find exactly what you need."
        description={
          isPending
            ? "Searching…"
            : `${data?.pagination.total ?? 0} results${query ? ` for “${query}”` : ""}${
                activeCategoryName ? ` in ${activeCategoryName}` : ""
              }`
        }
      />

      <div className="mb-[46px] flex h-[58px] max-w-[800px] items-center rounded-[14px] bg-hm-surface px-[18px]">
        <input
          aria-label="Search products"
          className="min-w-0 flex-1 border-0 bg-transparent text-[16px] outline-0"
          type="search"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-[190px_1fr] gap-[50px] max-[900px]:grid-cols-1">
        <aside className="flex flex-col gap-1 max-[900px]:flex-row max-[900px]:overflow-auto">
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className={cn(
              "rounded-[10px] bg-transparent p-3 text-left text-hm-muted max-[900px]:min-w-max",
              !categoryId && "bg-hm-text text-white",
            )}
          >
            All products
          </button>
          {roots.map((category) => {
            const subcategories = (categories ?? []).filter((sub) => sub.parentId === category.id);
            return (
              <div key={category.id} className="flex flex-col gap-1 max-[900px]:flex-row">
                <button
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={cn(
                    "rounded-[10px] bg-transparent p-3 text-left text-hm-muted max-[900px]:min-w-max",
                    categoryId === category.id && "bg-hm-text text-white",
                  )}
                >
                  {category.name}
                </button>
                {subcategories.map((sub) => (
                  <button
                    type="button"
                    key={sub.id}
                    onClick={() => selectCategory(sub.id)}
                    className={cn(
                      "rounded-[10px] bg-transparent p-3 pl-7 text-left text-[12px] text-hm-muted max-[900px]:min-w-max max-[900px]:pl-3",
                      categoryId === sub.id && "bg-hm-text text-white",
                    )}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            );
          })}
        </aside>

        <section>
          {isError ? (
            <div className="grid min-h-[420px] place-items-center gap-4 text-center">
              <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load products. Please try again.</p>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            // Keyed by state so skeleton, results and empty swap as one block. Results then stagger in card by card.
            <AnimatePresence mode="wait">
              <motion.div
                key={isPending ? "loading" : products.length ? "results" : "empty"}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={rise}
              >
                {isPending ? (
                  <div className={productGridClass}>
                    {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                      <div key={index}>
                        <div className="aspect-[4/5] rounded-hm-md bg-[#eee]" />
                        <span className="mx-1 my-3.5 block h-3 w-[60%] rounded-[8px] bg-[#eee]" />
                      </div>
                    ))}
                  </div>
                ) : products.length ? (
                  <RevealGroup className={productGridClass}>
                    {products.map((product) => (
                      <RevealItem key={product.id}>
                        <ProductCard product={toCardProduct(product)} />
                      </RevealItem>
                    ))}
                  </RevealGroup>
                ) : (
                  <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                    <h2 className="m-0">No products match{activeCategoryName ? ` ${activeCategoryName}` : " this search"}.</h2>
                    <p>Try a broader term or clear your current filters.</p>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setQuery("");
                        selectCategory(null);
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {data && data.pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <span className="text-[11px] text-hm-muted">
                Page {data.pagination.page} of {data.pagination.pages}
              </span>
              <Button variant="quiet" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                Previous
              </Button>
              <Button
                variant="quiet"
                size="sm"
                disabled={page >= data.pagination.pages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
