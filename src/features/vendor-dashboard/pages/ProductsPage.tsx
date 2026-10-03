import { Link } from "react-router";
import { buttonClasses } from "@/components/Button";
import DataTable, { tableCell, tableHeadCell } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cn } from "@/lib/cn";
import { vendorProducts } from "@/features/vendor-dashboard/mock";

const lowStockThreshold = 6;

export default function ProductsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/vendor/dashboard" }, { label: "Products" }]} />
      <PageHeader
        eyebrow="INVENTORY"
        title="Products"
        description="Keep prices, stock and listings current."
        action={
          <Link className={buttonClasses({ size: "sm" })} to="/vendor/products/new">
            + Add Product
          </Link>
        }
      />

      <DataTable minWidth={700}>
        <thead>
          <tr>
            <th className={tableHeadCell}>Product</th>
            <th className={tableHeadCell}>Price</th>
            <th className={tableHeadCell}>Stock</th>
            <th className={tableHeadCell}>Status</th>
            <th className={tableHeadCell} />
          </tr>
        </thead>
        <tbody>
          {vendorProducts.map((product) => {
            const isLowStock = product.stock > 0 && product.stock < lowStockThreshold;
            return (
              <tr key={product.id} className={cn(isLowStock && "bg-[#fffcf7] shadow-[inset_3px_0_#c18a25]")}>
                <td className={tableCell}>
                  <div className="flex items-center gap-3">
                    <img className="size-11 rounded-[9px] object-cover" src={product.image} alt="" />
                    <strong className="text-hm-text">{product.name}</strong>
                  </div>
                </td>
                <td className={tableCell}>{product.price}</td>
                <td className={tableCell}>{product.stock} units</td>
                <td className={tableCell}>
                  <span className="rounded-[12px] bg-hm-field px-2 py-[5px]">{product.status}</span>
                </td>
                <td className={tableCell}>
                  <Link to={`/vendor/products/${product.id}/edit`} className="text-[9px] text-hm-accent no-underline">
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </>
  );
}
