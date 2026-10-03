import { Link } from "react-router";
import { buttonClasses } from "@/components/Button";
import ResultScreen from "@/components/ResultScreen";

export default function NotFoundPage() {
  return (
    <main>
      <ResultScreen
        showBrand={false}
        title="Page not found."
        action={
          <Link className={buttonClasses()} to="/">
            Back to Home
          </Link>
        }
      />
    </main>
  );
}
