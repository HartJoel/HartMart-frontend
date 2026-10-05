import { motion } from "framer-motion";
import { useId, useRef, type ReactNode } from "react";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import { useMotionPresets } from "@/lib/motion";
import { useDialog } from "@/lib/useDialog";

type DrawerProps = {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Side panel for reading or acting on a record without leaving the page behind it.
 * Render it inside an AnimatePresence so its exit slides out before it unmounts.
 */
export default function Drawer({ title, eyebrow, onClose, children }: DrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const { overlay, drawer } = useMotionPresets();
  useDialog(panelRef, onClose);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[rgba(20,20,22,0.35)] backdrop-blur-[5px]"
      onMouseDown={onClose}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlay}
    >
      <motion.aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        variants={drawer}
        className="absolute top-0 right-0 flex h-full w-[min(100%,480px)] flex-col bg-hm-surface outline-0 shadow-[-24px_0_70px_rgba(20,20,22,0.12)]"
      >
        <div className="flex items-start justify-between gap-6 border-b border-hm-border px-8 py-6">
          <div>
            {eyebrow && (
              <span className="mb-2 block text-[10px] font-[750] tracking-[0.14em] text-hm-muted">{eyebrow}</span>
            )}
            <h2 id={titleId} className="m-0 text-[22px] font-[650] tracking-[-0.03em]">
              {title}
            </h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <Icon name="close" size={15} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8">{children}</div>
      </motion.aside>
    </motion.div>
  );
}
