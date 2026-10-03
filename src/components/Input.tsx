import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full rounded-hm-sm border-0 bg-hm-field text-hm-text", className)} {...props} />;
}
