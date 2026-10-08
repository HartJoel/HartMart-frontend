import { Link } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button, { buttonClasses } from "@/components/Button";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";
import ResultScreen from "@/components/ResultScreen";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import { useAddToCart } from "@/features/cart/api";
import type { VendorOriginState } from "@/features/vendor-storefront/vendorOrigin";
import { useRemoveFromWishlist, useWishlist } from "@/features/wishlist/api";
import { formatNaira } from "@/lib/format";

export default function WishlistPage() {
  const { data: wishlist, isPending, isError, refetch } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const origin = [{ label: "Wishlist", to: "/wishlist" }];

  if (isPending) {
    return (
      <RevealGroup>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-[104px] animate-pulse rounded-hm-md border-t border-hm-border bg-hm-field" />
        ))}
      </RevealGroup>
    );
  }

  if (isError) {
    return (
      <div className="grid min-h-[420px] place-items-center gap-4 text-center">
        <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load your wishlist. Please try again.</p>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const saved = wishlist?.items ?? [];

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="SAVED FOR LATER"
        title="Your wishlist"
        description={`${saved.length} ${saved.length === 1 ? "item" : "items"}`}
      />

      {saved.length === 0 ? (
        <ResultScreen
          showBrand={false}
          fullPage={false}
          icon={<Icon name="heart" size={20} />}
          title="Nothing saved yet."
          description="Tap the heart on any product to keep it here."
          action={
            <Link className={buttonClasses()} to="/products">
              Browse products
            </Link>
          }
        />
      ) : (
        <RevealGroup>
          {saved.map((item) => {
            const product = item.product;
            const price = Number(product.discountPrice ?? product.basePrice);

            return (
              <RevealItem key={item.id}>
                <article className="flex flex-wrap items-center gap-5 border-t border-hm-border py-5">
                  <Link to={`/products/${product.id}`} className="shrink-0">
                    {product.images[0] ? (
                      <img className="aspect-square w-24 rounded-hm-sm object-cover" src={product.images[0].url} alt="" />
                    ) : (
                      <span className="grid aspect-square w-24 place-items-center rounded-hm-sm bg-hm-field text-hm-muted">
                        <Icon name="shop" size={20} />
                      </span>
                    )}
                  </Link>

                  <div className="min-w-[160px] flex-1">
                    <Link to={`/products/${product.id}`} className="text-hm-text no-underline">
                      <strong>{product.name}</strong>
                    </Link>
                    <Link
                      to={`/vendors/${product.vendorId}`}
                      state={{ origin } satisfies VendorOriginState}
                      className="mt-1.5 block text-[10px] text-hm-muted no-underline hover:text-hm-text"
                    >
                      Visit storefront
                    </Link>
                  </div>

                  <b className="whitespace-nowrap">{formatNaira(price)}</b>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={addToCart.isPending}
                      onClick={() =>
                        addToCart.mutate(
                          { productId: product.id },
                          { onSuccess: () => removeFromWishlist.mutate(product.id) },
                        )
                      }
                    >
                      {addToCart.isPending ? "Moving…" : "Move to cart"}
                    </Button>
                    <Link to={`/products/${product.id}`} className={buttonClasses({ variant: "quiet", size: "sm" })}>
                      View product
                    </Link>
                    <IconButton
                      tone="danger"
                      label={`Remove ${product.name}`}
                      disabled={removeFromWishlist.isPending}
                      onClick={() => removeFromWishlist.mutate(product.id)}
                    >
                      <Icon name="close" size={13} />
                    </IconButton>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      )}
    </>
  );
}
