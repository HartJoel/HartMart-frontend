import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMotionPresets } from "@/lib/motion";

// Plays once, when the element first enters view, so scrolling back up does not replay it.
export const revealViewport = { once: true, amount: 0.15 } as const;

/** Fades a block up into place the first time it scrolls into view. */
export default function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const { rise } = useMotionPresets();

  return (
    <motion.div className={className} initial="hidden" whileInView="visible" viewport={revealViewport} variants={rise}>
      {children}
    </motion.div>
  );
}

/** Child of RevealGroup. Inherits its stagger timing rather than triggering on its own. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const { rise } = useMotionPresets();

  return (
    <motion.div className={className} variants={rise}>
      {children}
    </motion.div>
  );
}
