import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, apiRequestPage } from "@/lib/api/client";
import type { Payment, PaymentConfirmation, PaymentInitialization } from "@/types/payment";

const PAYMENT_PREFIX = "/api/v1/payment";

/** Starts a Paystack transaction for an order that already exists. Redirect to `authorizationUrl` on success. */
export function useInitializePayment() {
  return useMutation({
    mutationFn: (orderId: string) =>
      apiRequest<PaymentInitialization>(`${PAYMENT_PREFIX}/initialize`, {
        method: "POST",
        body: JSON.stringify({ orderId }),
      }),
  });
}

/** Confirms a transaction after the Paystack redirect, keyed by the payment's own id (not the order id). */
export function useConfirmPayment() {
  return useMutation({
    mutationFn: (paymentId: string) =>
      apiRequest<PaymentConfirmation>(`${PAYMENT_PREFIX}/${paymentId}/confirm`, { method: "POST" }),
  });
}

/** The signed-in user's payment history. */
export function useMyPayments(params: { page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const search = query.toString();

  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => apiRequestPage<Payment[]>(`${PAYMENT_PREFIX}${search ? `?${search}` : ""}`),
  });
}

/** A single payment record, e.g. for a receipt block. */
export function usePayment(id: string | undefined) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => apiRequest<Payment>(`${PAYMENT_PREFIX}/${id}`),
    enabled: id !== undefined,
  });
}
