import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/types/auth";

/** Gates a route behind a logged-in session that also holds the given role. */
export default function RequireRole({ role }: { role: UserRole }) {
  const { status, user } = useAuthStore();
  const location = useLocation();

  if (status === "idle" || status === "loading") return null;
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location, notice: "Sign in to continue." }} />;
  }
  if (user?.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}
