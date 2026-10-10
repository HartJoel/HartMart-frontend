import { useMemo, useState, type ChangeEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button, { buttonClasses } from "@/components/Button";
import DataTable, { tableCell, tableHeadCell } from "@/components/DataTable";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import StockAdjustModal from "@/features/vendor-dashboard/components/StockAdjustModal";
import { useDeleteProduct, useVendorProducts } from "@/features/vendor-dashboard/api";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";
import { firstImageUrl } from "@/lib/images";
import type { VendorProduct } from "@/types/product";

const selectClass = "min-h-[46px] rounded-hm-sm border-0 bg-hm-surface px-3 text-[10px] outline-0";

const PAGE_SIZE = 10;

const statusOptions = [
  { label: "All statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
];

type Dialog = { mode: "stock"; product: VendorProduct } | { mode: "delete"; product: VendorProduct } | null;

function statusTone(status: string) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "DRAFT") return "neutral" as const;
  return "warning" as const;
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<Dialog>(null);

  const { data, isPending, isError, refetch } = useVendorProducts({ page, limit: PAGE_SIZE });
  const deleteProduct = useDeleteProduct();

  const close = () => setDialog(null);

  // The endpoint only paginates; search/status narrow within whatever page came back.
  const filtered = useMemo(() => {
    const rows = (data?.data ?? []).filter((product) => !product.deletedAt);
    const query = search.trim().toLowerCase();
    return rows.filter((product) => {
      const matchesStatus = !status || product.status === status;
      const matchesQuery = !query || `${product.name} ${product.sku}`.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [data, search, status]);

  const liveTotal = (data?.data ?? []).filter((product) => !product.deletedAt).length;

  function removeProduct(product: VendorProduct) {
    deleteProduct.mutate(product.id, { onSuccess: close });
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/vendor/dashboard" }, { label: "Products" }]} />
      <PageHeader
        eyebrow="INVENTORY"
        title="Products"
        description="Keep prices, stock and listings current."
        action={
          <Link className={buttonClasses({ size: "sm" })} to="/vendor/products/new">
            <Icon name="plus" size={14} />
            Add Product
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-[minmax(240px,1fr)_160px] gap-3 max-[560px]:grid-cols-1">
        <div className="flex h-[46px] items-center gap-3 rounded-hm-sm bg-hm-surface px-4">
          <Icon name="search" size={17} className="text-hm-muted" />
          <input
            aria-label="Search products"
            className="w-full border-0 bg-transparent text-[11px] outline-0"
            type="search"
            placeholder="Search by name or SKU"
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          />
        </div>
        <select
          aria-label="Filter by status"
          className={selectClass}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load your products. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : !isPending && filtered.length === 0 ? (
        <div className="grid place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-hm-field">
            <Icon name="plus" size={18} />
          </span>
          <p className="m-0 text-[13px] text-hm-muted">
            {liveTotal > 0 ? "No products match these filters." : "You haven't listed any products yet."}
          </p>
          {liveTotal === 0 && (
            <Link className={buttonClasses({ variant: "ghost", size: "sm" })} to="/vendor/products/new">
              Add your first product
            </Link>
          )}
        </div>
      ) : (
        <DataTable minWidth={760}>
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
            {isPending
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className={tableCell} colSpan={5}>
                      <div className="h-5 animate-pulse rounded-hm-sm bg-hm-field" />
                    </td>
                  </tr>
                ))
              : filtered.map((product) => {
                  const isLowStock = product.availableStock > 0 && product.availableStock <= product.reorderLevel;
                  const isOutOfStock = product.availableStock === 0;
                  const productImage = firstImageUrl(product.images);

                  return (
                    <tr key={product.id} className={cn(isLowStock && "bg-[#fffcf7] shadow-[inset_3px_0_#c18a25]")}>
                      <td className={tableCell}>
                        <div className="flex items-center gap-3">
                          {productImage ? (
                            <img className="size-11 rounded-[9px] object-cover" src={productImage} alt="" />
                          ) : (
                            <span className="grid size-11 place-items-center rounded-[9px] bg-hm-field text-hm-muted">
                              <Icon name="shop" size={16} />
                            </span>
                          )}
                          <strong className="text-hm-text">{product.name}</strong>
                        </div>
                      </td>
                      <td className={tableCell}>
                        {product.discountPrice ? (
                          <>
                            <span className="mr-2 text-hm-muted line-through">
                              {formatNaira(Number(product.basePrice))}
                            </span>
                            <span className="text-hm-accent">{formatNaira(Number(product.discountPrice))}</span>
                          </>
                        ) : (
                          formatNaira(Number(product.basePrice))
                        )}
                      </td>
                      <td className={tableCell}>
                        {product.availableStock} units
                        {isOutOfStock && (
                          <StatusBadge tone="danger" className="ml-2">
                            Out of stock
                          </StatusBadge>
                        )}
                        {isLowStock && (
                          <StatusBadge tone="warning" className="ml-2">
                            Low stock
                          </StatusBadge>
                        )}
                      </td>
                      <td className={tableCell}>
                        <StatusBadge tone={statusTone(product.status)} className="capitalize">
                          {product.status.toLowerCase()}
                        </StatusBadge>
                      </td>
                      <td className={tableCell}>
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/vendor/products/${product.id}/edit`}
                            className="mr-1 text-[9px] text-hm-accent no-underline"
                          >
                            Edit
                          </Link>
                          <IconButton label={`Adjust stock for ${product.name}`} onClick={() => setDialog({ mode: "stock", product })}>
                            <Icon name="reports" size={14} />
                          </IconButton>
                          <IconButton
                            tone="danger"
                            label={`Delete ${product.name}`}
                            onClick={() => setDialog({ mode: "delete", product })}
                          >
                            <Icon name="trash" size={14} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </DataTable>
      )}

      {data && data.pagination.pages > 1 && (
        <div className="mt-5 flex items-center justify-end gap-3">
          <span className="text-[9px] text-hm-muted">
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          <Button variant="quiet" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Button
            variant="quiet"
            size="sm"
            disabled={page >= data.pagination.pages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <AnimatePresence>
        {dialog?.mode === "stock" && <StockAdjustModal product={dialog.product} onClose={close} />}

        {dialog?.mode === "delete" && (
          <Modal title="Delete this product?" eyebrow="INVENTORY" onClose={close} className="max-w-[440px]">
            <p className="m-0 text-[13px] leading-[1.7] text-hm-muted">
              <span className="font-[650] text-hm-text">{dialog.product.name}</span> will be removed from your
              storefront. This can&apos;t be undone.
            </p>
            <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
              <Button variant="quiet" size="sm" onClick={close} className="max-[480px]:w-full">
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={deleteProduct.isPending}
                onClick={() => removeProduct(dialog.product)}
                className="text-hm-error hover:bg-hm-error-soft max-[480px]:w-full"
              >
                {deleteProduct.isPending ? "Deleting…" : "Delete product"}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
