import type { Product } from "@/types/product";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

export type Order = {
  id: string;
  /** ISO date the order was placed. */
  date: string;
  status: OrderStatus;
  items: Product[];
  paymentMethod: string;
  paymentReference: string;
};
