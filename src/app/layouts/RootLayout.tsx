import { Outlet } from "react-router";
import ScrollToTop from "@/app/ScrollToTop";

/** Top-level route element: applies app-wide route behaviour to every page. */
export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
