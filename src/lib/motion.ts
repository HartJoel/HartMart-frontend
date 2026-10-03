import { useReducedMotion, type Transition, type Variants } from "framer-motion";

/** Single easing curve for the whole app, so every movement feels like it came from one system. */
export const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Shared motion presets. Under prefers-reduced-motion every preset becomes an
 * instant state change (duration 0, no travel), never a slower version.
 */
export function useMotionPresets() {
  const reduce = useReducedMotion() ?? false;
  const timing = (seconds: number): Transition => ({ duration: reduce ? 0 : seconds, ease: easeOut });

  return {
    reduce,
    /** Parent variants that stagger children in, so a group of elements reads as one moment. */
    group: {
      hidden: {},
      visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
    } satisfies Variants,
    /** Fade with a small upward settle. */
    rise: {
      hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0, transition: timing(0.4) },
      exit: { opacity: 0, transition: { duration: reduce ? 0 : 0.14 } },
    } satisfies Variants,
    /** Scale-in with a light spring, for icons and status marks. */
    pop: {
      hidden: reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 22 },
      },
    } satisfies Variants,
  };
}
