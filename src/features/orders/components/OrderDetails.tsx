import OrderReviews from "@/features/reviews/components/OrderReviews";
import Icon from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatNaira } from "@/lib/format";
import { orderTotal } from "@/lib/mock/orders";
import { orderStatusTone } from "@/lib/orderStatus";
import { cn } from "@/lib/cn";
import type { Order, OrderStatus } from "@/types/order";

const timeline = ["Order placed", "Payment confirmed", "Processing", "Shipped", "Delivered"];

/** How many timeline steps are complete at each status. */
const completedSteps: Record<OrderStatus, number> = {
  Pending: 1,
  Processing: 3,
  Shipped: 4,
  Delivered: 5,
};

/** Order summary, items, progress and payment. Shared by the order drawer and the order page. */
export default function OrderDetails({ order }: { order: Order }) {
  const done = completedSteps[order.status];

  return (
    <div className="grid gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-[13px] text-hm-muted">Placed {formatDate(order.date)}</p>
        <StatusBadge tone={orderStatusTone(order.status)}>{order.status}</StatusBadge>
      </div>

      <section>
        <h3 className="m-0 mb-4 text-[13px] font-[650]">Items</h3>
        <ul className="m-0 list-none p-0">
          {order.items.map((product) => (
            <li key={product.id} className="flex items-center gap-4 border-t border-hm-border py-4">
              <img className="size-16 shrink-0 rounded-[10px] bg-hm-field object-cover" src={product.image} alt="" />
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[13px] font-[600]">{product.name}</p>
                <p className="m-0 mt-1 text-[11px] text-hm-muted">{product.vendor}</p>
              </div>
              <span className="text-[13px] font-[650]">{formatNaira(product.price)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="m-0 mb-4 text-[13px] font-[650]">Delivery progress</h3>
        <ol className="m-0 list-none p-0">
          {timeline.map((step, index) => {
            const complete = index < done;
            return (
              <li key={step} className="relative grid grid-cols-[28px_1fr] gap-4 pb-6 last:pb-0">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-7 place-items-center rounded-full border",
                    complete ? "border-hm-text bg-hm-text text-white" : "border-hm-border bg-hm-surface text-hm-muted",
                  )}
                >
                  {complete && <Icon name="check" size={13} />}
                </span>
                <div>
                  <p className={cn("m-0 text-[13px]", complete ? "font-[650]" : "text-hm-muted")}>{step}</p>
                  <p className="m-0 mt-0.5 text-[11px] text-hm-muted">
                    {complete ? (index === 0 ? formatDate(order.date) : "Completed") : "Not yet"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-hm-md bg-hm-field p-5">
        <h3 className="m-0 mb-4 text-[13px] font-[650]">Payment</h3>
        <dl className="m-0 grid gap-3 text-[12px]">
          <div className="flex justify-between gap-4">
            <dt className="text-hm-muted">Method</dt>
            <dd className="m-0">{order.paymentMethod}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-hm-muted">Reference</dt>
            <dd className="m-0">{order.paymentReference}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-hm-border pt-3">
            <dt className="font-[650]">Total</dt>
            <dd className="m-0 font-[650]">{formatNaira(orderTotal(order))}</dd>
          </div>
        </dl>
      </section>

      {order.status === "Delivered" && <OrderReviews order={order} />}
    </div>
  );
}
