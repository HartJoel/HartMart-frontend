import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import OrdersTable from "@/features/vendor-dashboard/components/OrdersTable";

export default function OrdersPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/vendor/dashboard" }, { label: "Orders" }]} />
      <PageHeader
        eyebrow="FULFILMENT"
        title="Orders"
        description="Manage every order containing your products."
      />
      <OrdersTable />
    </>
  );
}
