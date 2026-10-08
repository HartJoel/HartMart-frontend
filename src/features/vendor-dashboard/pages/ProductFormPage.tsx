import { useNavigate, useParams } from "react-router";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import ProductForm from "@/features/vendor-dashboard/components/ProductForm";
import { useCategories, useCreateProduct, useProduct, useUpdateProduct } from "@/features/vendor-dashboard/api";
import type { VendorProductInput } from "@/types/product";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  const { data: categories, isPending: categoriesPending, isError: categoriesError, refetch: refetchCategories } =
    useCategories();
  const { data: product, isPending: productPending, isError: productError, refetch: refetchProduct } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const backToProducts = () => navigate("/vendor/products");
  const isSaving = createProduct.isPending || updateProduct.isPending;

  function save(values: VendorProductInput, image?: File) {
    const mutation = isEditing
      ? updateProduct.mutateAsync({ id, payload: values })
      : createProduct.mutateAsync({ ...values, image });
    mutation.then(backToProducts).catch(() => {});
  }

  const isLoading = categoriesPending || (isEditing && productPending);
  const isError = categoriesError || (isEditing && productError);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Dashboard", to: "/vendor/dashboard" },
          { label: "Products", to: "/vendor/products" },
          { label: isEditing ? "Edit product" : "New product" },
        ]}
      />
      <PageHeader
        eyebrow={isEditing ? "EDIT PRODUCT" : "NEW PRODUCT"}
        title={isEditing ? "Edit product" : "Add a product"}
        description="Give customers clear details, accurate pricing and useful imagery."
      />

      {isLoading ? (
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-10 max-[900px]:grid-cols-1">
          <div className="min-h-[390px] animate-pulse rounded-hm-md bg-hm-field" />
          <div className="min-h-[390px] animate-pulse rounded-hm-md bg-hm-field" />
        </div>
      ) : isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load this form. Please try again.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refetchCategories();
              if (isEditing) refetchProduct();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <ProductForm
          categories={categories ?? []}
          existingImages={isEditing ? product?.images.map((image) => image.url) : undefined}
          initial={
            product
              ? {
                  name: product.name,
                  description: product.description,
                  categorySlug: categories?.find((category) => category.id === product.categoryId)?.slug ?? "",
                  basePrice: Number(product.basePrice),
                  discountPrice: product.discountPrice ? Number(product.discountPrice) : undefined,
                  totalStock: product.totalStock,
                  reorderLevel: product.reorderLevel,
                }
              : undefined
          }
          submitLabel={isEditing ? "Save changes" : "Add Product"}
          isSubmitting={isSaving}
          onSubmit={save}
          onCancel={backToProducts}
        />
      )}
    </>
  );
}
