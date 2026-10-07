import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/features/auth/store";

/** Keeps a logged-in user off guest-only pages like /login and /register. */
export default function RequireGuest() {
  const status = useAuthStore((state) => state.status);

  if (status === "idle" || status === "loading") return null;
  if (status === "authenticated") return <Navigate to="/" replace />;

  return <Outlet />;
}
