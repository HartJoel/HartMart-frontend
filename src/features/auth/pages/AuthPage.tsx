import { useState } from "react";
import Brand from "@/components/Brand";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import type { AuthNavigate, AuthScreen } from "@/features/auth/types";

export default function AuthPage({ initialScreen = "login" }: { initialScreen?: AuthScreen }) {
  const [screen, setScreen] = useState<AuthScreen>(initialScreen);
  const [notice, setNotice] = useState("");

  const navigate: AuthNavigate = (next, nextNotice = "") => {
    setScreen(next);
    setNotice(nextNotice);
  };

  return (
    <main className="relative grid min-h-svh grid-rows-[auto_1fr_auto] overflow-hidden bg-hm-background px-6 pt-16 pb-6 max-[520px]:px-4 max-[520px]:pt-8 max-[520px]:pb-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(79,70,229,0.06),transparent_30%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[300px] -right-[180px] size-[420px] rounded-full border border-[rgba(79,70,229,0.08)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[330px] -left-[160px] size-[420px] rounded-full border border-[rgba(79,70,229,0.08)]"
      />

      <Brand tone="light" size="sm" className="relative z-[1] justify-center" />

      <section
        aria-live="polite"
        className="relative z-[1] mx-auto my-12 w-[min(100%,424px)] self-center rounded-hm-md border border-hm-text/[0.06] bg-white/[0.92] p-12 backdrop-blur-[20px] max-[520px]:my-8 max-[520px]:min-h-0 max-[520px]:px-6 max-[520px]:py-8 min-h-[540px]"
      >
        {screen === "login" && <LoginForm onNavigate={navigate} notice={notice} />}
        {screen === "register" && <RegisterForm onNavigate={navigate} />}
        {screen === "forgot" && <ForgotPasswordForm onNavigate={navigate} />}
      </section>

      <div className="relative z-[1] text-center text-[12px] text-hm-muted">
        Thoughtful commerce, made for Nigeria.
      </div>
    </main>
  );
}
