import { motion } from "framer-motion";
import { Link } from "react-router";
import Icon from "@/components/Icon";
import { formatNaira } from "@/lib/format";
import { easeOut, useMotionPresets } from "@/lib/motion";

// Shadow is invisible at rest and only appears on hover (design system: elevation is interaction-only).
const restingShadow = "0px 0px 0px 0px rgba(26, 26, 26, 0)";
const liftedShadow = "0px 22px 44px -24px rgba(26, 26, 26, 0.32)";

/** What a card needs to render — kept smaller than the full `Product`/`CatalogProduct` API shapes it's fed from. */
type CardProduct = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  vendor?: string;
};

export default function ProductCard({ product }: { product: CardProduct }) {
  const { reduce } = useMotionPresets();

  return (
    <motion.div
      className="rounded-hm-md"
      initial={{ boxShadow: restingShadow }}
      whileHover={{ y: reduce ? 0 : -4, boxShadow: liftedShadow }}
      transition={{ duration: reduce ? 0 : 0.3, ease: easeOut }}
    >
      <Link className="block text-hm-text no-underline" to={`/products/${product.id}`}>
        {product.image ? (
          <img
            className="block aspect-[4/5] w-full rounded-hm-md bg-hm-field object-cover"
            src={product.image}
            alt={product.name}
          />
        ) : (
          <span className="grid aspect-[4/5] w-full place-items-center rounded-hm-md bg-hm-field text-hm-muted">
            <Icon name="shop" size={28} />
          </span>
        )}
        <div className="flex justify-between gap-2 px-1 py-3.5">
          <span>
            <strong className="block text-[13px]">{product.name}</strong>
            {product.vendor && <small className="mt-1.5 block text-[10px] text-hm-muted">{product.vendor}</small>}
          </span>
          <b className="whitespace-nowrap text-[13px] text-hm-accent">{formatNaira(product.price)}</b>
        </div>
      </Link>
    </motion.div>
  );
}
