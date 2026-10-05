import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { products } from "@/lib/mock/products";
import type { Product } from "@/types/product";

export type CartItem = { product: Product; quantity: number };

type CartValue = {
  items: CartItem[];
  /** Total units across all lines, shown in the header and cart summary. */
  itemCount: number;
  /** Adds a product, or increases its quantity if it is already in the cart. */
  addItem: (product: Product, quantity?: number) => void;
  changeQuantity: (productId: number, delta: number) => void;
  removeItem: (productId: number) => void;
};

const CartContext = createContext<CartValue | null>(null);

/** Holds the shopper's cart in memory until the cart API is wired. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    products.slice(0, 3).map((product, index) => ({ product, quantity: index === 1 ? 2 : 1 })),
  );

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) =>
      current.some((entry) => entry.product.id === product.id)
        ? current.map((entry) =>
            entry.product.id === product.id ? { ...entry, quantity: entry.quantity + quantity } : entry,
          )
        : [...current, { product, quantity }],
    );
  }, []);

  const changeQuantity = useCallback((productId: number, delta: number) => {
    setItems((current) =>
      current.map((entry) =>
        entry.product.id === productId ? { ...entry, quantity: Math.max(1, entry.quantity + delta) } : entry,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((entry) => entry.product.id !== productId));
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      changeQuantity,
      removeItem,
    }),
    [items, addItem, changeQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
