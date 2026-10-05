import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type WishlistValue = {
  /** Product ids the shopper has saved, in the order they were saved. */
  savedIds: number[];
  isSaved: (productId: number) => boolean;
  toggle: (productId: number) => void;
  remove: (productId: number) => void;
};

const WishlistContext = createContext<WishlistValue | null>(null);

/** Holds the shopper's saved products in memory until GET/POST/DELETE /wishlists is wired. */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<number[]>([1, 3, 5]);

  const isSaved = useCallback((productId: number) => savedIds.includes(productId), [savedIds]);

  const toggle = useCallback((productId: number) => {
    setSavedIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );
  }, []);

  const remove = useCallback((productId: number) => {
    setSavedIds((current) => current.filter((id) => id !== productId));
  }, []);

  const value = useMemo(
    () => ({ savedIds, isSaved, toggle, remove }),
    [savedIds, isSaved, toggle, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside WishlistProvider");
  return value;
}
