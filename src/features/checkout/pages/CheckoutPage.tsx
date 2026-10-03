import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cn } from "@/lib/cn";
import { formatNaira } from "@/lib/format";
import { products } from "@/lib/mock/products";

const addresses = [
  "18 Adebayo Doherty Road, Lekki Phase 1, Lagos",
  "12 Ozumba Mbadiwe Avenue, Victoria Island, Lagos",
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

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
          <div className="my-[22px] grid grid-cols-2 gap-3.5 max-[600px]:grid-cols-1">
            {addresses.map((address, index) => (
              <button
                type="button"
                key={address}
                onClick={() => setSelected(index)}
                className={cn(
                  "min-h-[190px] rounded-[14px] border border-hm-border bg-hm-surface p-[22px] text-left",
                  selected === index && "border-hm-accent",
                )}
              >
                <strong>{index ? "Office" : "Home"}</strong>
                <p className="text-[11px] leading-[1.7] text-hm-muted">
                  Amara Okafor
                  <br />
                  {address}
                  <br />
                  +234 803 456 7890
                </p>
              </button>
            ))}
          </div>
          <Button variant="ghost">+ Add new address</Button>
        </div>
      </section>

      <section className="grid grid-cols-[46px_1fr] gap-[18px] border-t border-hm-border py-[50px]">
        <b className="grid size-[34px] place-items-center rounded-full bg-hm-text text-white">2</b>
        <div>
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">Order summary</h2>
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="flex items-center gap-3.5 border-t border-hm-border py-[18px]">
              <span className="flex-1">
                {product.name}
                <small className="mt-[5px] block text-hm-muted">{product.vendor}</small>
              </span>
              <b>{formatNaira(product.price)}</b>
            </div>
          ))}
          <div className="flex justify-between pt-6 text-[20px]">
            <span>Total</span>
            <b>₦61,800</b>
          </div>
        </div>
      </section>

      <Button onClick={() => navigate("/payment/callback?status=success")}>Place Order · ₦61,800</Button>
    </>
  );
}
