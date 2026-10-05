import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/cn";

export const tableHeadCell = "px-6 py-4 text-left text-[8px] font-[700] tracking-[0.07em] uppercase text-hm-muted";
export const tableCell = "h-[70px] border-t border-hm-border px-6 py-3 text-[10px] text-hm-muted";

type DataTableProps = {
  children: ReactNode;
  minWidth?: number;
  className?: string;
};

/**
 * The table fades in once as a block, not row by row, so large datasets stay calm.
 * Rows get a token-coloured hover tint for every table that uses this component.
 */
export default function DataTable({ children, minWidth = 760, className }: DataTableProps) {
  return (
    <Reveal>
      <div className={cn("w-full overflow-x-auto rounded-hm-md bg-hm-surface", className)}>
        <table className="w-full border-collapse [&_tbody_tr]:transition-colors [&_tbody_tr]:duration-200 [&_tbody_tr:hover]:bg-hm-background" style={{ minWidth }}>
          {children}
        </table>
      </div>
    </Reveal>
  );
}
