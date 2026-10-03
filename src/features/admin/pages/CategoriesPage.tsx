import { useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { cn } from "@/lib/cn";
import Icon from "@/components/Icon";
import { initialCategories, type Category } from "@/features/admin/mock";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function startAdding() {
    setAdding(true);
    setDraft("");
  }

  function saveNewCategory() {
    if (draft.trim()) {
      setCategories((current) => [...current, { id: Date.now(), name: draft, depth: 0, products: 0 }]);
    }
    setAdding(false);
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setDraft(category.name);
  }

  function saveEdit(id: number) {
    setCategories((current) => current.map((item) => (item.id === id ? { ...item, name: draft } : item)));
    setEditingId(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="CATALOG STRUCTURE"
        title="Categories"
        description="Organise how customers discover products across the marketplace."
        action={
          <Button size="sm" onClick={startAdding}>
            <Icon name="plus" size={14} /> Add Category
          </Button>
        }
      />

      <section className="overflow-hidden rounded-hm-md bg-hm-surface">
        <div className="grid grid-cols-[minmax(220px,1fr)_120px_70px] items-center px-6 py-4 text-[8px] font-[700] tracking-[0.07em] uppercase text-hm-muted max-[480px]:grid-cols-[minmax(150px,1fr)_68px_50px]">
          <div>Category</div>
          <div>Products</div>
          <div />
        </div>

        {adding && (
          <TreeRow depth={0} add>
            <input
              autoFocus
              aria-label="New category name"
              placeholder="Category name"
              value={draft}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value)}
              className={inputClass}
            />
            <div>0</div>
            <div>
              <Button variant="ghost" size="sm" onClick={saveNewCategory}>
                Save
              </Button>
            </div>
          </TreeRow>
        )}

        {categories.map((category) => {
          const isEditing = editingId === category.id;
          return (
            <TreeRow key={category.id} depth={category.depth}>
              {isEditing ? (
                <input
                  autoFocus
                  aria-label={`Rename ${category.name}`}
                  value={draft}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value)}
                  onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === "Enter") saveEdit(category.id);
                  }}
                  className={inputClass}
                />
              ) : (
                <div className={cn(category.depth === 0 && "font-bold text-hm-text")}>{category.name}</div>
              )}
              <div>{category.products.toLocaleString("en-NG")}</div>
              <div className="flex justify-end">
                {isEditing ? (
                  <Button variant="ghost" size="sm" onClick={() => saveEdit(category.id)}>
                    Save
                  </Button>
                ) : (
                  <button
                    type="button"
                    aria-label={`Edit ${category.name}`}
                    onClick={() => startEditing(category)}
                    className="grid size-[34px] place-items-center rounded-full border-0 bg-transparent text-hm-muted hover:bg-hm-field"
                  >
                    <Icon name="edit" size={14} />
                  </button>
                )}
              </div>
            </TreeRow>
          );
        })}
      </section>
    </>
  );
}

const inputClass =
  "h-9 w-[min(100%,360px)] rounded-[8px] border border-hm-accent bg-white px-3 text-[10px] outline-0";

type TreeRowProps = {
  depth?: 0 | 1;
  add?: boolean;
  children: ReactNode;
};

/** One category line. Child categories are indented with a connector tick. */
function TreeRow({ depth = 0, add = false, children }: TreeRowProps) {
  return (
    <div
      className={cn(
        "relative grid min-h-[58px] grid-cols-[minmax(220px,1fr)_120px_70px] items-center border-t border-hm-border px-6 text-[10px] text-hm-muted max-[480px]:grid-cols-[minmax(150px,1fr)_68px_50px]",
        depth === 1 && "pl-[72px] max-[480px]:pl-12",
        add && "bg-[#f8f8ff] shadow-[inset_3px_0_var(--color-hm-accent)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-12 h-px w-3 bg-[#cfcfd5] max-[480px]:left-[30px]",
          depth === 0 && "hidden",
        )}
      />
      {children}
    </div>
  );
}
