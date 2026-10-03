import { useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { cn } from "@/lib/cn";
import { useMotionPresets } from "@/lib/motion";
import ProductCard from "@/features/catalog/components/ProductCard";
import { productGridClass } from "@/features/catalog/styles";
import { products } from "@/lib/mock/products";

const categories = ["All products", "Electronics", "Phones & Tablets", "Fashion", "Home & Living", "Beauty"];

export default function ProductsPage() {
  const [query, setQuery] = useState("earbuds");
  const [loading, setLoading] = useState(false);
  const { rise } = useMotionPresets();
  const visible = query && !query.toLowerCase().includes("earbuds") ? [] : products;

  return (
    <>
      <PageHeader
        variant="storefront"
        eyebrow="CATALOG"
        title="Find exactly what you need."
        description={`${visible.length} results${query ? ` for “${query}”` : ""}`}
      />

      <div className="mb-[46px] flex h-[58px] max-w-[800px] items-center rounded-[14px] bg-hm-surface px-[18px]">
        <input
          aria-label="Search products"
          className="min-w-0 flex-1 border-0 bg-transparent text-[16px] outline-0"
          type="search"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        />
        <Button variant="ghost" onClick={() => setLoading(!loading)}>
          {loading ? "Show products" : "Preview loading"}
        </Button>
      </div>

      <div className="grid grid-cols-[190px_1fr] gap-[50px] max-[900px]:grid-cols-1">
        <aside className="flex flex-col gap-1 max-[900px]:flex-row max-[900px]:overflow-auto">
          {categories.map((category, index) => (
            <button
              type="button"
              key={category}
              className={cn(
                "rounded-[10px] bg-transparent p-3 text-left text-hm-muted max-[900px]:min-w-max",
                index === 0 && "bg-hm-text text-white",
              )}
            >
              {category}
            </button>
          ))}
        </aside>

        <section>
          {/* Keyed by state so skeleton and results cross-fade as one block, not card by card. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={loading ? "loading" : visible.length ? "results" : "empty"}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={rise}
            >
              {loading ? (
                <div className={productGridClass}>
                  {products.map((product) => (
                    <div key={product.id}>
                      <div className="aspect-[4/5] rounded-hm-md bg-[#eee]" />
                      <span className="mx-1 my-3.5 block h-3 w-[60%] rounded-[8px] bg-[#eee]" />
                    </div>
                  ))}
                </div>
              ) : visible.length ? (
                <div className={productGridClass}>
                  {visible.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <h2 className="m-0">No products match this search.</h2>
                  <p>Try a broader term or clear your current search.</p>
                  <Button variant="ghost" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </>
  );
}
