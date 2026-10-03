import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

/**
 * Every page change starts at the top, including back and forward navigation.
 * Manual scroll restoration stops the browser from restoring the old position
 * after the new page has rendered.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
