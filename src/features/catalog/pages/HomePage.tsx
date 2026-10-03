import { Link } from "react-router";
import { buttonClasses } from "@/components/Button";
import ProductCard from "@/features/catalog/components/ProductCard";
import VendorSpotlight from "@/features/catalog/components/VendorSpotlight";
import { productGridClass, sectionHeadClass } from "@/features/catalog/styles";
import { products } from "@/lib/mock/products";

const categories = ["Electronics", "Fashion & Apparel", "Home & Living", "Beauty", "Groceries", "Phones & Tablets"];

export default function HomePage() {
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

      <section className="pt-[100px]">
        <div className={sectionHeadClass}>
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">Shop by category</h2>
        </div>
        <div className="flex gap-7 overflow-auto">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="flex min-w-max items-center gap-2.5 text-[12px] font-[650] text-hm-text no-underline"
            >
              <span className="grid size-11 place-items-center rounded-full bg-hm-field">{category.slice(0, 1)}</span>
              {category}
            </Link>
          ))}
        </div>
      </section>

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
        <div className={productGridClass}>
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
