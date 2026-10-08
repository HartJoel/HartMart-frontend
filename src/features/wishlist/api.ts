import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store";
import type { VendorProduct } from "@/types/product";

const WISHLIST_PREFIX = "/api/v1/wishlists";
const WISHLIST_KEY = ["wishlist"] as const;

export type WishlistItem = {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: VendorProduct;
};

/**
 * The signed-in shopper's saved products. Powers the Wishlist page and the header badge.
 * Normalizes the response because the live API returns a bare array here, unlike the cart's
 * `{ items, total, itemCount }` envelope — not what the (undocumented) list shape implied.
 */
export function useWishlist() {
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: async () => {
      const data = await apiRequest<WishlistItem[] | { items: WishlistItem[] }>(WISHLIST_PREFIX);
      return { items: Array.isArray(data) ? data : data.items ?? [] };
    },
    enabled: isAuthenticated,
  });
}

/** Fast "is this already saved" check, used to set the heart state on the product detail page. */
export function useWishlistCheck(productId: string | undefined) {
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

  return useQuery({
    queryKey: [...WISHLIST_KEY, "check", productId],
    queryFn: () => apiRequest<{ inWishlist: boolean }>(`${WISHLIST_PREFIX}/${productId}/check`),
    enabled: isAuthenticated && productId !== undefined,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      apiRequest<{ id: string; userId: string; productId: string; createdAt: string }>(WISHLIST_PREFIX, {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });
}

/** Removal is keyed by productId, not the wishlist row's own id — confirmed from the live API. */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => apiRequest<void>(`${WISHLIST_PREFIX}/${productId}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });
}
