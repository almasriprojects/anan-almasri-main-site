import { useState } from "react";
import Demo from "./routes/demo";
import MarketingSite from "./components/MarketingSite";

/**
 * Tiny path-based router — zero deps.
 *
 *   `/`         → Blueprint Eternity demo (the public homepage)
 *   `/demo`     → same experience, preserved for the in-page "back to /" link
 *   `/legacy`   → original marketing landing (kept so older links still work)
 *
 * Everything else (including the dashboard route tree) falls through to
 * the marketing site so previously-shared URLs don't dead-end.
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

  return <MarketingSite />;
}
