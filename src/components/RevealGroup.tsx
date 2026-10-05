import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { revealViewport } from "@/components/Reveal";
import { useMotionPresets } from "@/lib/motion";

/** Staggers its RevealItem children in, one after another, when the group scrolls into view. */
export default function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const { group } = useMotionPresets();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={group}
    >
      {children}
    </motion.div>
  );
}
