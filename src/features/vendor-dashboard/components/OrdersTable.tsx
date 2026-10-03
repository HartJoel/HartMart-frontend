import DataTable, { tableCell, tableHeadCell } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { orderStatusTone } from "@/lib/orderStatus";
import { vendorOrders } from "@/features/vendor-dashboard/mock";

export default function OrdersTable() {
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
        {vendorOrders.map((order) => (
          <tr key={order.id}>
            <td className={tableCell}>
              <strong className="text-hm-text">{order.id}</strong>
            </td>
            <td className={tableCell}>{order.customer}</td>
            <td className={tableCell}>
              <StatusBadge tone={orderStatusTone(order.status)}>{order.status}</StatusBadge>
            </td>
            <td className={tableCell}>
              <strong className="text-hm-text">{order.total}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
