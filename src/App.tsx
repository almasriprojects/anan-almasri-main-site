import { useState } from "react";
import { RouterProvider } from "@tanstack/react-router";
import Demo from "./routes/demo";
import MarketingSite from "./components/MarketingSite";
import { router } from "./router";

/**
 * Tiny path-based router — zero deps.
 *
 *   `/`         → Blueprint Eternity demo (the public homepage)
 *   `/demo`     → same experience, preserved for the in-page "back to /" link
 *   `/legacy`   → original marketing landing (kept so older links still work)
 *
 * Everything else — in practice, the `/dashboard/*` tree — is handed off to
 * the real TanStack Router instance (see src/router.tsx), which owns the
 * admin dashboard (AnanOS shell + CRM/Accounting/HRM/etc.) and gates it on
 * a valid session (src/routes/__root.tsx).
 */
function usePath() {
  const [path, setPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );
  if (typeof window !== "undefined") {
    window.addEventListener("popstate", () => setPath(window.location.pathname));
  }
  return path;
}

export default function App() {
  const path = usePath();
  const normalized = path.replace(/\/+$/, "") || "/";

  if (normalized === "/demo" || normalized === "/") {
    return <Demo />;
  }

  if (normalized === "/legacy") {
    return <MarketingSite />;
  }

  return <RouterProvider router={router} />;
}
