import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { SessionProvider } from "@/features/auth/SessionContext";
import { NotificationsProvider } from "@/features/notifications/NotificationsContext";
import { ReviewsProvider } from "@/features/reviews/ReviewsContext";
import { CartProvider } from "@/features/cart/CartContext";
import { WishlistProvider } from "@/features/wishlist/WishlistContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <NotificationsProvider>
          <ReviewsProvider>
            <WishlistProvider>
              <CartProvider>{children}</CartProvider>
            </WishlistProvider>
          </ReviewsProvider>
        </NotificationsProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
