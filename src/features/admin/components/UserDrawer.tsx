import { motion } from "framer-motion";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import StatusBadge from "@/components/StatusBadge";
import { initialsOf, type AdminUser } from "@/features/admin/mock";
import { easeOut, useMotionPresets } from "@/lib/motion";

type UserDrawerProps = {
  user: AdminUser;
  onClose: () => void;
};

export default function UserDrawer({ user, onClose }: UserDrawerProps) {
  const { reduce } = useMotionPresets();

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[rgba(20,20,22,0.35)] backdrop-blur-[5px]"
      onMouseDown={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25, ease: easeOut }}
    >
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-name"
        onMouseDown={(event) => event.stopPropagation()}
        className="absolute top-0 right-0 h-full w-[min(100%,440px)] overflow-y-auto bg-hm-surface p-12 shadow-[-24px_0_70px_rgba(20,20,22,0.12)]"
        initial={{ x: reduce ? 0 : "100%" }}
        animate={{ x: 0 }}
        exit={{ x: reduce ? 0 : "100%" }}
        transition={{ duration: reduce ? 0 : 0.38, ease: easeOut }}
      >
        <div className="flex justify-end">
          <IconButton label="Close user details" onClick={onClose}>
            <Icon name="close" size={15} />
          </IconButton>
        </div>
        <div className="mt-12 grid size-18 place-items-center rounded-full bg-hm-text text-[17px] font-[700] text-white">
          {initialsOf(user.name)}
        </div>
        <div id="user-name" className="mt-6 text-[30px] font-[650] tracking-[-0.045em]">
          {user.name}
        </div>
        <div className="mt-2 text-[11px] text-hm-muted">{user.email}</div>
        <div className="mt-6 flex items-center gap-2 text-[9px]">
          <span className="rounded-full bg-hm-field px-[9px] py-1.5">{user.role}</span>
          <StatusBadge tone={user.status === "Active" ? "success" : "danger"}>{user.status}</StatusBadge>
        </div>
        <div className="mt-16 flex flex-col">
          {[
            ["Joined", user.joined],
            ["Orders", String(user.orders)],
            ["Lifetime spend", user.spent],
            ["User ID", `USR-${String(user.id).padStart(5, "0")}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-t border-hm-border py-4 text-[10px]">
              <span className="text-hm-muted">{label}</span>
              <span className="font-[650]">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-12 flex gap-3 max-[760px]:flex-col">
          <Button variant="ghost" size="sm">
            {user.status === "Active" ? "Suspend user" : "Restore user"}
          </Button>
          <Button variant="quiet" size="sm">
            View activity
          </Button>
        </div>
      </motion.aside>
    </motion.div>
  );
}
