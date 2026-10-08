import { useQuery } from "@tanstack/react-query";
import { apiRequest, type PaginationMeta } from "@/lib/api/client";
import type { Category } from "@/types/category";
import type { CatalogProduct, VendorProduct } from "@/types/product";

const PRODUCTS_PREFIX = "/api/v1/products";
const CATEGORY_PREFIX = "/api/v1/category";

export type ProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  /** Not in the documented query params, but confirmed working against the live API. */
  categoryId?: string;
};

/**
 * Public catalog/search. Paginated, with the pagination block nested inside `data`
 * (`{ data: { data: [...], pagination } }`) rather than as a sibling — confirmed from a live response.
 */
export function useProducts(params: ProductsParams = {}) {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  const search = query.toString();

  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      apiRequest<{ data: CatalogProduct[]; pagination: PaginationMeta }>(
        `${PRODUCTS_PREFIX}${search ? `?${search}` : ""}`,
      ),
  });
}

/** Flat category list for the home page rail and the product browser's sidebar. */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiRequest<Category[]>(CATEGORY_PREFIX),
  });
}

/** A single product's full detail, for the Product Detail page. */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => apiRequest<VendorProduct>(`${PRODUCTS_PREFIX}/${id}`),
    enabled: id !== undefined,
  });
}

/** Maps a catalog product to what `ProductCard` needs to render — it stays unaware of the API shape. */
export function toCardProduct(product: CatalogProduct) {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.discountPrice ?? product.basePrice),
    image: product.images[0]?.url ?? "",
  };
}
