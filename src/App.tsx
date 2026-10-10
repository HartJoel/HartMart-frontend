import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { RouterProvider } from "react-router";
import AppProviders from "@/app/providers/AppProviders";
import { router } from "@/app/router";

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights/>
    </AppProviders>
  );
}
