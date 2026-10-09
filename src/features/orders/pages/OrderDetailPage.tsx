import { Link, useParams } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button, { buttonClasses } from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { useOrder } from "@/features/orders/api";
import { formatDate } from "@/lib/format";

/** Full-page order view, kept for direct links. The order list opens the same content in a drawer. */
export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isPending, isError, refetch } = useOrder(id);

  if (isPending) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Orders", to: "/orders" }, { label: "…" }]} />
        <div className="h-40 max-w-[720px] animate-pulse rounded-hm-md bg-hm-field" />
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Orders", to: "/orders" }, { label: "Not found" }]} />
        <p className="m-0 text-[13px] text-hm-muted">
          {isError ? "Couldn't load that order." : "We couldn't find that order."}
        </p>
        <div className="mt-4 flex gap-3">
          {isError && (
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          )}
          <Link className={buttonClasses({ variant: "ghost", size: "sm" })} to="/orders">
            Back to orders
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Orders", to: "/orders" }, { label: `Order ${order.orderNumber}` }]}
      />
      <PageHeader
        variant="storefront"
        eyebrow="ORDER DETAIL"
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${formatDate(order.createdAt)}`}
      />
      <div className="max-w-[720px]">
        <OrderDetails order={order} />
      </div>
    </>
  );
}
