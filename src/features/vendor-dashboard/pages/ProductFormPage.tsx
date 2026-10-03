import { useNavigate } from "react-router";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";

const priceFields = ["Base price", "Discount price", "Stock", "Reorder level"];

export default function ProductFormPage() {
  const navigate = useNavigate();
  const backToProducts = () => navigate("/vendor/products");

  return (
    <>
      <PageHeader
        eyebrow="NEW PRODUCT"
        title="Add a product"
        description="Give customers clear details, accurate pricing and useful imagery."
      />

      <div className="grid grid-cols-[0.8fr_1.2fr] gap-10 max-[900px]:grid-cols-1">
        <label className="flex min-h-[390px] flex-col items-center justify-center rounded-hm-md border border-dashed border-[#ccc] bg-hm-surface text-hm-muted">
          ⇧<b className="mt-[15px] text-hm-text">Drop an image here</b>
          <span className="mt-[7px] text-[9px]">or click to browse</span>
          <input accept="image/*" type="file" className="hidden" />
        </label>

        <section className="flex flex-col gap-[18px] rounded-hm-md bg-hm-surface p-[30px]">
          <Field label="Product name" className="gap-2 text-[9px] font-[650]">
            <Input className="min-h-12 rounded-[11px] p-3" placeholder="Wireless Earbuds Pro" />
          </Field>
          <Field label="Description" className="gap-2 text-[9px] font-[650]">
            <textarea
              className="min-h-[110px] w-full rounded-[11px] border-0 bg-hm-field p-3"
              placeholder="Describe the product"
            />
          </Field>
          <Field label="Category" className="gap-2 text-[9px] font-[650]">
            <select className="min-h-12 rounded-[11px] border-0 bg-hm-field p-3">
              <option>Electronics</option>
              <option>Phones &amp; Tablets</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-[18px]">
            {priceFields.map((label) => (
              <Field key={label} label={label} className="gap-2 text-[9px] font-[650]">
                <Input type="number" className="min-h-12 rounded-[11px] p-3" />
              </Field>
            ))}
          </div>
          <footer className="flex justify-end gap-2.5">
            <Button variant="ghost" size="sm" onClick={backToProducts}>
              Cancel
            </Button>
            <Button size="sm" onClick={backToProducts}>
              Add Product
            </Button>
          </footer>
        </section>
      </div>
    </>
  );
}
