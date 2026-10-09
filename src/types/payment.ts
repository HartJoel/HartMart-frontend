/** `POST /payment/initialize` response — confirmed from a live call. */
export type PaymentInitialization = {
  paymentId: string;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
  status: string;
  attemptCount: number;
};

/** `POST /payment/:id/confirm` response — confirmed from a live call. */
export type PaymentConfirmation = {
  paymentId: string;
  reference: string;
  amount: string;
  currency: string;
  status: string;
  paidAt: string | null;
};

/**
 * `GET /payment`, `GET /payment/:id` — confirmed from live responses. `userId`, `last4` and
 * `cardBrand` were only seen on the single-record response; treat them as possibly absent on
 * the list.
 */
export type Payment = {
  id: string;
  reference: string;
  orderId: string;
  userId?: string;
  amount: string;
  currency: string;
  method: string;
  status: string;
  gateway: string;
  gatewayTransactionId: string | null;
  attemptCount: number;
  last4?: string | null;
  cardBrand?: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt?: string;
};
