import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store";
import type { VendorProduct } from "@/types/product";

const CART_PREFIX = "/api/v1/carts";
const CART_KEY = ["cart"] as const;

export type CartLineItem = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  selectedVariation: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  product: VendorProduct;
};

export type Cart = {
  items: CartLineItem[];
  total: number;
  itemCount: number;
};

/** The signed-in shopper's cart. Powers the Cart page and the header badge; only fetched while signed in. */
export function useCart() {
  const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

  return useQuery({
    queryKey: CART_KEY,
    queryFn: () => apiRequest<Cart>(CART_PREFIX),
    enabled: isAuthenticated,
  });
}

/** Adds a product to the cart, or increases its quantity if it's already there. */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: string; quantity?: number }) =>
      apiRequest<CartLineItem>(CART_PREFIX, { method: "POST", body: JSON.stringify({ productId, quantity }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

/** Sets a line item's quantity outright (not a relative delta). */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      apiRequest<CartLineItem>(`${CART_PREFIX}/${id}`, { method: "PATCH", body: JSON.stringify({ quantity }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<void>(`${CART_PREFIX}/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiRequest<void>(CART_PREFIX, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}
