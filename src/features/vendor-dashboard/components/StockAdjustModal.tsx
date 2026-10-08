import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import TextField from "@/components/TextField";
import { useUpdateStock } from "@/features/vendor-dashboard/api";
import type { VendorProduct } from "@/types/product";

type StockAdjustModalProps = {
  product: VendorProduct;
  onClose: () => void;
};

/** Lightweight form bound to the dedicated stock endpoint, kept separate from the full product edit. */
export default function StockAdjustModal({ product, onClose }: StockAdjustModalProps) {
  const [totalStock, setTotalStock] = useState(String(product.totalStock));
  const [reservedStock, setReservedStock] = useState(String(product.reservedStock));
  const updateStock = useUpdateStock();

  const total = Number(totalStock);
  const reserved = Number(reservedStock);
  const isValid =
    totalStock.trim() !== "" &&
    reservedStock.trim() !== "" &&
    Number.isInteger(total) &&
    Number.isInteger(reserved) &&
    total >= 0 &&
    reserved >= 0 &&
    reserved <= total;

  function submit() {
    if (!isValid) return;
    updateStock.mutate(
      { id: product.id, payload: { totalStock: total, reservedStock: reserved } },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal title="Adjust stock" eyebrow={product.name} onClose={onClose} className="max-w-[440px]">
      <div className="grid gap-5">
        <TextField
          label="Total stock"
          type="number"
          min={0}
          step={1}
          value={totalStock}
          onChange={(event) => setTotalStock(event.target.value)}
        />
        <TextField
          label="Reserved stock"
          hint="Units already held against unfulfilled orders."
          type="number"
          min={0}
          step={1}
          value={reservedStock}
          onChange={(event) => setReservedStock(event.target.value)}
          error={reserved > total ? "Reserved stock can't exceed total stock." : undefined}
        />
      </div>

      <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
        <Button variant="quiet" size="sm" onClick={onClose} className="max-[480px]:w-full">
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={!isValid || updateStock.isPending}
          onClick={submit}
          className="max-[480px]:w-full"
        >
          {updateStock.isPending ? "Saving…" : "Save stock"}
        </Button>
      </div>
    </Modal>
  );
}
