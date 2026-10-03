import { useState } from "react";
import { Link, useParams } from "react-router";
import Button from "@/components/Button";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuantityStepper from "@/components/QuantityStepper";
import Rating from "@/components/Rating";
import ProductReviews from "@/features/catalog/components/ProductReviews";
import { formatNaira } from "@/lib/format";
import { products } from "@/lib/mock/products";
import { reviewSummary } from "@/lib/mock/reviews";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id)) ?? products[0];
  const initials = product.vendor
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(true);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: product.name }]} />

      <div className="grid grid-cols-[1.1fr_0.9fr] items-start gap-[7vw] pt-10 max-[900px]:grid-cols-1">
        <div>
          <img className="block aspect-square w-full rounded-hm-md object-cover" src={product.image} alt={product.name} />
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {[0, 1, 2, 3].map((n) => (
              <img className="aspect-square w-full rounded-[10px] object-cover" src={product.image} alt="" key={n} />
            ))}
          </div>
        </div>

        <section>
          <div className="flex items-center justify-end gap-2.5 text-[9px] text-hm-muted">
            <span>Preview</span>
            <Button variant="ghost" onClick={() => setStock(!stock)}>
              {stock ? "Out of stock" : "In stock"}
            </Button>
          </div>
          <small className="text-[10px] font-[750] tracking-[0.14em] text-hm-accent uppercase">
            {product.vendor}
          </small>
          <h1 className="my-4 text-[clamp(42px,5vw,68px)] leading-none tracking-[-0.06em]">{product.name}</h1>
          <div className="flex items-center gap-2.5 text-[11px] text-hm-muted">
            <Rating value={reviewSummary.average} size={12} />
            <span>
              {reviewSummary.average.toFixed(1)} · {reviewSummary.count} reviews
            </span>
          </div>
          <div className="mt-10 mb-6 flex items-center gap-4">
            <b className="text-[30px] text-hm-accent">{formatNaira(product.price)}</b>
            <del className="text-hm-muted">₦24,000</del>
          </div>
          <p className="leading-[1.7] text-hm-muted">
            Immersive sound, clear calls, and up to 28 hours of listening with adaptive noise cancellation.
          </p>
          <div className="mt-7 flex items-center gap-3">
            {stock ? (
              <QuantityStepper
                value={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
              />
            ) : (
              <span>Out of stock</span>
            )}
            <Button disabled={!stock}>Add to Cart</Button>
            <Button variant="ghost" aria-label="Save to wishlist">
              ♡
            </Button>
          </div>
          <article className="mt-12 flex items-center gap-3.5 rounded-hm-md bg-hm-surface p-6">
            <span className="grid size-[46px] place-items-center rounded-full bg-hm-text text-[11px] text-white">
              {initials}
            </span>
            <div>
              <strong>{product.vendor}</strong>
              <small className="mt-1 block text-hm-muted">Smart tech for everyday living.</small>
            </div>
            <Link className="ml-auto text-[11px] text-hm-accent no-underline" to="/products">
              Visit storefront
            </Link>
          </article>
        </section>
      </div>

      <ProductReviews />
    </>
  );
}
