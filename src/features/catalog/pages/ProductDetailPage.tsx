import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import Button, { buttonClasses } from "@/components/Button";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import QuantityStepper from "@/components/QuantityStepper";
import Rating from "@/components/Rating";
import { useProduct } from "@/features/catalog/api";
import ProductReviews from "@/features/catalog/components/ProductReviews";
import { useAddToCart } from "@/features/cart/api";
import { useAuthStore } from "@/features/auth/store";
import { useVendor } from "@/features/vendor-storefront/api";
import type { VendorOriginState } from "@/features/vendor-storefront/vendorOrigin";
import { formatNaira, getInitials } from "@/lib/format";

export default function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { data: product, isPending, isError, refetch } = useProduct(id);
  const { data: vendor } = useVendor(product?.vendorId);
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated");
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (isPending) {
    return (
      <div className="grid grid-cols-[1.1fr_0.9fr] items-start gap-[7vw] pt-10 max-[900px]:grid-cols-1">
        <div>
          <div className="aspect-square w-full animate-pulse rounded-hm-md bg-hm-field" />
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="aspect-square w-full animate-pulse rounded-[10px] bg-hm-field" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-3 w-24 animate-pulse rounded-full bg-hm-field" />
          <div className="h-12 w-3/4 animate-pulse rounded-hm-sm bg-hm-field" />
          <div className="h-6 w-1/3 animate-pulse rounded-hm-sm bg-hm-field" />
          <div className="h-24 w-full animate-pulse rounded-hm-sm bg-hm-field" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="grid min-h-[420px] place-items-center gap-4 text-center">
        <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load this product. Please try again.</p>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const inStock = product.availableStock > 0;
  const images = product.images.length > 0 ? product.images : null;
  const price = product.discountPrice ? Number(product.discountPrice) : Number(product.basePrice);

  const productId = product.id;
  function addProductToCart() {
    setJustAdded(false);
    addToCart.mutate({ productId, quantity }, { onSuccess: () => setJustAdded(true) });
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: product.name }]} />

      <div className="grid grid-cols-[1.1fr_0.9fr] items-start gap-[7vw] pt-10 max-[900px]:grid-cols-1">
        <div>
          {images ? (
            <img
              className="block aspect-square w-full rounded-hm-md object-cover"
              src={images[0].url}
              alt={product.name}
            />
          ) : (
            <span className="grid aspect-square w-full place-items-center rounded-hm-md bg-hm-field text-hm-muted">
              <Icon name="shop" size={40} />
            </span>
          )}
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {[0, 1, 2, 3].map((n) =>
              images && images[n] ? (
                <img className="aspect-square w-full rounded-[10px] object-cover" src={images[n].url} alt="" key={n} />
              ) : (
                <span key={n} className="grid aspect-square w-full place-items-center rounded-[10px] bg-hm-field text-hm-muted">
                  <Icon name="shop" size={16} />
                </span>
              ),
            )}
          </div>
        </div>

        <section>
          <small className="text-[10px] font-[750] tracking-[0.14em] text-hm-accent uppercase">
            {vendor?.storeName ?? "HartMart"}
          </small>
          <h1 className="my-4 text-[clamp(42px,5vw,68px)] leading-none tracking-[-0.06em]">{product.name}</h1>
          <div className="flex items-center gap-2.5 text-[11px] text-hm-muted">
            <Rating value={product.averageRating} size={12} />
            <span>
              {product.averageRating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>
          <div className="mt-10 mb-6 flex items-center gap-4">
            <b className="text-[30px] text-hm-accent">{formatNaira(price)}</b>
            {product.discountPrice && <del className="text-hm-muted">{formatNaira(Number(product.basePrice))}</del>}
          </div>
          <p className="leading-[1.7] text-hm-muted">{product.description}</p>
          <div className="mt-7 flex items-center gap-3">
            {inStock ? (
              <QuantityStepper
                value={quantity}
                onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                onIncrease={() => setQuantity((current) => Math.min(product.availableStock, current + 1))}
              />
            ) : (
              <span>Out of stock</span>
            )}
            {isAuthenticated ? (
              <Button disabled={!inStock || addToCart.isPending} onClick={addProductToCart}>
                {addToCart.isPending ? "Adding…" : justAdded ? "Added ✓" : "Add to Cart"}
              </Button>
            ) : (
              <Link
                className={buttonClasses()}
                to="/login"
                state={{ from: location, notice: "Sign in to add this to your cart." }}
              >
                Sign in to buy
              </Link>
            )}
            <Button variant="ghost" disabled aria-label="Save to wishlist" title="Wishlist isn't connected yet">
              ♡
            </Button>
          </div>
          {addToCart.isError && (
            <p role="alert" className="mt-2 text-[10px] text-hm-error">
              Couldn&apos;t add this to your cart. Please try again.
            </p>
          )}
          <p className="mt-2 text-[10px] text-hm-muted">Wishlist isn&apos;t connected yet.</p>

          {vendor && (
            <article className="mt-12 flex items-center gap-3.5 rounded-hm-md bg-hm-surface p-6">
              <span
                aria-hidden="true"
                className="grid size-[46px] shrink-0 place-items-center rounded-full bg-hm-text text-[11px] text-white"
              >
                {getInitials(vendor.storeName)}
              </span>
              <div className="min-w-0">
                <strong>{vendor.storeName}</strong>
                <small className="mt-1 block truncate text-hm-muted">{vendor.storeDescription}</small>
              </div>
              <Link
                className="ml-auto shrink-0 text-[11px] text-hm-accent no-underline"
                to={`/vendors/${vendor.id}`}
                state={{
                  origin: [
                    { label: "Products", to: "/products" },
                    { label: product.name, to: `/products/${product.id}` },
                  ],
                } satisfies VendorOriginState}
              >
                Visit storefront
              </Link>
            </article>
          )}
        </section>
      </div>

      <ProductReviews />
    </>
  );
}
