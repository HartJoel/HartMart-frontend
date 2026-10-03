import PageHeader from "@/components/PageHeader";
import OrdersTable from "@/features/vendor-dashboard/components/OrdersTable";

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        eyebrow="FULFILMENT"
        title="Orders"
        description="Manage every order containing your products."
      />
      <OrdersTable />
    </>
  );
}
