import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import type { Address } from "@/types/address";
import type { CreateOrderInput, Order, OrderTimelineEntry } from "@/types/order";

const ORDERS_PREFIX = "/api/v1/orders";
const ORDERS_KEY = ["orders"] as const;

function orderKey(id: string) {
  return [...ORDERS_KEY, id] as const;
}

/** The current user's own order history. */
export function useOrders() {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: () => apiRequest<Order[]>(ORDERS_PREFIX),
  });
}

/** A single order's full detail. */
export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: orderKey(id ?? ""),
    queryFn: () => apiRequest<Order>(`${ORDERS_PREFIX}/${id}`),
    enabled: id !== undefined,
  });
}

/** Status-change history for an order, newest/oldest order not yet confirmed — sort by `createdAt` before rendering. */
export function useOrderTimeline(id: string | undefined) {
  return useQuery({
    queryKey: [...orderKey(id ?? ""), "timeline"] as const,
    queryFn: () => apiRequest<OrderTimelineEntry[]>(`${ORDERS_PREFIX}/${id}/timeline`),
    enabled: id !== undefined,
  });
}

/** Orders containing the logged-in vendor's products, for the vendor fulfilment table. */
export function useVendorOrders() {
  return useQuery({
    queryKey: ["vendor", "orders"] as const,
    queryFn: () => apiRequest<Order[]>(`${ORDERS_PREFIX}/vendor`),
  });
}

/** Creates an order from the current cart. Payment is a separate step against the Payment API. */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) =>
      apiRequest<Order>(ORDERS_PREFIX, { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

/** `shippingAddress` is a JSON-encoded string on the order, not an object — parse before rendering. */
export function parseShippingAddress(order: Order): Address | null {
  try {
    return JSON.parse(order.shippingAddress) as Address;
  } catch {
    return null;
  }
}
