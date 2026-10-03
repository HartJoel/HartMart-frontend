import { Outlet } from "react-router";
import Footer from "@/app/layouts/Footer";
import Header from "@/app/layouts/Header";
import PageTransition from "@/components/PageTransition";

export default function StorefrontLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1440px] px-[clamp(20px,5vw,72px)] pt-8 pb-[100px]">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
