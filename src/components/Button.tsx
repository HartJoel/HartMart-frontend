import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "quiet" | "link";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "min-h-[42px] px-4 rounded-hm-sm text-[10px] font-[650]",
  md: "min-h-12 px-5 rounded-hm-sm text-[12px] font-[700]",
  lg: "w-full min-h-[52px] px-5 rounded-hm-sm text-[14px] font-[650]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-hm-accent text-white transition-[transform,background-color] duration-200 not-disabled:hover:-translate-y-0.5 not-disabled:hover:bg-hm-accent-dark not-disabled:active:translate-y-0 not-disabled:active:scale-[0.98] disabled:bg-[#ccc]",
  ghost: "bg-transparent text-hm-accent transition-colors duration-200 not-disabled:hover:bg-[#eeeeff]",
  quiet: "bg-hm-field text-hm-muted",
  link: "min-h-0 px-0 rounded-none bg-transparent text-[13px] font-[600] text-hm-accent underline-offset-[3px] hover:underline",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap border-0 cursor-pointer no-underline",
    sizes[size],
    variants[variant],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
