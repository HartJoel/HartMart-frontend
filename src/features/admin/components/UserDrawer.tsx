import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import StatusBadge from "@/components/StatusBadge";
import { useUser } from "@/features/admin/api";
import { getInitials } from "@/lib/format";
import { easeOut, useMotionPresets } from "@/lib/motion";

type UserDrawerProps = {
  userId: string;
  onClose: () => void;
};

export default function UserDrawer({ userId, onClose }: UserDrawerProps) {
  const { reduce } = useMotionPresets();
  const { data: user, isPending, isError } = useUser(userId);

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

        {isPending ? (
          <div className="mt-12 grid gap-6">
            <div className="size-18 animate-pulse rounded-full bg-hm-field" />
            <div className="h-6 w-2/3 animate-pulse rounded-hm-sm bg-hm-field" />
            <div className="h-40 animate-pulse rounded-hm-md bg-hm-field" />
          </div>
        ) : isError || !user ? (
          <p className="mt-12 text-[12px] text-hm-muted">Couldn&apos;t load this user. Close and try again.</p>
        ) : (
          <>
            <div className="mt-12 grid size-18 place-items-center overflow-hidden rounded-full bg-hm-text text-[17px] font-[700] text-white">
              {user.avatar ? (
                <img src={user.avatar.url} alt="" className="size-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div id="user-name" className="mt-6 text-[30px] font-[650] tracking-[-0.045em]">
              {user.name}
            </div>
            <div className="mt-2 text-[11px] text-hm-muted">{user.email}</div>
            <div className="mt-6 flex items-center gap-2 text-[9px]">
              <span className="rounded-full bg-hm-field px-[9px] py-1.5 capitalize">{user.role.toLowerCase()}</span>
              <StatusBadge tone={user.status === "ACTIVE" ? "success" : "danger"} className="capitalize">
                {user.status.toLowerCase()}
              </StatusBadge>
            </div>
            <div className="mt-16 flex flex-col">
              {[
                ["Email verified", user.emailVerified ? "Yes" : "No"],
                ["User ID", user.id],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-t border-hm-border py-4 text-[10px]">
                  <span className="text-hm-muted">{label}</span>
                  <span className="truncate font-[650]">{value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.aside>
    </motion.div>
  );
}
