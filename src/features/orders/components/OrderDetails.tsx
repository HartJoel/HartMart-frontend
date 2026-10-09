import Icon from "@/components/Icon";
import StatusBadge from "@/components/StatusBadge";
import { parseShippingAddress, useOrderTimeline } from "@/features/orders/api";
import OrderReviews from "@/features/reviews/components/OrderReviews";
import { formatDate, formatDateTime, formatNaira } from "@/lib/format";
import { orderStatusTone } from "@/lib/orderStatus";
import { cn } from "@/lib/cn";
import type { Order } from "@/types/order";

/** Pricing breakdown rows, omitting the discount line entirely when there's no discount. */
function summaryRows(order: Order): [string, number][] {
  const rows: [string, number][] = [
    ["Subtotal", Number(order.subtotal)],
    ["Tax", Number(order.taxAmount)],
    ["Shipping", Number(order.shippingCost)],
  ];
  const discount = Number(order.discountAmount);
  if (discount > 0) rows.push(["Discount", -discount]);
  return rows;
}

/** Order summary, pricing, shipping and status timeline. Shared by the order drawer and the order page. */
export default function OrderDetails({ order }: { order: Order }) {
  const address = parseShippingAddress(order);
  const { data: timeline, isPending: timelinePending, isError: timelineError } = useOrderTimeline(order.id);

  return (
    <div className="grid gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-[13px] text-hm-muted">Placed {formatDate(order.createdAt)}</p>
        <StatusBadge tone={orderStatusTone(order.status)} className="capitalize">
          {order.status.toLowerCase()}
        </StatusBadge>
      </div>

      <section>
        <h3 className="m-0 mb-4 text-[13px] font-[650]">Items</h3>
        <ul className="m-0 list-none p-0">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 border-t border-hm-border py-4">
              {item.image ? (
                <img
                  className="size-16 shrink-0 rounded-[10px] bg-hm-field object-cover"
                  src={item.image.url}
                  alt=""
                />
              ) : (
                <div className="size-16 shrink-0 rounded-[10px] bg-hm-field" />
              )}
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[13px] font-[600]">{item.name}</p>
                <p className="m-0 mt-1 text-[11px] text-hm-muted">Qty {item.quantity}</p>
              </div>
              <span className="text-[13px] font-[650]">{formatNaira(Number(item.totalPrice))}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-hm-md bg-hm-field p-5">
        <h3 className="m-0 mb-4 text-[13px] font-[650]">Payment summary</h3>
        <dl className="m-0 grid gap-3 text-[12px]">
          {summaryRows(order).map(([label, amount]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-hm-muted">{label}</dt>
              <dd className="m-0">{formatNaira(amount)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-hm-border pt-3">
            <dt className="font-[650]">Total</dt>
            <dd className="m-0 font-[650]">{formatNaira(Number(order.totalAmount))}</dd>
          </div>
        </dl>
      </section>

      {address && (
        <section>
          <h3 className="m-0 mb-4 text-[13px] font-[650]">Shipping address</h3>
          <p className="m-0 text-[12px] leading-[1.7] text-hm-muted">
            {address.addressLine}
            <br />
            {address.city}, {address.state}, {address.country} {address.zipCode}
          </p>
        </section>
      )}

      {(order.trackingNumber || order.estimatedDelivery) && (
        <section className="grid gap-3 text-[12px]">
          <h3 className="m-0 text-[13px] font-[650]">Delivery</h3>
          {order.trackingNumber && (
            <div className="flex justify-between gap-4">
              <span className="text-hm-muted">Tracking number</span>
              <span className="font-[650]">{order.trackingNumber}</span>
            </div>
          )}
          {order.estimatedDelivery && (
            <div className="flex justify-between gap-4">
              <span className="text-hm-muted">Estimated delivery</span>
              <span className="font-[650]">{formatDate(order.estimatedDelivery)}</span>
            </div>
          )}
        </section>
      )}

      {order.customerNotes && (
        <section>
          <h3 className="m-0 mb-2 text-[13px] font-[650]">Notes</h3>
          <p className="m-0 text-[12px] leading-[1.7] text-hm-muted">{order.customerNotes}</p>
        </section>
      )}

      <section>
        <h3 className="m-0 mb-4 text-[13px] font-[650]">Status history</h3>
        {timelinePending ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-hm-sm bg-hm-field" />
            ))}
          </div>
        ) : timelineError || !timeline || timeline.length === 0 ? (
          <p className="m-0 text-[12px] text-hm-muted">No status history yet.</p>
        ) : (
          <ol className="m-0 list-none p-0">
            {[...timeline]
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((entry, index, sorted) => {
                const isLast = index === sorted.length - 1;
                return (
                  <li key={entry.id} className="relative grid grid-cols-[28px_1fr] gap-4 pb-6 last:pb-0">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-7 place-items-center rounded-full border",
                        isLast ? "border-hm-text bg-hm-text text-white" : "border-hm-border bg-hm-surface text-hm-muted",
                      )}
                    >
                      <Icon name="check" size={13} />
                    </span>
                    <div>
                      <p className="m-0 text-[13px] font-[650] capitalize">{entry.status.toLowerCase()}</p>
                      {entry.note && <p className="m-0 mt-0.5 text-[11px] text-hm-muted">{entry.note}</p>}
                      <p className="m-0 mt-0.5 text-[11px] text-hm-muted">{formatDateTime(entry.createdAt)}</p>
                    </div>
                  </li>
                );
              })}
          </ol>
        )}
      </section>

      {order.status === "DELIVERED" && <OrderReviews orderId={order.id} items={order.items} />}
    </div>
  );
}
