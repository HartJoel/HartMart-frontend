import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { easeOut, useMotionPresets } from "@/lib/motion";

type RejectApplicationModalProps = {
  store: string;
  onClose: () => void;
  onReject: () => void;
};

export default function RejectApplicationModal({ store, onClose, onReject }: RejectApplicationModalProps) {
  const [reason, setReason] = useState("");
  const { reduce } = useMotionPresets();

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(20,20,22,0.35)] p-6 backdrop-blur-[5px]"
      onMouseDown={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: easeOut }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-[min(100%,540px)] rounded-hm-md bg-hm-surface p-12 max-[480px]:p-8"
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: easeOut }}
      >
        <div className="mb-12 flex items-start justify-between">
          <div>
            <span className="mb-3 block text-[10px] font-[750] tracking-[0.14em] text-hm-accent">
              REJECT APPLICATION
            </span>
            <div id="reject-title" className="text-[28px] font-[650] tracking-[-0.04em]">
              {store}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border-0 bg-hm-field"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
        <label htmlFor="reason" className="block text-[10px] font-[650]">
          Reason for rejection
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain what needs to be corrected before they reapply"
          className="mt-2 min-h-[130px] w-full resize-y rounded-hm-sm border-0 bg-hm-field p-4 text-[11px] leading-[1.6] outline-0"
        />
        <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
          <Button variant="quiet" size="sm" className="max-[480px]:w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="ghost" size="sm" className="max-[480px]:w-full" onClick={onReject}>
            Reject application
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
}
