import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import Button, { buttonClasses } from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import ResultScreen from "@/components/ResultScreen";
import { useAddresses, useUpdateAddress } from "@/features/account/api";
import { useCart } from "@/features/cart/api";
import { useCreateOrder } from "@/features/orders/api";
import { useInitializePayment } from "@/features/payment/api";
import { setPendingPayment } from "@/features/checkout/pendingPayment";
import { cn } from "@/lib/cn";
import { formatNaira } from "@/lib/format";
import type { Address } from "@/types/address";

export default function CheckoutPage() {
  const { data: addresses, isPending: addressesPending } = useAddresses();
  const { data: cart, isPending: cartPending } = useCart();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateAddress = useUpdateAddress();
  const createOrder = useCreateOrder();
  const initializePayment = useInitializePayment();
  const isPlacing = updateAddress.isPending || createOrder.isPending || initializePayment.isPending;

  // Pick the saved default address once addresses load, if nothing's selected yet.
  useEffect(() => {
    if (selectedId || !addresses?.length) return;
    setSelectedId(addresses.find((address) => address.isDefault)?.id ?? addresses[0].id);
  }, [addresses, selectedId]);

  const items = cart?.items ?? [];

  async function placeOrder() {
    const selected = addresses?.find((address) => address.id === selectedId);
    if (!selected) return;

    setError(null);
    try {
      if (!selected.isDefault) {
        const { id, userId: _userId, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = selected;
        await updateAddress.mutateAsync({ id, payload: { ...payload, isDefault: true } });
      }
      const order = await createOrder.mutateAsync({ paymentMethod: "paystack", customerNotes: notes.trim() || undefined });
      const payment = await initializePayment.mutateAsync(order.id);
      setPendingPayment({ paymentId: payment.paymentId, orderId: order.id });
      window.location.href = payment.authorizationUrl;
    } catch {
      setError("Couldn't place your order. Please try again.");
    }
  }

  if (isPlacing) {
    return <ResultScreen icon="⋯" title="Setting up your order…" description="Hang on while we get everything ready." />;
  }

  if (!cartPending && items.length === 0) {
    return (
      <ResultScreen
        showBrand={false}
        fullPage={false}
        icon="□"
        title="Your cart is empty."
        description="Add something to your cart before checking out."
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
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="CHECKOUT"
        title="Almost yours."
        description="Choose where your order should go, then review the details before payment."
      />

      <section className="grid grid-cols-[46px_1fr] gap-[18px] border-t border-hm-border py-[50px]">
        <b className="grid size-[34px] place-items-center rounded-full bg-hm-text text-white">1</b>
        <div>
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">Delivery address</h2>

          {addressesPending ? (
            <div className="my-[22px] grid grid-cols-2 gap-3.5 max-[600px]:grid-cols-1">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="h-[190px] animate-pulse rounded-[14px] bg-hm-field" />
              ))}
            </div>
          ) : !addresses || addresses.length === 0 ? (
            <div className="my-[22px] rounded-[14px] border border-dashed border-hm-border p-[22px] text-[12px] text-hm-muted">
              You don&apos;t have a saved address yet.{" "}
              <Link to="/account/addresses" className="text-hm-accent no-underline hover:underline">
                Add one
              </Link>{" "}
              before checking out.
            </div>
          ) : (
            <div className="my-[22px] grid grid-cols-2 gap-3.5 max-[600px]:grid-cols-1">
              {addresses.map((address) => (
                <AddressOption
                  key={address.id}
                  address={address}
                  selected={selectedId === address.id}
                  onSelect={() => setSelectedId(address.id)}
                />
              ))}
            </div>
          )}
          <Link to="/account/addresses" className={buttonClasses({ variant: "ghost" })}>
            + Add new address
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-[46px_1fr] gap-[18px] border-t border-hm-border py-[50px]">
        <b className="grid size-[34px] place-items-center rounded-full bg-hm-text text-white">2</b>
        <div>
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">Order summary</h2>
          {cartPending
            ? Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="mt-[18px] h-12 animate-pulse rounded-hm-sm bg-hm-field" />
              ))
            : items.map((item) => {
                const price = Number(item.product.discountPrice ?? item.product.basePrice);
                return (
                  <div key={item.id} className="flex items-center gap-3.5 border-t border-hm-border py-[18px]">
                    <span className="flex-1">
                      {item.product.name}
                      <small className="mt-[5px] block text-hm-muted">Qty {item.quantity}</small>
                    </span>
                    <b>{formatNaira(price * item.quantity)}</b>
                  </div>
                );
              })}
          <div className="flex justify-between pt-6 text-[20px]">
            <span>Total</span>
            <b>{formatNaira(cart?.total ?? 0)}</b>
          </div>

          <label htmlFor="checkout-notes" className="mt-7 block text-[11px] font-[600]">
            Notes for delivery (optional)
          </label>
          <textarea
            id="checkout-notes"
            rows={3}
            value={notes}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setNotes(event.target.value)}
            placeholder="E.g. please deliver in the morning"
            className="mt-2 w-full resize-y rounded-hm-sm border-0 bg-hm-field p-4 text-[13px] leading-[1.6] text-hm-text"
          />
        </div>
      </section>

      {error && <p className="m-0 mb-4 text-[12px] text-hm-error">{error}</p>}

      <Button onClick={placeOrder} disabled={!selectedId || items.length === 0}>
        Place Order · {formatNaira(cart?.total ?? 0)}
      </Button>
    </>
  );
}

function AddressOption({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "min-h-[190px] rounded-[14px] border border-hm-border bg-hm-surface p-[22px] text-left",
        selected && "border-hm-accent",
      )}
    >
      {address.isDefault && <strong className="text-[10px] text-hm-accent">Default</strong>}
      <p className="text-[11px] leading-[1.7] text-hm-muted">
        {address.addressLine}
        <br />
        {address.city}, {address.state}, {address.country} {address.zipCode}
      </p>
    </button>
  );
}
