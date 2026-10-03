import { Outlet } from "react-router";
import PageTransition from "@/components/PageTransition";

/** Routes that render their own full-page chrome (auth, payment callback, 404). */
export default function StandaloneLayout() {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
}
