import { useId, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import type { Category } from "@/features/admin/mock";

export type CategoryValues = {
  name: string;
  parentId: number | null;
};

type CategoryFormProps = {
  /** Renaming keeps the category where it is; creating also chooses its parent. */
  mode: "create" | "rename";
  initial: CategoryValues;
  /** Every category, used to offer parents and to block duplicate names under the same parent. */
  categories: Category[];
  /** The category being renamed, so it does not clash with its own name. */
  editingId?: number;
  submitLabel: string;
  onSubmit: (values: CategoryValues) => void;
  onCancel: () => void;
};

/** Name, and for new categories a parent. Submit stays disabled until the name is usable. */
export default function CategoryForm({
  mode,
  initial,
  categories,
  editingId,
  submitLabel,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryValues>(initial);
  const [touched, setTouched] = useState(false);
  const parentSelectId = useId();

  const name = values.name.trim();
  const parents = categories.filter((category) => category.parentId === null);
  const siblingNames = categories
    .filter((category) => category.parentId === values.parentId && category.id !== editingId)
    .map((category) => category.name.toLowerCase());

  const nameError = !name
    ? "Give the category a name."
    : name.length < 2
      ? "Use at least 2 characters."
      : siblingNames.includes(name.toLowerCase())
        ? "A category with this name already exists here."
        : undefined;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (nameError) return;

    onSubmit({ name, parentId: values.parentId });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-6">
      <TextField
        label="Category name"
        placeholder="e.g. Smart Home"
        value={values.name}
        onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
        onBlur={() => setTouched(true)}
        error={touched ? nameError : undefined}
        autoFocus
      />

      {mode === "create" && (
        <div className="flex flex-col gap-2">
          <label htmlFor={parentSelectId} className="text-[13px] font-[600]">
            Parent category
          </label>
          <select
            id={parentSelectId}
            value={values.parentId ?? ""}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                parentId: event.target.value ? Number(event.target.value) : null,
              }))
            }
            className="h-12 w-full rounded-hm-sm border-0 bg-hm-field px-4 text-[13px] text-hm-text"
          >
            <option value="">None, a top-level category</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
          </select>
          <p className="m-0 text-[11px] text-hm-muted">Subcategories sit under one top-level category.</p>
        </div>
      )}

      <div className="flex justify-end gap-3 max-[480px]:flex-col-reverse">
        <Button variant="quiet" size="sm" onClick={onCancel} className="max-[480px]:w-full">
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={Boolean(nameError)} className="max-[480px]:w-full">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
