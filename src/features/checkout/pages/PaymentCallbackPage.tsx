import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { buttonClasses } from "@/components/Button";
import ResultScreen from "@/components/ResultScreen";
import { clearPendingPayment, readPendingPayment, type PendingPayment } from "@/features/checkout/pendingPayment";
import { useConfirmPayment } from "@/features/payment/api";

export default function PaymentCallbackPage() {
  const [pending] = useState<PendingPayment | null>(() => readPendingPayment());
  const confirmPayment = useConfirmPayment();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!pending || firedRef.current) return;
    firedRef.current = true;
    confirmPayment.mutate(pending.paymentId, { onSettled: () => clearPendingPayment() });
    // confirmPayment is a stable mutation object from this render; re-running on every render would re-fire the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  if (!pending) {
    return (
      <main>
        <ResultScreen
          icon="?"
          title="We couldn't find a pending payment."
          description="If you just completed checkout, your order may still have gone through — check your order history."
          action={
            <Link className={buttonClasses()} to="/orders">
              View Orders
            </Link>
          }
        />
      </main>
    );
  }

  if (confirmPayment.isPending || confirmPayment.isIdle) {
    return (
      <main>
        <ResultScreen icon="⋯" title="Confirming your payment…" description="This only takes a moment." />
      </main>
    );
  }

  if (confirmPayment.isError) {
    return (
      <main>
        <ResultScreen
          icon="×"
          tone="failure"
          title="We couldn't confirm your payment."
          description="Something went wrong checking your payment status."
          action={
            <button type="button" className={buttonClasses()} onClick={() => confirmPayment.mutate(pending.paymentId)}>
              Check again
            </button>
          }
        />
      </main>
    );
  }

  const { status } = confirmPayment.data;

  if (status === "FAILED") {
    return (
      <main>
        <ResultScreen
          icon="×"
          tone="failure"
          title="Your payment didn't go through."
          description="No charge was completed. You can retry without losing your order."
          action={
            <Link className={buttonClasses()} to="/checkout">
              Retry Payment
            </Link>
          }
        />
      </main>
    );
  }

  if (status !== "PENDING") {
    return (
      <main>
        <ResultScreen
          icon="✓"
          tone="success"
          title="Payment confirmed."
          description="Your order is being prepared and your receipt is on its way."
          action={
            <Link className={buttonClasses()} to={`/orders/${pending.orderId}`}>
              View Order
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main>
      <ResultScreen
        icon="⋯"
        title="Your payment is still processing."
        description="This can take a moment to settle on Paystack's side. Your order has already been created either way."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className={buttonClasses({ variant: "ghost" })}
              onClick={() => confirmPayment.mutate(pending.paymentId)}
            >
              Check again
            </button>
            <Link className={buttonClasses()} to={`/orders/${pending.orderId}`}>
              View Order
            </Link>
          </div>
        }
      />
    </main>
  );
}
