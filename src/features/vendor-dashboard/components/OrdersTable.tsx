import Button from "@/components/Button";
import DataTable, { tableCell, tableHeadCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { useVendorOrders } from "@/features/orders/api";
import { formatNaira } from "@/lib/format";
import { orderStatusTone } from "@/lib/orderStatus";

export default function OrdersTable() {
  const { data: orders, isPending, isError, refetch } = useVendorOrders();

  if (isError) {
    return (
      <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
        <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load orders. Please try again.</p>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <DataTable minWidth={700}>
      <thead>
        <tr>
          <th className={tableHeadCell}>Order</th>
          <th className={tableHeadCell}>Customer</th>
          <th className={tableHeadCell}>Status</th>
          <th className={tableHeadCell}>Total</th>
        </tr>
      </thead>
      <tbody>
        {isPending
          ? Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className={tableCell} colSpan={4}>
                  <div className="h-5 animate-pulse rounded-hm-sm bg-hm-field" />
                </td>
              </tr>
            ))
          : orders && orders.length === 0
            ? (
                <tr>
                  <td className={tableCell} colSpan={4}>
                    No orders yet.
                  </td>
                </tr>
              )
            : orders?.map((order) => (
                <tr key={order.id}>
                  <td className={tableCell}>
                    <strong className="text-hm-text">{order.orderNumber}</strong>
                  </td>
                  <td className={tableCell}>{order.customer?.name ?? "—"}</td>
                  <td className={tableCell}>
                    <StatusBadge tone={orderStatusTone(order.status)} className="capitalize">
                      {order.status.toLowerCase()}
                    </StatusBadge>
                  </td>
                  <td className={tableCell}>
                    <strong className="text-hm-text">{formatNaira(Number(order.totalAmount))}</strong>
                  </td>
                </tr>
              ))}
      </tbody>
    </DataTable>
  );
}
