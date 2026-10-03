import { motion } from "framer-motion";
import { Link } from "react-router";
import { formatNaira } from "@/lib/format";
import { easeOut, useMotionPresets } from "@/lib/motion";
import type { Product } from "@/types/product";

// Shadow is invisible at rest and only appears on hover (design system: elevation is interaction-only).
const restingShadow = "0px 0px 0px 0px rgba(26, 26, 26, 0)";
const liftedShadow = "0px 22px 44px -24px rgba(26, 26, 26, 0.32)";

export default function ProductCard({ product }: { product: Product }) {
  const { reduce } = useMotionPresets();

  return (
    <motion.div
      className="rounded-hm-md"
      initial={{ boxShadow: restingShadow }}
      whileHover={{ y: reduce ? 0 : -4, boxShadow: liftedShadow }}
      transition={{ duration: reduce ? 0 : 0.3, ease: easeOut }}
    >
      <Link className="block text-hm-text no-underline" to={`/products/${product.id}`}>
        <img className="block aspect-[4/5] w-full rounded-hm-md bg-hm-field object-cover" src={product.image} alt={product.name} />
        <div className="flex justify-between gap-2 px-1 py-3.5">
          <span>
            <strong className="block text-[13px]">{product.name}</strong>
            <small className="mt-1.5 block text-[10px] text-hm-muted">{product.vendor}</small>
          </span>
          <b className="whitespace-nowrap text-[13px] text-hm-accent">{formatNaira(product.price)}</b>
        </div>
      </Link>
    </motion.div>
  );
}
