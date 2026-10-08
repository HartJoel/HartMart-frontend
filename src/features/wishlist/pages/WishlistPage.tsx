import { Link } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button, { buttonClasses } from "@/components/Button";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";
import ResultScreen from "@/components/ResultScreen";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import type { VendorOriginState } from "@/features/vendor-storefront/vendorOrigin";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { formatNaira } from "@/lib/format";
import { products } from "@/lib/mock/products";

export default function WishlistPage() {
  const { savedIds, remove } = useWishlist();
  const origin = [{ label: "Wishlist", to: "/wishlist" }];
  const saved = products.filter((product) => savedIds.includes(product.id));

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
          {saved.map((product) => (
            <RevealItem key={product.id}>
              <article className="flex flex-wrap items-center gap-5 border-t border-hm-border py-5">
                <Link to={`/products/${product.id}`} className="shrink-0">
                  <img className="aspect-square w-24 rounded-hm-sm object-cover" src={product.image} alt="" />
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
                    Sold by {product.vendor}
                  </Link>
                </div>

                <b className="whitespace-nowrap">{formatNaira(product.price)}</b>

                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" disabled title="Wishlist isn't connected yet">
                    Move to cart
                  </Button>
                  <Link to={`/products/${product.id}`} className={buttonClasses({ variant: "quiet", size: "sm" })}>
                    View product
                  </Link>
                  <IconButton tone="danger" label={`Remove ${product.name}`} onClick={() => remove(product.id)}>
                    <Icon name="close" size={13} />
                  </IconButton>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </>
  );
}
