import { Link } from "react-router";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatusBadge from "@/components/StatusBadge";
import { orderStatusTone } from "@/lib/orderStatus";

const orders = [
  { id: "HM-2048", date: "18 June 2025", status: "Delivered", total: "₦61,800" },
  { id: "HM-1982", date: "09 June 2025", status: "Shipped", total: "₦32,500" },
  { id: "HM-1947", date: "02 June 2025", status: "Processing", total: "₦37,000" },
  { id: "HM-1904", date: "26 May 2025", status: "Pending", total: "₦16,800" },
];

export default function OrdersPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Orders" }]} />
      <PageHeader
        variant="storefront"
        eyebrow="YOUR ACCOUNT"
        title="Order history"
        description="Track current deliveries and revisit everything you’ve ordered."
      />
      <div>
        {orders.map((order) => (
          <article
            key={order.id}
            className="grid min-h-[90px] grid-cols-[1.2fr_1fr_1fr_0.7fr_60px] items-center border-t border-hm-border p-[18px] max-[600px]:grid-cols-[1fr_auto] max-[600px]:gap-2.5"
          >
            <strong>{order.id}</strong>
            <span>{order.date}</span>
            <StatusBadge tone={orderStatusTone(order.status)}>{order.status}</StatusBadge>
            <span>{order.total}</span>
            <Link className="text-[11px] text-hm-accent no-underline" to={`/orders/${order.id}`}>
              View →
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
