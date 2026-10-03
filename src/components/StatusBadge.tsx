import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type StatusTone = "success" | "info" | "accent" | "warning" | "danger" | "neutral";

const tones: Record<StatusTone, string> = {
  success: "bg-[#eaf6f0] text-[#267452]",
  info: "bg-[#e9f5f6] text-[#28747b]",
  accent: "bg-[#eeeeff] text-hm-accent",
  warning: "bg-[#fbf4e5] text-[#8a6010]",
  danger: "bg-[#f5eff0] text-[#92525a]",
  neutral: "bg-hm-field text-hm-muted",
};

export default function StatusBadge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-block w-max rounded-full px-[9px] py-1.5 text-[9px] font-[650]", tones[tone], className)}>
      {children}
    </span>
  );
}
