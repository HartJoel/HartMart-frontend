import { useEffect, useRef, type RefObject } from "react";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Open dialogs, in the order they opened. Only the top one reacts to keys, so a modal opened from a drawer closes alone.
const openDialogs: HTMLElement[] = [];

/**
 * Keyboard behaviour for a modal or drawer: focus moves inside on open, Tab cannot leave
 * the dialog, Escape closes it, and focus returns to the trigger when it closes.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    openDialogs.push(dialog);
    (dialog.querySelector<HTMLElement>(focusableSelector) ?? dialog).focus();

    function onKeyDown(event: KeyboardEvent) {
      if (openDialogs[openDialogs.length - 1] !== dialog) return;

      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = Array.from(dialog!.querySelectorAll<HTMLElement>(focusableSelector));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      openDialogs.splice(openDialogs.indexOf(dialog), 1);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [ref]);
}
