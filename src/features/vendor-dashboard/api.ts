import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, type PaginationMeta } from "@/lib/api/client";
import type { Category } from "@/types/category";
import type { ProductStockInput, VendorProduct, VendorProductInput } from "@/types/product";
import type { VendorAnalytics, VendorProfile, VendorProfileInput } from "@/types/vendor";

const PRODUCTS_PREFIX = "/api/v1/products";
const CATEGORY_PREFIX = "/api/v1/category";
const VENDOR_PREFIX = "/api/v1/vendor";
const VENDOR_PRODUCTS_KEY = ["vendor", "products"] as const;
const VENDOR_PROFILE_KEY = ["vendor", "me"] as const;

function productKey(id: string) {
  return ["products", id] as const;
}

/** The logged-in vendor's own profile, for the dashboard sidebar and the Store Settings page. */
export function useVendorProfile() {
  return useQuery({
    queryKey: VENDOR_PROFILE_KEY,
    queryFn: () => apiRequest<VendorProfile>(`${VENDOR_PREFIX}/me`),
  });
}

/** Sales/performance summary for the dashboard home's metric cards. */
export function useVendorAnalytics() {
  return useQuery({
    queryKey: ["vendor", "me", "analytics"],
    queryFn: () => apiRequest<VendorAnalytics>(`${VENDOR_PREFIX}/me/analytics`),
  });
}

/** Updates store description and, optionally, the logo/banner images. Always multipart: the API accepts files for both. */
export function useUpdateVendorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VendorProfileInput) => {
      const form = new FormData();
      form.set("storeDescription", input.storeDescription);
      if (input.storeLogo) form.set("storeLogo", input.storeLogo);
      if (input.storeBanner) form.set("storeBanner", input.storeBanner);
      return apiRequest<VendorProfile>(`${VENDOR_PREFIX}/me`, { method: "PATCH", body: form });
    },
    onSuccess: (profile) => queryClient.setQueryData(VENDOR_PROFILE_KEY, profile),
  });
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

/**
 * Edit a product's listing details, optionally replacing its image. Stock adjustments go
 * through `useUpdateStock` instead. Only switches to multipart when a new image is chosen —
 * the plain JSON PATCH is otherwise unchanged.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload, image }: { id: string; payload: VendorProductInput; image?: File }) => {
      if (!image) {
        return apiRequest<VendorProduct>(`${PRODUCTS_PREFIX}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
      }

      const form = new FormData();
      form.set("name", payload.name);
      form.set("description", payload.description);
      form.set("categorySlug", payload.categorySlug);
      form.set("basePrice", String(payload.basePrice));
      if (payload.discountPrice !== undefined) form.set("discountPrice", String(payload.discountPrice));
      form.set("totalStock", String(payload.totalStock));
      form.set("reorderLevel", String(payload.reorderLevel));
      form.set("images", image);
      return apiRequest<VendorProduct>(`${PRODUCTS_PREFIX}/${id}`, { method: "PATCH", body: form });
    },
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
