import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the HartMart theme tokens so overrides such as
// `rounded-hm-md` -> `rounded-[10px]` resolve correctly.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "hm-background",
        "hm-surface",
        "hm-text",
        "hm-muted",
        "hm-accent",
        "hm-accent-dark",
        "hm-border",
        "hm-field",
        "hm-success",
        "hm-error",
        "hm-error-soft",
      ],
      radius: ["hm-sm", "hm-md"],
    },
  },
});

/** Joins class names and resolves Tailwind conflicts (later classes win). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return twMerge(classes.filter(Boolean).join(" "));
}
