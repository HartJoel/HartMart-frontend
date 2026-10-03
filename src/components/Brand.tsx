import { Link } from "react-router";
import { cn } from "@/lib/cn";

type BrandProps = {
  /** Renders the brand as a link to this path. */
  to?: string;
  /** `dark` = dark mark on light surfaces, `light` = white mark on dark sidebars. */
  tone?: "dark" | "light";
  size?: "md" | "sm";
  subtitle?: string;
  className?: string;
};

export default function Brand({ to, tone = "dark", size = "md", subtitle, className }: BrandProps) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "grid place-items-center font-[700]",
          size === "md" ? "size-8 rounded-[10px] text-[13px]" : "size-[30px] rounded-[9px] text-[12px] font-[750]",
          tone === "dark" ? "bg-hm-text text-hm-surface" : "bg-white text-hm-text",
        )}
      >
        H
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "leading-none font-[750]",
            size === "md" ? "text-[20px]" : "text-[18px] tracking-[-0.04em]",
          )}
        >
          HartMart
        </span>
        {subtitle && (
          <span className="mt-0.5 text-[7px] font-[750] tracking-[0.16em] text-[#6e6e76]">{subtitle}</span>
        )}
      </span>
    </>
  );

  const rootClass = cn("flex items-center gap-3", className);
  return to ? (
    <Link to={to} className={cn(rootClass, "text-hm-text no-underline")}>
      {content}
    </Link>
  ) : (
    <div className={rootClass}>{content}</div>
  );
}
