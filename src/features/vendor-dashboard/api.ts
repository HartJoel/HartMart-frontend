import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type PaginationMeta } from "@/lib/api/client";
import type { Category } from "@/types/category";
import type { ProductStockInput, VendorProduct, VendorProductInput } from "@/types/product";

const PRODUCTS_PREFIX = "/api/v1/products";
const CATEGORY_PREFIX = "/api/v1/category";
const VENDOR_PRODUCTS_KEY = ["vendor", "products"] as const;

function productKey(id: string) {
  return ["products", id] as const;
}

export type VendorProductsParams = { page?: number; limit?: number };

/**
 * The logged-in vendor's own catalog. Paginated, but unlike every other list endpoint the
 * pagination block sits nested inside `data` (`{ data: { data: [...], pagination } }`) rather
 * than as a sibling of it — confirmed from a live response, not the API doc.
 */
export function useVendorProducts(params: VendorProductsParams = {}) {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const search = query.toString();

  return useQuery({
    queryKey: [...VENDOR_PRODUCTS_KEY, params],
    queryFn: () =>
      apiRequest<{ data: VendorProduct[]; pagination: PaginationMeta }>(
        `${PRODUCTS_PREFIX}/vendor/me${search ? `?${search}` : ""}`,
      ),
  });
}

/** A single product, used to prefill the edit form on direct navigation. */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKey(id ?? ""),
    queryFn: () => apiRequest<VendorProduct>(`${PRODUCTS_PREFIX}/${id}`),
    enabled: id !== undefined,
  });
}

/** Flat category list for the product form's category select. */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiRequest<Category[]>(CATEGORY_PREFIX),
  });
}

/** Create a product. Multipart: the API expects form-data so it can accept an image file. */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ image, ...input }: VendorProductInput & { image?: File }) => {
      const form = new FormData();
      form.set("name", input.name);
      form.set("description", input.description);
      form.set("categorySlug", input.categorySlug);
      form.set("basePrice", String(input.basePrice));
      if (input.discountPrice !== undefined) form.set("discountPrice", String(input.discountPrice));
      form.set("totalStock", String(input.totalStock));
      form.set("reorderLevel", String(input.reorderLevel));
      if (image) form.set("image", image);
      return apiRequest<VendorProduct>(PRODUCTS_PREFIX, { method: "POST", body: form });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VENDOR_PRODUCTS_KEY }),
  });
}

/** Edit a product's listing details. Stock adjustments go through `useUpdateStock` instead. */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VendorProductInput }) =>
      apiRequest<VendorProduct>(`${PRODUCTS_PREFIX}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_PRODUCTS_KEY });
      queryClient.setQueryData(productKey(product.id), product);
    },
  });
}

/** Dedicated stock-adjustment endpoint, separate from the general product edit. */
export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductStockInput }) =>
      apiRequest<VendorProduct>(`${PRODUCTS_PREFIX}/${id}/stock`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_PRODUCTS_KEY });
      queryClient.setQueryData(productKey(product.id), product);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<void>(`${PRODUCTS_PREFIX}/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VENDOR_PRODUCTS_KEY }),
  });
}
