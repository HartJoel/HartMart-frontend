import type { Order } from "@/types/order";
import { products } from "@/lib/mock/products";

// Placeholder order history until GET /orders is wired.
export const orders: Order[] = [
  {
    id: "HM-2048",
    date: "2026-09-20T10:42:00",
    status: "Delivered",
    items: [products[0], products[2]],
    paymentMethod: "Visa ending in 4024",
    paymentReference: "PAY-8T2N-4L9Q",
  },
  {
    id: "HM-1982",
    date: "2026-09-08T14:10:00",
    status: "Shipped",
    items: [products[4]],
    paymentMethod: "Bank transfer",
    paymentReference: "PAY-3K7M-1P8R",
  },
  {
    id: "HM-1947",
    date: "2026-08-25T09:05:00",
    status: "Processing",
    items: [products[1], products[3]],
    paymentMethod: "Visa ending in 4024",
    paymentReference: "PAY-6H2W-9D4S",
  },
  {
    id: "HM-1904",
    date: "2026-08-10T18:30:00",
    status: "Pending",
    items: [products[6]],
    paymentMethod: "Card ending in 1187",
    paymentReference: "PAY-1X5Z-7C3V",
  },
];

export function findOrder(id: string | undefined) {
  return orders.find((order) => order.id === id);
}

export function orderTotal(order: Order) {
  return order.items.reduce((sum, product) => sum + product.price, 0);
}
