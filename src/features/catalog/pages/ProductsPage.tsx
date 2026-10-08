import { useEffect, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
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

/** Windowed page numbers around the current page, with "…" standing in for a gap. */
function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const kept = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...kept].filter((item) => item >= 1 && item <= total).sort((a, b) => a - b);

  const result: (number | "…")[] = [];
  let previous = 0;
  for (const item of sorted) {
    if (previous && item - previous > 1) result.push("…");
    result.push(item);
    previous = item;
  }
  return result;
}

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

      <div className="mb-[46px] flex h-[58px] max-w-[800px] items-center gap-3 rounded-[14px] bg-hm-surface px-[18px]">
        <Icon name="search" size={18} className="shrink-0 text-hm-muted" />
        <input
          aria-label="Search products"
          className="min-w-0 flex-1 border-0 bg-transparent text-[16px] outline-0"
          type="search"
          placeholder="Search products…"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        />
        {query && (
          <IconButton label="Clear search" onClick={() => setQuery("")}>
            <Icon name="close" size={13} />
          </IconButton>
        )}
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-[50px] max-[900px]:grid-cols-1">
        <aside className="flex flex-col gap-1 rounded-hm-md bg-hm-surface p-5 max-[900px]:flex-row max-[900px]:gap-2 max-[900px]:overflow-auto max-[900px]:p-3">
          <p className="m-0 mb-2 px-3 text-[10px] font-[750] tracking-[0.14em] text-hm-muted max-[900px]:hidden">
            CATEGORIES
          </p>
          <CategoryLink label="All products" active={!categoryId} onClick={() => selectCategory(null)} />
          {roots.map((category) => {
            const subcategories = (categories ?? []).filter((sub) => sub.parentId === category.id);
            return (
              <div key={category.id} className="flex flex-col gap-1 max-[900px]:flex-row">
                <CategoryLink
                  label={category.name}
                  icon={category.icon}
                  active={categoryId === category.id}
                  onClick={() => selectCategory(category.id)}
                />
                {subcategories.map((sub) => (
                  <CategoryLink
                    key={sub.id}
                    label={sub.name}
                    active={categoryId === sub.id}
                    onClick={() => selectCategory(sub.id)}
                    nested
                  />
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

          {data && products.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hm-border pt-6">
              <p className="m-0 text-[11px] text-hm-muted">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.pagination.total)} of{" "}
                {data.pagination.total}
              </p>

              {data.pagination.pages > 1 && (
                <div className="flex items-center gap-1.5">
                  <IconButton
                    label="Previous page"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    <Icon name="arrow" size={15} className="rotate-180" />
                  </IconButton>
                  {pageNumbers(page, data.pagination.pages).map((item, index) =>
                    item === "…" ? (
                      <span key={`gap-${index}`} className="px-1 text-[12px] text-hm-muted">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        aria-current={item === page ? "page" : undefined}
                        onClick={() => setPage(item)}
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-full border-0 bg-transparent text-[12px] font-[650] text-hm-muted transition-colors duration-200 hover:bg-hm-field hover:text-hm-text",
                          item === page && "bg-hm-text text-white hover:bg-hm-text hover:text-white",
                        )}
                      >
                        {item}
                      </button>
                    ),
                  )}
                  <IconButton
                    label="Next page"
                    disabled={page >= data.pagination.pages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    <Icon name="arrow" size={15} />
                  </IconButton>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function CategoryLink({
  label,
  icon,
  active,
  nested,
  onClick,
}: {
  label: string;
  icon?: string | null;
  active: boolean;
  nested?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-10 items-center gap-2.5 rounded-hm-sm px-3 text-left text-[13px] font-[600] text-hm-muted transition-colors duration-200 hover:bg-hm-field hover:text-hm-text max-[900px]:min-w-max",
        nested && "pl-9 text-[12px] font-[500] max-[900px]:pl-3",
        active && "bg-hm-text text-white hover:bg-hm-text hover:text-white",
      )}
    >
      {!nested && (
        <span
          aria-hidden="true"
          className={cn(
            "grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-hm-field text-hm-muted",
            active && "bg-white/15 text-white",
          )}
        >
          {icon ? <img src={icon} alt="" className="size-full object-cover" /> : <Icon name="categories" size={12} />}
        </span>
      )}
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}
