import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLocation } from "react-router";
import { useMotionPresets } from "@/lib/motion";

/**
 * Fades each page in when the route changes. Keyed by pathname so the page
 * remounts and replays the entrance, while the surrounding layout shell stays put.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { rise } = useMotionPresets();

  return (
    <motion.div key={pathname} initial="hidden" animate="visible" variants={rise}>
      {children}
    </motion.div>
  );
}
