import { useState } from "react";
import { Link } from "react-router";
import Button, { buttonClasses } from "@/components/Button";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuantityStepper from "@/components/QuantityStepper";
import ResultScreen from "@/components/ResultScreen";
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem, type CartLineItem } from "@/features/cart/api";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const { data: cart, isPending, isError, refetch } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function updateQuantity(item: CartLineItem, quantity: number) {
    if (quantity < 1 || quantity > item.product.availableStock) return;
    setPendingId(item.id);
    updateCartItem.mutate({ id: item.id, quantity }, { onSettled: () => setPendingId(null) });
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-[1fr_360px] items-start gap-[6vw] max-[900px]:grid-cols-1">
        <section className="flex flex-col gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[120px] animate-pulse rounded-hm-md bg-hm-field" />
          ))}
        </section>
        <div className="h-[260px] animate-pulse rounded-hm-md bg-hm-field" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid min-h-[420px] place-items-center gap-4 text-center">
        <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load your cart. Please try again.</p>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (!items.length) {
    return (
      <ResultScreen
        showBrand={false}
        fullPage={false}
        icon="□"
        title="Your cart is empty."
        description="There’s plenty worth discovering."
        action={
          <Link className={buttonClasses()} to="/products">
            Browse Products
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="YOUR SELECTION"
        title="Your cart"
        description={`${cart?.itemCount ?? 0} items`}
      />

      <div className="grid grid-cols-[1fr_360px] items-start gap-[6vw] max-[900px]:grid-cols-1">
        <section>
          {items.map((item) => {
            const price = Number(item.product.discountPrice ?? item.product.basePrice);
            const isPendingItem = pendingId === item.id && updateCartItem.isPending;

            return (
              <article
                key={item.id}
                className="grid grid-cols-[120px_1fr_auto_100px_30px] items-center gap-[18px] border-t border-hm-border py-5 max-[600px]:grid-cols-[82px_1fr_30px]"
              >
                <Link to={`/products/${item.productId}`} className="shrink-0 max-[600px]:row-span-2">
                  {item.product.images[0] ? (
                    <img
                      className="aspect-square w-[120px] rounded-hm-sm object-cover max-[600px]:w-[82px]"
                      src={item.product.images[0].url}
                      alt=""
                    />
                  ) : (
                    <span className="grid aspect-square w-[120px] place-items-center rounded-hm-sm bg-hm-field text-hm-muted max-[600px]:w-[82px]">
                      <Icon name="shop" size={22} />
                    </span>
                  )}
                </Link>
                <div>
                  <Link to={`/products/${item.productId}`} className="text-hm-text no-underline">
                    <strong>{item.product.name}</strong>
                  </Link>
                  <span className="mt-1.5 block text-[10px] text-hm-muted">{formatNaira(price)} each</span>
                </div>
                <div className="max-[600px]:col-start-2">
                  <QuantityStepper
                    value={item.quantity}
                    disabled={isPendingItem}
                    onDecrease={() => updateQuantity(item, item.quantity - 1)}
                    onIncrease={() => updateQuantity(item, item.quantity + 1)}
                  />
                </div>
                <b className="max-[600px]:col-start-2">{formatNaira(price * item.quantity)}</b>
                <IconButton
                  tone="danger"
                  label={`Remove ${item.product.name}`}
                  disabled={removeCartItem.isPending}
                  onClick={() => removeCartItem.mutate(item.id)}
                  className="max-[600px]:col-start-3 max-[600px]:row-start-1"
                >
                  <Icon name="close" size={13} />
                </IconButton>
              </article>
            );
          })}

          <div className="mt-5 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              disabled={clearCart.isPending}
              onClick={() => clearCart.mutate()}
            >
              {clearCart.isPending ? "Clearing…" : "Clear cart"}
            </Button>
          </div>
        </section>

        <aside className="sticky top-5 rounded-hm-md bg-hm-surface p-[30px] max-[900px]:static">
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">Order summary</h2>
          <div className="mt-10 mb-3 flex justify-between">
            <span>Subtotal</span>
            <b>{formatNaira(cart?.total ?? 0)}</b>
          </div>
          <p className="block text-[10px] leading-[1.6] text-hm-muted">Delivery and fees are calculated at checkout.</p>
          <Link className={buttonClasses({ className: "mt-[18px] w-full" })} to="/checkout">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </>
  );
}
