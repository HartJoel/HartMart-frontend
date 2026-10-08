import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import CategoryForm, { type CategoryValues } from "@/features/admin/components/CategoryForm";
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/features/admin/api";
import type { Category } from "@/types/category";

type Dialog =
  | { mode: "create"; parentId: string | null }
  | { mode: "edit"; category: Category }
  | { mode: "delete"; category: Category }
  | null;

export default function CategoriesPage() {
  const { data: categories, isPending, isError, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [dialog, setDialog] = useState<Dialog>(null);

  const close = () => setDialog(null);
  const roots = (categories ?? []).filter((category) => category.parentId === null);
  const subcategoriesOf = (parentId: string) =>
    (categories ?? []).filter((category) => category.parentId === parentId);
  const subcategoryTotal = (categories?.length ?? 0) - roots.length;

  function submitCreate({ name, description, parentId, icon }: CategoryValues) {
    createCategory.mutate(
      { name, description: description.trim() || undefined, parentId, icon: icon ?? undefined },
      { onSuccess: close },
    );
  }

  function submitEdit(id: string, { name, description, icon }: CategoryValues) {
    updateCategory.mutate(
      { id, name, description: description.trim() || undefined, icon: icon ?? undefined },
      { onSuccess: close },
    );
  }

  function confirmDelete(category: Category) {
    deleteCategory.mutate(category.id, { onSuccess: close });
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

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load categories. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div className="grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[260px] animate-pulse rounded-hm-md bg-hm-surface" />
          ))}
        </div>
      ) : roots.length === 0 ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">No categories yet.</p>
          <Button size="sm" onClick={() => setDialog({ mode: "create", parentId: null })}>
            Add the first category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
          {roots.map((category) => {
            const subcategories = subcategoriesOf(category.id);

            return (
              <article key={category.id} className="flex min-h-[260px] flex-col rounded-hm-md bg-hm-surface p-6">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-hm-field text-[14px] font-bold"
                  >
                    {category.icon ? (
                      <img src={category.icon} alt="" className="size-full object-cover" />
                    ) : (
                      category.name.charAt(0)
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="m-0 truncate text-[17px] font-[650] tracking-[-0.02em]">{category.name}</h2>
                    <p className="m-0 mt-1 text-[11px] text-hm-muted">
                      {subcategories.length} {subcategories.length === 1 ? "subcategory" : "subcategories"}
                    </p>
                  </div>
                  <EditButton name={category.name} onClick={() => setDialog({ mode: "edit", category })} />
                  <DeleteButton name={category.name} onClick={() => setDialog({ mode: "delete", category })} />
                </div>

                <ul className="m-0 mt-6 flex-1 list-none p-0">
                  {subcategories.length === 0 ? (
                    <li className="border-t border-hm-border py-4 text-[12px] text-hm-muted">No subcategories yet.</li>
                  ) : (
                    subcategories.map((sub) => (
                      <li key={sub.id} className="flex items-center gap-3 border-t border-hm-border py-3">
                        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-hm-border" />
                        <span className="min-w-0 flex-1 truncate text-[13px]">{sub.name}</span>
                        <EditButton name={sub.name} onClick={() => setDialog({ mode: "edit", category: sub })} />
                        <DeleteButton name={sub.name} onClick={() => setDialog({ mode: "delete", category: sub })} />
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
      )}

      <AnimatePresence>
        {dialog?.mode === "create" && (
          <Modal
            key="create"
            title={dialog.parentId === null ? "New category" : "New subcategory"}
            eyebrow="CATALOG STRUCTURE"
            onClose={close}
          >
            <CategoryForm
              mode="create"
              initial={{ name: "", description: "", parentId: dialog.parentId, icon: null, iconUrl: null }}
              categories={categories ?? []}
              submitLabel={createCategory.isPending ? "Adding…" : dialog.parentId === null ? "Add category" : "Add subcategory"}
              onSubmit={submitCreate}
              onCancel={close}
            />
          </Modal>
        )}

        {dialog?.mode === "edit" && (
          <Modal key="edit" title="Edit category" eyebrow="CATALOG STRUCTURE" onClose={close}>
            <CategoryForm
              mode="edit"
              initial={{
                name: dialog.category.name,
                description: dialog.category.description ?? "",
                parentId: dialog.category.parentId,
                icon: null,
                iconUrl: dialog.category.icon,
              }}
              categories={categories ?? []}
              editingId={dialog.category.id}
              submitLabel={updateCategory.isPending ? "Saving…" : "Save changes"}
              onSubmit={(values) => submitEdit(dialog.category.id, values)}
              onCancel={close}
            />
          </Modal>
        )}

        {dialog?.mode === "delete" && (
          <Modal key="delete" title="Delete this category?" eyebrow="CATALOG STRUCTURE" onClose={close} className="max-w-[440px]">
            <p className="m-0 text-[13px] leading-[1.7] text-hm-muted">
              <span className="font-[650] text-hm-text">{dialog.category.name}</span> will be removed. This
              can&apos;t be undone.
            </p>
            <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
              <Button variant="quiet" size="sm" onClick={close} className="max-[480px]:w-full">
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={deleteCategory.isPending}
                onClick={() => confirmDelete(dialog.category)}
                className="text-hm-error hover:bg-hm-error-soft max-[480px]:w-full"
              >
                {deleteCategory.isPending ? "Deleting…" : "Delete category"}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function EditButton({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <IconButton label={`Edit ${name}`} title={`Edit ${name}`} onClick={onClick}>
      <Icon name="edit" size={14} />
    </IconButton>
  );
}

function DeleteButton({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <IconButton label={`Delete ${name}`} title={`Delete ${name}`} tone="danger" onClick={onClick}>
      <Icon name="trash" size={14} />
    </IconButton>
  );
}
