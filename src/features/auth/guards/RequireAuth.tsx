import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/features/auth/store";

/** Gates any route behind a logged-in session, regardless of role. */
export default function RequireAuth() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === "idle" || status === "loading") return null;
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location, notice: "Sign in to continue." }} />;
  }

  return <Outlet />;
}
