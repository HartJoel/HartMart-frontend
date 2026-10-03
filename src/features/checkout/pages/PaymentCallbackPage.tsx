import { Link, useSearchParams } from "react-router";
import { buttonClasses } from "@/components/Button";
import ResultScreen from "@/components/ResultScreen";

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("status") !== "failure";

  return (
    <main>
      <ResultScreen
        icon={success ? "✓" : "×"}
        tone={success ? "success" : "failure"}
        title={success ? "Payment confirmed." : "We couldn’t confirm your payment."}
        description={
          success
            ? "Your order is being prepared and your receipt is on its way."
            : "No charge was completed. You can retry without losing your order."
        }
        action={
          <Link className={buttonClasses()} to={success ? "/orders/HM-2048" : "/checkout"}>
            {success ? "View Order" : "Retry Payment"}
          </Link>
        }
      />
    </main>
  );
}
