export type PendingPayment = {
  paymentId: string;
  orderId: string;
};

const KEY = "hartmart:pendingPayment";

/**
 * `POST /payment/:id/confirm` is keyed by the payment's own id, and its response doesn't include
 * the order id either — neither of which Paystack's redirect is guaranteed to echo back. Checkout
 * stashes both here right before the full-page redirect to Paystack; the callback page reads them
 * back once control returns to the SPA.
 */
export function setPendingPayment(value: PendingPayment) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Best-effort — a private-browsing session that blocks storage just loses the "View Order" link.
  }
}

export function readPendingPayment(): PendingPayment | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PendingPayment) : null;
  } catch {
    return null;
  }
}

export function clearPendingPayment() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}
