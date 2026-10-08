import { useState, type ChangeEvent, type FormEvent } from "react";
import Button from "@/components/Button";
import Field from "@/components/Field";
import TextField from "@/components/TextField";
import type { Category } from "@/types/category";
import type { VendorProductInput } from "@/types/product";

type NumericField = "basePrice" | "discountPrice" | "totalStock" | "reorderLevel";
type TextFieldName = "name" | "description" | "categorySlug";
type ProductField = TextFieldName | NumericField;

type FormValues = {
  name: string;
  description: string;
  categorySlug: string;
  basePrice: string;
  discountPrice: string;
  totalStock: string;
  reorderLevel: string;
};

type ProductFormProps = {
  initial?: VendorProductInput;
  categories: Category[];
  /** Existing image URLs, shown read-only — the edit endpoint doesn't accept a new upload. */
  existingImages?: string[];
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: VendorProductInput, image?: File) => void;
  onCancel: () => void;
};

const emptyValues: FormValues = {
  name: "",
  description: "",
  categorySlug: "",
  basePrice: "",
  discountPrice: "",
  totalStock: "",
  reorderLevel: "",
};

function toFormValues(input?: VendorProductInput): FormValues {
  if (!input) return emptyValues;
  return {
    name: input.name,
    description: input.description,
    categorySlug: input.categorySlug,
    basePrice: String(input.basePrice),
    discountPrice: input.discountPrice !== undefined ? String(input.discountPrice) : "",
    totalStock: String(input.totalStock),
    reorderLevel: String(input.reorderLevel),
  };
}

function validate(values: FormValues): Partial<Record<ProductField, string>> {
  const errors: Partial<Record<ProductField, string>> = {};

  if (values.name.trim().length < 2) errors.name = "Enter the product name.";
  if (values.description.trim().length < 10) errors.description = "Describe the product in a bit more detail.";
  if (!values.categorySlug) errors.categorySlug = "Choose a category.";

  const basePrice = Number(values.basePrice);
  if (!values.basePrice.trim() || Number.isNaN(basePrice) || basePrice <= 0) {
    errors.basePrice = "Enter a price above ₦0.";
  }

  if (values.discountPrice.trim()) {
    const discountPrice = Number(values.discountPrice);
    if (Number.isNaN(discountPrice) || discountPrice <= 0) {
      errors.discountPrice = "Enter a valid discount price.";
    } else if (!Number.isNaN(basePrice) && discountPrice >= basePrice) {
      errors.discountPrice = "Discount price must be below the base price.";
    }
  }

  const totalStock = Number(values.totalStock);
  if (!values.totalStock.trim() || Number.isNaN(totalStock) || totalStock < 0 || !Number.isInteger(totalStock)) {
    errors.totalStock = "Enter a whole number of units.";
  }

  const reorderLevel = Number(values.reorderLevel);
  if (!values.reorderLevel.trim() || Number.isNaN(reorderLevel) || reorderLevel < 0 || !Number.isInteger(reorderLevel)) {
    errors.reorderLevel = "Enter a whole number.";
  }

  return errors;
}

/** Add or edit a product. Shared by the create and edit routes. */
export default function ProductForm({
  initial,
  categories,
  existingImages,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(toFormValues(initial));
  const [touched, setTouched] = useState<Partial<Record<ProductField, boolean>>>({});
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  function pickImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setImage(file);
    setImagePreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : undefined;
    });
  }

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;
  const isEditing = existingImages !== undefined;

  function setField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function touch(field: ProductField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function errorFor(field: ProductField) {
    return touched[field] ? errors[field] : undefined;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({
      name: true,
      description: true,
      categorySlug: true,
      basePrice: true,
      discountPrice: true,
      totalStock: true,
      reorderLevel: true,
    });
    if (!isValid) return;

    onSubmit(
      {
        name: values.name.trim(),
        description: values.description.trim(),
        categorySlug: values.categorySlug,
        basePrice: Number(values.basePrice),
        discountPrice: values.discountPrice.trim() ? Number(values.discountPrice) : undefined,
        totalStock: Number(values.totalStock),
        reorderLevel: Number(values.reorderLevel),
      },
      image,
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-10 max-[900px]:grid-cols-1">
        {isEditing ? (
          <div className="flex min-h-[390px] flex-col items-center justify-center gap-3 rounded-hm-md border border-hm-border bg-hm-surface p-6">
            {existingImages && existingImages.length > 0 ? (
              <img src={existingImages[0]} alt="" className="max-h-[300px] rounded-hm-sm object-contain" />
            ) : (
              <span className="text-[11px] text-hm-muted">No image uploaded yet.</span>
            )}
            <span className="text-[10px] text-hm-muted">Image updates aren&apos;t supported from this form yet.</span>
          </div>
        ) : (
          <label className="flex min-h-[390px] cursor-pointer flex-col items-center justify-center rounded-hm-md border border-dashed border-hm-border bg-hm-surface text-hm-muted">
            {imagePreview ? (
              <img src={imagePreview} alt="" className="max-h-[300px] rounded-hm-sm object-contain" />
            ) : (
              <>
                <span aria-hidden="true">⇧</span>
                <b className="mt-[15px] text-hm-text">Drop an image here</b>
                <span className="mt-[7px] text-[9px]">or click to browse</span>
              </>
            )}
            <input accept="image/*" type="file" className="hidden" onChange={pickImage} />
          </label>
        )}

        <section className="flex flex-col gap-[18px] rounded-hm-md bg-hm-surface p-[30px]">
          <TextField
            label="Product name"
            placeholder="Wireless Earbuds Pro"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            onBlur={() => touch("name")}
            error={errorFor("name")}
          />
          <Field label="Description" className="gap-2 text-[13px] font-[600]">
            <textarea
              className="min-h-[110px] w-full rounded-[11px] border-0 bg-hm-field p-3 text-[13px] text-hm-text"
              placeholder="Describe the product"
              value={values.description}
              onChange={(event) => setField("description", event.target.value)}
              onBlur={() => touch("description")}
            />
          </Field>
          {errorFor("description") && <p className="m-0 text-[11px] text-hm-error">{errorFor("description")}</p>}

          <Field label="Category" className="gap-2 text-[13px] font-[600]">
            <select
              className="min-h-12 w-full rounded-[11px] border-0 bg-hm-field p-3 text-[13px] text-hm-text"
              value={values.categorySlug}
              onChange={(event) => setField("categorySlug", event.target.value)}
              onBlur={() => touch("categorySlug")}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          {errorFor("categorySlug") && <p className="m-0 text-[11px] text-hm-error">{errorFor("categorySlug")}</p>}

          <div className="grid grid-cols-2 gap-[18px]">
            <TextField
              label="Base price"
              type="number"
              min={0}
              value={values.basePrice}
              onChange={(event) => setField("basePrice", event.target.value)}
              onBlur={() => touch("basePrice")}
              error={errorFor("basePrice")}
            />
            <TextField
              label="Discount price"
              type="number"
              min={0}
              value={values.discountPrice}
              onChange={(event) => setField("discountPrice", event.target.value)}
              onBlur={() => touch("discountPrice")}
              error={errorFor("discountPrice")}
            />
            <TextField
              label="Stock"
              type="number"
              min={0}
              step={1}
              value={values.totalStock}
              onChange={(event) => setField("totalStock", event.target.value)}
              onBlur={() => touch("totalStock")}
              error={errorFor("totalStock")}
            />
            <TextField
              label="Reorder level"
              type="number"
              min={0}
              step={1}
              value={values.reorderLevel}
              onChange={(event) => setField("reorderLevel", event.target.value)}
              onBlur={() => touch("reorderLevel")}
              error={errorFor("reorderLevel")}
            />
          </div>
          <footer className="flex justify-end gap-2.5">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving…" : submitLabel}
            </Button>
          </footer>
        </section>
      </div>
    </form>
  );
}
