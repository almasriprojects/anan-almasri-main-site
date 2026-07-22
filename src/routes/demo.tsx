import { BookCallProvider } from "../components/BookCallModal/context";
import DemoShell from "../components/demo/DemoShell";

/**
 * /demo route — a runnable single-page preview of what the production landing
 * page could feel like at Awwwards-tier execution. The production page at /
 * is untouched.
 */
export default function Demo() {
  return (
    <BookCallProvider>
      <DemoShell />
    </BookCallProvider>
  );
}
