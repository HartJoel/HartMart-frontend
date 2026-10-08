import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import QuantityStepper from "@/components/QuantityStepper";
import { useAuthStore } from "@/features/auth/store";
import {
  useAddToCart,
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/features/cart/api";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/features/wishlist/api";
import { cn } from "@/lib/cn";
import { formatNaira } from "@/lib/format";
import { easeOut, useMotionPresets } from "@/lib/motion";

type CardProduct = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  vendor?: string;
  availableStock?: number;
};

export default function ProductCard({ product }: { product: CardProduct }) {
  const { reduce } = useMotionPresets();
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore(
    (state) => state.status === "authenticated",
  );

  const productId = typeof product.id === "string" ? product.id : undefined;

  const inStock =
    product.availableStock === undefined || product.availableStock > 0;

  const { data: cart } = useCart();

  const cartItem = productId
    ? cart?.items.find((item) => item.productId === productId)
    : undefined;

  const { data: wishlist } = useWishlist();

  const isSaved = productId
    ? (wishlist?.items.some((item) => item.productId === productId) ?? false)
    : false;

  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  function requireAuth() {
    navigate("/login", {
      state: {
        notice: "Sign in to continue.",
      },
    });
  }

  function handleAddToCart() {
    if (!productId) return;

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    addToCart.mutate({ productId });
  }

  function adjustQuantity(delta: number) {
    if (!cartItem) return;

    const next = cartItem.quantity + delta;

    if (next < 1) {
      removeCartItem.mutate(cartItem.id);
      return;
    }

    if (
      product.availableStock === undefined ||
      next <= product.availableStock
    ) {
      updateCartItem.mutate({
        id: cartItem.id,
        quantity: next,
      });
    }
  }

  function handleToggleWishlist() {
    if (!productId) return;

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    if (isSaved) {
      removeFromWishlist.mutate(productId);
    } else {
      addToWishlist.mutate(productId);
    }
  }

  return (
    <motion.article
      className="group w-full min-w-0"
      initial={{ y: 0 }}
      whileHover={{
        y: reduce ? 0 : -3,
      }}
      transition={{
        duration: reduce ? 0 : 0.25,
        ease: easeOut,
      }}
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-[18px] bg-hm-field">
        <Link to={`/products/${product.id}`} className="block">
          {product.image ? (
            <motion.img
              src={product.image}
              alt={product.name}
              className={cn(
                "aspect-[4/5] w-full object-cover",
                "transition-transform duration-500 ease-out",
                "group-hover:scale-[1.025]",
                !inStock && "opacity-55",
              )}
            />
          ) : (
            <span className="grid aspect-[4/5] w-full place-items-center text-hm-muted">
              <Icon name="shop" size={28} />
            </span>
          )}
        </Link>

        {/* WISHLIST */}
        {productId && (
          <div className="absolute right-3.5 top-3.5">
            <IconButton
              label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={isSaved}
              tone="field"
              disabled={addToWishlist.isPending || removeFromWishlist.isPending}
              onClick={handleToggleWishlist}
              className={cn(
                "grid h-10 w-10 place-items-center",
                "rounded-full",
                "bg-white/95 shadow-[0_4px_18px_rgba(0,0,0,.08)]",
                "backdrop-blur-sm",
                "transition-transform duration-200",
                "hover:scale-105",
                "active:scale-95",
                isSaved ? "text-hm-error" : "text-hm-text",
              )}
            >
              <span className="text-[18px] leading-none">
                {isSaved ? "♥" : "♡"}
              </span>
            </IconButton>
          </div>
        )}

        {/* OUT OF STOCK */}
        {!inStock && (
          <div className="absolute bottom-4 left-4">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-hm-muted shadow-sm">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-1.5 pt-4">
        {/* PRODUCT NAME */}
        <Link
          to={`/products/${product.id}`}
          className="block min-w-0 no-underline"
        >
          <h3 className="truncate text-[13px] font-semibold leading-[1.35] text-hm-text">
            {product.name}
          </h3>

          {product.vendor && (
            <p className="mt-1.5 truncate text-[10px] text-hm-muted">
              {product.vendor}
            </p>
          )}
        </Link>

        {/* PRICE + ACTION */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[14px] font-bold tracking-[-0.02em] text-hm-accent">
              {formatNaira(product.price)}
            </span>

            {inStock &&
              product.availableStock !== undefined &&
              product.availableStock <= 5 && (
                <span className="mt-1 block text-[9px] text-hm-muted">
                  Only {product.availableStock} left
                </span>
              )}
          </div>

          {/* CART ACTION */}
          {productId && inStock && !cartItem && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              disabled={addToCart.isPending}
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                "group/cart flex h-10 items-center gap-2",
                "rounded-full bg-hm-text",
                "pl-3.5 pr-3",
                "text-white",
                "shadow-sm",
                "transition-all duration-200",
                "hover:bg-black hover:shadow-md",
                "disabled:opacity-60",
              )}
            >
              <Icon name="cart" size={14} />

              <span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-semibold opacity-0 transition-all duration-300 group-hover/cart:max-w-[60px] group-hover/cart:opacity-100">
                {addToCart.isPending ? "Adding" : "Add"}
              </span>
            </motion.button>
          )}

          {/* QUANTITY */}
          {productId && cartItem && (
            <div className="shrink-0">
              <QuantityStepper
                value={cartItem.quantity}
                disabled={updateCartItem.isPending || removeCartItem.isPending}
                onDecrease={() => adjustQuantity(-1)}
                onIncrease={() => adjustQuantity(1)}
              />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
