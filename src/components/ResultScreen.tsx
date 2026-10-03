import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Brand from "@/components/Brand";
import { cn } from "@/lib/cn";
import { useMotionPresets } from "@/lib/motion";

type ResultScreenProps = {
  /** Shows the HartMart mark linking home, above the content. */
  showBrand?: boolean;
  /** Fills the viewport height. Set to false when rendered inside a layout. */
  fullPage?: boolean;
  icon?: ReactNode;
  tone?: "neutral" | "success" | "failure";
  title: string;
  description?: string;
  action?: ReactNode;
};

const iconTones = {
  neutral: "bg-hm-field",
  success: "bg-[#eaf6f0] text-hm-success",
  failure: "bg-[#fff4f5] text-hm-error",
};

/**
 * Centred confirmation / empty / error message used by standalone pages.
 * The icon lands first, then the copy and action follow as one staggered group.
 */
export default function ResultScreen({
  showBrand = true,
  fullPage = true,
  icon,
  tone = "neutral",
  title,
  description,
  action,
}: ResultScreenProps) {
  const { group, rise, pop } = useMotionPresets();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={group}
      className={cn(
        "relative flex flex-col items-center justify-center px-5 py-10 text-center",
        fullPage ? "min-h-screen" : "min-h-[420px]",
      )}
    >
      {showBrand && <Brand to="/" className="absolute top-[34px]" />}
      {icon && (
        <motion.div
          variants={pop}
          className={cn("grid size-18 place-items-center rounded-full text-[30px]", iconTones[tone])}
        >
          {icon}
        </motion.div>
      )}
      <motion.h1 variants={rise} className="mt-7 mb-3 max-w-[680px] text-[clamp(42px,6vw,64px)] tracking-[-0.06em]">
        {title}
      </motion.h1>
      {description && (
        <motion.p variants={rise} className="mb-7 max-w-[500px] leading-[1.7] text-hm-muted">
          {description}
        </motion.p>
      )}
      {action && <motion.div variants={rise}>{action}</motion.div>}
    </motion.div>
  );
}
