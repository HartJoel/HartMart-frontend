import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import Button from "@/components/Button";
import { useMotionPresets } from "@/lib/motion";
import { ApiError } from "@/lib/api/client";
import { useLogin } from "@/features/auth/api";
import AuthField from "@/features/auth/components/AuthField";
import AuthHeader from "@/features/auth/components/AuthHeader";
import ErrorBanner from "@/features/auth/components/ErrorBanner";
import type { AuthNavigate } from "@/features/auth/types";

export default function LoginForm({
  onNavigate,
  notice,
}: {
  onNavigate: AuthNavigate;
  notice?: string;
}) {
  const [error, setError] = useState("");
  const { rise } = useMotionPresets();
  const login = useLogin();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      setError("Please enter both your email and password to continue.");
      return;
    }

    setError("");
    try {
      await login.mutateAsync({ email, password });
      navigate("/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "We couldn’t sign you in with those details. Please check them and try again.",
      );
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={rise}>
      <AuthHeader
        eyebrow="WELCOME BACK"
        title="Sign in to HartMart"
        description="Your favourite finds and trusted vendors are waiting."
      />
      <form className="mt-12 flex flex-col gap-6 max-[520px]:mt-8" onSubmit={handleSubmit} noValidate>
        {!error && notice && <ErrorBanner tone="success">{notice}</ErrorBanner>}
        {error && <ErrorBanner>{error}</ErrorBanner>}
        <AuthField
          id="login-email"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div className="relative">
          <AuthField
            id="login-password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
          />
          <Button variant="link" className="absolute top-0 right-0" onClick={() => onNavigate("forgot")}>
            Forgot password?
          </Button>
        </div>
        <Button type="submit" size="lg" disabled={login.isPending}>
          {login.isPending ? "Signing in…" : "Sign In"}
        </Button>
      </form>
      <div className="mt-8 flex items-center justify-center gap-2 text-[13px] text-hm-muted max-[520px]:flex-wrap">
        <span>New to HartMart?</span>
        <Button variant="link" onClick={() => onNavigate("register")}>
          Create an account
        </Button>
      </div>
    </motion.div>
  );
}
