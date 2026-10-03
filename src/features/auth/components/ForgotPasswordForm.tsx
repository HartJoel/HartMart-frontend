import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import AuthField from "@/features/auth/components/AuthField";
import AuthHeader from "@/features/auth/components/AuthHeader";
import ErrorBanner from "@/features/auth/components/ErrorBanner";
import type { AuthScreen } from "@/features/auth/types";
import { useMotionPresets } from "@/lib/motion";

export default function ForgotPasswordForm({ onNavigate }: { onNavigate: (screen: AuthScreen) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const { rise } = useMotionPresets();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submittedEmail = String(data.get("email") ?? "").trim();

    if (!submittedEmail || !submittedEmail.includes("@")) {
      setError("Enter a valid email address and we’ll send you a reset link.");
      return;
    }

    setEmail(submittedEmail);
    setError("");
    setSent(true);
  }

  if (sent) {
    return (
      <motion.div
        key="confirmation"
        initial="hidden"
        animate="visible"
        variants={rise}
        className="flex min-h-[442px] flex-col justify-center"
      >
        <div className="mx-auto mb-8 grid size-14 place-items-center rounded-full bg-[rgba(79,70,229,0.09)] text-hm-accent">
          <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            className="size-7 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]"
          >
            <path d="m8.5 16.2 5 5.1 10-10.6" />
          </svg>
        </div>
        <AuthHeader
          eyebrow="EMAIL SENT"
          title="Check your email"
          description={`We sent a password reset link to ${email}. It may take a minute to arrive.`}
        />
        <Button variant="link" className="mx-auto mt-12" onClick={() => onNavigate("login")}>
          Back to sign in
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div key="forgot" initial="hidden" animate="visible" variants={rise}>
      <AuthHeader
        eyebrow="RESET PASSWORD"
        title="Let’s get you back in"
        description="Enter the email linked to your account and we’ll send you a secure reset link."
      />
      <form className="mt-12 flex flex-col gap-6 max-[520px]:mt-8" onSubmit={handleSubmit} noValidate>
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <AuthField
          id="forgot-email"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <Button type="submit" size="lg">
          Send Reset Link
        </Button>
      </form>
      <div className="mt-8 flex items-center justify-center gap-2 text-[13px] text-hm-muted max-[520px]:flex-wrap">
        <span>Remembered your password?</span>
        <Button variant="link" onClick={() => onNavigate("login")}>
          Back to sign in
        </Button>
      </div>
    </motion.div>
  );
}
