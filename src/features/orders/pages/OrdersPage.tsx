import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Drawer from "@/components/Drawer";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import AccountShell from "@/features/account/components/AccountShell";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { formatDate, formatNaira } from "@/lib/format";
import { orderTotal, orders } from "@/lib/mock/orders";
import { orderStatusTone } from "@/lib/orderStatus";
import type { Order } from "@/types/order";

export default function OrdersPage() {
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <AccountShell>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Orders" }]} />
      <PageHeader
        eyebrow="YOUR ACCOUNT"
        title="Order history"
        description="Track current deliveries and revisit everything you've ordered."
      />

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
                <strong className="block text-[14px] font-[650]">{order.id}</strong>
                <small className="mt-1 block text-[11px] text-hm-muted">
                  {formatDate(order.date)} · {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </small>
              </span>
              <span className="max-[760px]:col-start-1 max-[760px]:row-start-2">
                <StatusBadge tone={orderStatusTone(order.status)}>{order.status}</StatusBadge>
              </span>
              <span className="text-[14px] font-[650] max-[760px]:col-start-2 max-[760px]:row-start-1 max-[760px]:text-right">
                {formatNaira(orderTotal(order))}
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

      <AnimatePresence>
        {selected && (
          <Drawer eyebrow="ORDER DETAILS" title={`Order ${selected.id}`} onClose={() => setSelected(null)}>
            <OrderDetails order={selected} />
          </Drawer>
        )}
      </AnimatePresence>
    </AccountShell>
  );
}
