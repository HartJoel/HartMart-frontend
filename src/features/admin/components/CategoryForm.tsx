import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import TextField from "@/components/TextField";
import type { Category } from "@/types/category";

const MAX_ICON_BYTES = 2 * 1024 * 1024;

export type CategoryValues = {
  name: string;
  description: string;
  parentId: string | null;
  icon: File | null;
};

type CategoryFormProps = {
  /** Editing keeps the category where it is; creating also chooses its parent. */
  mode: "create" | "edit";
  initial: CategoryValues & { iconUrl: string | null };
  /** Every category, used to offer parents and to block duplicate names under the same parent. */
  categories: Category[];
  /** The category being edited, so it does not clash with its own name. */
  editingId?: string;
  submitLabel: string;
  onSubmit: (values: CategoryValues) => void;
  onCancel: () => void;
};

/** Name, description, icon, and for new categories a parent. Submit stays disabled until the name is usable. */
export default function CategoryForm({
  mode,
  initial,
  categories,
  editingId,
  submitLabel,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryValues>({
    name: initial.name,
    description: initial.description,
    parentId: initial.parentId,
    icon: initial.icon,
  });
  const [iconPreview, setIconPreview] = useState(initial.iconUrl);
  const [iconError, setIconError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const parentSelectId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);

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

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setIconError("Choose an image file, such as JPG or PNG.");
      return;
    }
    if (file.size > MAX_ICON_BYTES) {
      setIconError("Choose an image 2 MB or smaller.");
      return;
    }
    setIconError(undefined);
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const previewUrl = URL.createObjectURL(file);
    objectUrl.current = previewUrl;
    setIconPreview(previewUrl);
    setValues((current) => ({ ...current, icon: file }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (nameError || iconError) return;

    onSubmit({ ...values, name });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-6">
      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Choose category icon"
          onClick={() => fileInput.current?.click()}
          className="group relative grid size-16 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-hm-sm border-0 bg-hm-field p-0 text-[18px] font-[700] text-hm-text"
        >
          {iconPreview ? (
            <img src={iconPreview} alt="" className="size-full object-cover" />
          ) : (
            <Icon name="categories" size={22} className="text-hm-muted" />
          )}
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center bg-[rgba(20,20,22,0.55)] text-[10px] font-[650] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Change
          </span>
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <div className="min-w-0">
          <p className="m-0 text-[12px] font-[600]">Category icon</p>
          <p className="m-0 mt-1 text-[11px] text-hm-muted">JPG or PNG, up to 2 MB.</p>
          {iconError && (
            <p role="alert" className="m-0 mt-1 text-[11px] text-hm-error">
              {iconError}
            </p>
          )}
        </div>
      </div>

      <TextField
        label="Category name"
        placeholder="e.g. Smart Home"
        value={values.name}
        onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
        onBlur={() => setTouched(true)}
        error={touched ? nameError : undefined}
        autoFocus
      />

      <TextField
        label="Description"
        placeholder="What shoppers will find in this category"
        value={values.description}
        onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
        hint="Optional."
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
                parentId: event.target.value || null,
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
        <Button
          type="submit"
          size="sm"
          disabled={Boolean(nameError) || Boolean(iconError)}
          className="max-[480px]:w-full"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
