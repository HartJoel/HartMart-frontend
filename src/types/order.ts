export type OrderCustomer = {
  id: string;
  email: string;
  name: string;
};

export type OrderItemImage = {
  url: string;
  publicId: string;
};

/**
 * One product line within an order — confirmed from a live `POST /orders` response.
 * `name`/`image` are a snapshot taken at order time, not a live product lookup, so they stay
 * correct even if the product is later renamed, re-imaged or deleted. `status` is this line's
 * own fulfillment status (e.g. a vendor ships their items independently), distinct from the
 * order-level `status`.
 */
export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  vendorId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  selectedVariation: Record<string, unknown>;
  status: string;
  fulfillmentDate: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  image: OrderItemImage | null;
};

/**
 * `GET /orders`, `GET /orders/:id`, `GET /orders/vendor`, `POST /orders` — confirmed from live
 * responses. Money fields (`subtotal`, `taxAmount`, `shippingCost`, `discountAmount`,
 * `totalAmount`) come back as numeric strings, not numbers. `shippingAddress` is a JSON-encoded
 * string of an `Address`, not an object — parse it with `parseShippingAddress`.
 */
export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  status: string;
  subtotal: string;
  taxAmount: string;
  shippingCost: string;
  discountAmount: string;
  totalAmount: string;
  shippingAddress: string;
  estimatedDelivery: string | null;
  actualDelivery: string | null;
  trackingNumber: string | null;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
  /** Only present on some endpoints (confirmed on `GET /orders/:id`). */
  customer?: OrderCustomer;
};

/** One status-change event from `GET /orders/:id/timeline` — confirmed from the backend's `OrderRepository.getTimeline`. */
export type OrderTimelineEntry = {
  id: string;
  orderId: string;
  status: string;
  note: string | null;
  createdBy: string | null;
  createdAt: string;
};

/** Body for `POST /orders` — creates an order from the current cart. */
export type CreateOrderInput = {
  paymentMethod: string;
  customerNotes?: string;
};

export type { Address as ShippingAddress } from "@/types/address";
