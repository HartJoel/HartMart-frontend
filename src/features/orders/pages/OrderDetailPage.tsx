import { Link, useParams } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buttonClasses } from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { formatDate } from "@/lib/format";
import { findOrder } from "@/lib/mock/orders";

/** Full-page order view, kept for direct links. The order list opens the same content in a drawer. */
export default function OrderDetailPage() {
  const { id } = useParams();
  const order = findOrder(id);

  if (!order) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Orders", to: "/orders" }, { label: "Not found" }]} />
        <p className="m-0 text-[13px] text-hm-muted">We couldn't find that order.</p>
        <Link className={buttonClasses({ variant: "ghost", size: "sm", className: "mt-4" })} to="/orders">
          Back to orders
        </Link>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Orders", to: "/orders" }, { label: `Order ${order.id}` }]}
      />
      <PageHeader
        variant="storefront"
        eyebrow="ORDER DETAIL"
        title={`Order ${order.id}`}
        description={`Placed on ${formatDate(order.date)}`}
      />
      <div className="max-w-[720px]">
        <OrderDetails order={order} />
      </div>
    </>
  );
}
