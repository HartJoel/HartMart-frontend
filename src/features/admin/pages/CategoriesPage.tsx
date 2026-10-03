import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import CategoryForm, { type CategoryValues } from "@/features/admin/components/CategoryForm";
import { initialCategories, type Category } from "@/features/admin/mock";

type Dialog =
  | { mode: "create"; parentId: number | null }
  | { mode: "rename"; category: Category }
  | null;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dialog, setDialog] = useState<Dialog>(null);

  const close = () => setDialog(null);
  const roots = categories.filter((category) => category.parentId === null);
  const subcategoriesOf = (parentId: number) => categories.filter((category) => category.parentId === parentId);
  const subcategoryTotal = categories.length - roots.length;
  const productTotal = roots.reduce((sum, category) => sum + category.products, 0);

  function createCategory({ name, parentId }: CategoryValues) {
    setCategories((current) => [
      ...current,
      { id: Math.max(0, ...current.map((category) => category.id)) + 1, name, parentId, products: 0 },
    ]);
    close();
  }

  function renameCategory(id: number, name: string) {
    setCategories((current) => current.map((category) => (category.id === id ? { ...category, name } : category)));
    close();
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/admin" }, { label: "Categories" }]} />
      <PageHeader
        eyebrow="CATALOG STRUCTURE"
        title="Categories"
        description="Top-level categories group what shoppers browse. Subcategories narrow it down."
        action={
          <Button size="sm" onClick={() => setDialog({ mode: "create", parentId: null })}>
            <Icon name="plus" size={14} />
            Add category
          </Button>
        }
      />

      <dl className="m-0 mb-8 grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
        <Stat label="Categories" value={roots.length} />
        <Stat label="Subcategories" value={subcategoryTotal} />
        <Stat label="Products listed" value={productTotal} />
      </dl>

      <div className="grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
        {roots.map((category) => {
          const subcategories = subcategoriesOf(category.id);

          return (
            <article key={category.id} className="flex min-h-[260px] flex-col rounded-hm-md bg-hm-surface p-6">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-hm-field text-[14px] font-bold"
                >
                  {category.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="m-0 truncate text-[17px] font-[650] tracking-[-0.02em]">{category.name}</h2>
                  <p className="m-0 mt-1 text-[11px] text-hm-muted">
                    {subcategories.length} {subcategories.length === 1 ? "subcategory" : "subcategories"} ·{" "}
                    {category.products.toLocaleString("en-NG")} products
                  </p>
                </div>
                <RenameButton name={category.name} onClick={() => setDialog({ mode: "rename", category })} />
              </div>

              <ul className="m-0 mt-6 flex-1 list-none p-0">
                {subcategories.length === 0 ? (
                  <li className="border-t border-hm-border py-4 text-[12px] text-hm-muted">No subcategories yet.</li>
                ) : (
                  subcategories.map((sub) => (
                    <li key={sub.id} className="flex items-center gap-3 border-t border-hm-border py-3">
                      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-hm-border" />
                      <span className="min-w-0 flex-1 truncate text-[13px]">{sub.name}</span>
                      <span className="text-[11px] text-hm-muted">{sub.products.toLocaleString("en-NG")}</span>
                      <RenameButton name={sub.name} onClick={() => setDialog({ mode: "rename", category: sub })} />
                    </li>
                  ))
                )}
              </ul>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialog({ mode: "create", parentId: category.id })}
                className="mt-4 self-start"
              >
                <Icon name="plus" size={13} />
                Add subcategory
              </Button>
            </article>
          );
        })}

        <button
          type="button"
          onClick={() => setDialog({ mode: "create", parentId: null })}
          className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-3 rounded-hm-md border border-dashed border-hm-border bg-transparent text-[13px] font-[600] text-hm-muted transition-colors duration-200 hover:border-hm-text hover:text-hm-text"
        >
          <span className="grid size-11 place-items-center rounded-full bg-hm-field">
            <Icon name="plus" size={16} />
          </span>
          New top-level category
        </button>
      </div>

      {dialog?.mode === "create" && (
        <Modal
          title={dialog.parentId === null ? "New category" : "New subcategory"}
          eyebrow="CATALOG STRUCTURE"
          onClose={close}
        >
          <CategoryForm
            mode="create"
            initial={{ name: "", parentId: dialog.parentId }}
            categories={categories}
            submitLabel={dialog.parentId === null ? "Add category" : "Add subcategory"}
            onSubmit={createCategory}
            onCancel={close}
          />
        </Modal>
      )}

      {dialog?.mode === "rename" && (
        <Modal title="Rename category" eyebrow="CATALOG STRUCTURE" onClose={close}>
          <CategoryForm
            mode="rename"
            initial={{ name: dialog.category.name, parentId: dialog.category.parentId }}
            categories={categories}
            editingId={dialog.category.id}
            submitLabel="Save name"
            onSubmit={({ name }) => renameCategory(dialog.category.id, name)}
            onCancel={close}
          />
        </Modal>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-hm-md bg-hm-surface p-6">
      <dt className="text-[10px] font-[650] text-hm-muted">{label}</dt>
      <dd className="m-0 mt-3 text-[30px] font-[650] tracking-[-0.04em]">{value.toLocaleString("en-NG")}</dd>
    </div>
  );
}

function RenameButton({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={`Rename ${name}`}
      title={`Rename ${name}`}
      onClick={onClick}
      className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-hm-muted transition-colors duration-200 hover:bg-hm-field hover:text-hm-text"
    >
      <Icon name="edit" size={14} />
    </button>
  );
}
