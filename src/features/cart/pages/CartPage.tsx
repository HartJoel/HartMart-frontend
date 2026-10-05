import { Link } from "react-router";
import { buttonClasses } from "@/components/Button";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuantityStepper from "@/components/QuantityStepper";
import ResultScreen from "@/components/ResultScreen";
import { useCart } from "@/features/cart/CartContext";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const { items, itemCount, changeQuantity, removeItem } = useCart();

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

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="YOUR SELECTION"
        title="Your cart"
        description={`${itemCount} items`}
      />

      <div className="grid grid-cols-[1fr_360px] items-start gap-[6vw] max-[900px]:grid-cols-1">
        <section>
          {items.map(({ product, quantity }) => (
            <article
              key={product.id}
              className="grid grid-cols-[120px_1fr_auto_100px_30px] items-center gap-[18px] border-t border-hm-border py-5 max-[600px]:grid-cols-[82px_1fr_30px]"
            >
              <img
                className="aspect-square w-[120px] rounded-hm-sm object-cover max-[600px]:row-span-2 max-[600px]:w-[82px]"
                src={product.image}
                alt=""
              />
              <div>
                <strong>{product.name}</strong>
                <small className="mt-1.5 block text-[10px] text-hm-muted">Sold by {product.vendor}</small>
                <span className="mt-1.5 block text-[10px] text-hm-muted">{formatNaira(product.price)} each</span>
              </div>
              <div className="max-[600px]:col-start-2">
                <QuantityStepper
                  value={quantity}
                  onDecrease={() => changeQuantity(product.id, -1)}
                  onIncrease={() => changeQuantity(product.id, 1)}
                />
              </div>
              <b className="max-[600px]:col-start-2">{formatNaira(product.price * quantity)}</b>
              <IconButton
                tone="danger"
                label={`Remove ${product.name}`}
                onClick={() => removeItem(product.id)}
                className="max-[600px]:col-start-3 max-[600px]:row-start-1"
              >
                <Icon name="close" size={13} />
              </IconButton>
            </article>
          ))}
        </section>

        <aside className="sticky top-5 rounded-hm-md bg-hm-surface p-[30px] max-[900px]:static">
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">Order summary</h2>
          <div className="mt-10 mb-3 flex justify-between">
            <span>Subtotal</span>
            <b>{formatNaira(subtotal)}</b>
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
