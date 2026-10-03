import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { useMotionPresets } from "@/lib/motion";
import AuthField from "@/features/auth/components/AuthField";
import AuthHeader from "@/features/auth/components/AuthHeader";
import ErrorBanner from "@/features/auth/components/ErrorBanner";
import type { AuthScreen } from "@/features/auth/types";

export default function RegisterForm({ onNavigate }: { onNavigate: (screen: AuthScreen) => void }) {
  const [error, setError] = useState("");
  const { rise } = useMotionPresets();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = ["name", "email", "password"].map((key) => String(data.get(key) ?? "").trim());

    if (values.some((value) => !value)) {
      setError("Please complete each field before creating your account.");
      return;
    }

    onNavigate("login");
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={rise}>
      <AuthHeader
        eyebrow="JOIN HARTMART"
        title="Create your account"
        description="A more considered way to discover and shop from Nigeria’s best vendors."
      />
      <form className="mt-12 flex flex-col gap-6 max-[520px]:mt-8" onSubmit={handleSubmit} noValidate>
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <AuthField
          id="register-name"
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
        />
        <AuthField
          id="register-email"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <AuthField
          id="register-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <Button type="submit" size="lg">
          Create Account
        </Button>
      </form>
      <div className="mt-8 flex items-center justify-center gap-2 text-[13px] text-hm-muted max-[520px]:flex-wrap">
        <span>Already have an account?</span>
        <Button variant="link" onClick={() => onNavigate("login")}>
          Sign in
        </Button>
      </div>
    </motion.div>
  );
}
