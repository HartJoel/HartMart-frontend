import { Outlet } from "react-router";
import Brand from "@/components/Brand";
import PageTransition from "@/components/PageTransition";

/** Single-column flow for checkout and onboarding: brand at the top, no storefront chrome. */
export default function FocusedLayout() {
  return (
    <main className="mx-auto max-w-[900px] px-6 pt-[34px] pb-[100px]">
      <Brand to="/" className="mb-[50px]" />
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
  );
}
