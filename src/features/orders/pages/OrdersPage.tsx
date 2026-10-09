import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import AccountShell from "@/features/account/components/AccountShell";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { useOrders } from "@/features/orders/api";
import { formatDate, formatNaira } from "@/lib/format";
import { orderStatusTone } from "@/lib/orderStatus";
import type { Order } from "@/types/order";

export default function OrdersPage() {
  const [selected, setSelected] = useState<Order | null>(null);
  const { data: orders, isPending, isError, refetch } = useOrders();

  return (
    <AccountShell>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Orders" }]} />
      <PageHeader
        eyebrow="YOUR ACCOUNT"
        title="Order history"
        description="Track current deliveries and revisit everything you've ordered."
      />

      {isPending ? (
        <ul className="m-0 list-none border-b border-hm-border p-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="border-t border-hm-border px-3 py-5">
              <div className="h-10 animate-pulse rounded-hm-sm bg-hm-field" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load your orders. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-[12px] text-hm-muted">
          <Icon name="orders" size={28} />
          <div>You haven&apos;t placed any orders yet.</div>
        </div>
      ) : (
        <ul className="m-0 list-none border-b border-hm-border p-0">
          {orders.map((order) => (
            <li key={order.id} className="border-t border-hm-border">
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setSelected(order)}
                className="group grid w-full cursor-pointer grid-cols-[1.4fr_1fr_0.8fr_20px] items-center gap-4 rounded-hm-sm border-0 bg-transparent px-3 py-5 text-left text-hm-text transition-colors duration-200 hover:bg-hm-field max-[760px]:grid-cols-[1fr_auto] max-[760px]:gap-y-3"
              >
                <span>
                  <strong className="block text-[14px] font-[650]">{order.orderNumber}</strong>
                  <small className="mt-1 block text-[11px] text-hm-muted">
                    {formatDate(order.createdAt)} · {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </small>
                </span>
                <span className="max-[760px]:col-start-1 max-[760px]:row-start-2">
                  <StatusBadge tone={orderStatusTone(order.status)} className="capitalize">
                    {order.status.toLowerCase()}
                  </StatusBadge>
                </span>
                <span className="text-[14px] font-[650] max-[760px]:col-start-2 max-[760px]:row-start-1 max-[760px]:text-right">
                  {formatNaira(Number(order.totalAmount))}
                </span>
                <Icon
                  name="arrow"
                  size={16}
                  className="text-hm-muted transition-transform duration-200 group-hover:translate-x-0.5 max-[760px]:hidden"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {selected && (
          <Drawer eyebrow="ORDER DETAILS" title={`Order ${selected.orderNumber}`} onClose={() => setSelected(null)}>
            <OrderDetails order={selected} />
          </Drawer>
        )}
      </AnimatePresence>
    </AccountShell>
  );
}
