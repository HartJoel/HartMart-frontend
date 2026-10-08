import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { SessionProvider } from "@/features/auth/SessionContext";
import { useAuthBootstrap } from "@/features/auth/useAuthBootstrap";
import { NotificationsProvider } from "@/features/notifications/NotificationsContext";
import { ReviewsProvider } from "@/features/reviews/ReviewsContext";
import { WishlistProvider } from "@/features/wishlist/WishlistContext";

/** Kicks off the `/users/me` → auth store hydration. Mounted inside QueryClientProvider. */
function AuthBootstrap() {
  useAuthBootstrap();
  return null;
}

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <SessionProvider>
        <NotificationsProvider>
          <ReviewsProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </ReviewsProvider>
        </NotificationsProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
