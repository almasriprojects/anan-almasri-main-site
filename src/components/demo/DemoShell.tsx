import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import PlottingHero from "./PlottingHero";
import DrawingInspector from "./DrawingInspector";
import AnimatedSystemDiagram from "./AnimatedSystemDiagram";
import HorizontalGallery from "./HorizontalGallery";
import ChatPanel from "./ChatPanel";

/**
 * Demo page shell — also the public homepage. Holds:
 *  - the plotting-grid background that draws in over 1.5s on load
 *  - the DrawingInspector (right-margin sticky)
 *  - a top progress hairline
 *  - a floating "legacy site" link for visitors who want the
 *    original marketing layout (preserved at /legacy)
 *  - mounts the six demo sections (PlottingHero → ChatPanel)
 */
export default function DemoShell() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-blueprint-bg text-blueprint-paper">
      <PlottingGrid />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-blueprint-brass/80"
        style={{ scaleX: progress }}
      />

      <DrawingInspector />

      <a
        href="/legacy"
        className="fixed left-4 top-4 z-40 inline-flex items-center gap-2 border border-blueprint-grid/25 bg-blueprint-surface/70 px-3 py-1.5 font-mono text-[10px] tracking-annotation text-blueprint-muted backdrop-blur-sm transition-colors hover:border-blueprint-brass/60 hover:text-blueprint-paper"
      >
        ← LEGACY SITE
      </a>
      <a
        href="/demo#chat"
        aria-label="Next sheet (chat)"
        className="group fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 select-none flex-col items-center gap-3 border border-blueprint-grid/20 bg-blueprint-surface/70 px-1.5 py-4 font-mono text-[10px] tracking-annotation text-blueprint-muted backdrop-blur-sm transition-colors hover:border-blueprint-brass/60 hover:text-blueprint-paper md:flex"
      >
        <span className="[writing-mode:vertical-rl] rotate-180 text-blueprint-muted/80 group-hover:text-blueprint-brass">
          NEXT SHEET
        </span>
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-blueprint-brass" />
        <span aria-hidden="true" className="text-blueprint-muted group-hover:text-blueprint-brass">↓</span>
      </a>

      <main className="relative">
        <PlottingHero />
        <AnimatedSystemDiagram />
        <HorizontalGallery />
        <ChatPanel />
      </main>

      <FooterHint sprint={6} />
    </div>
  );
}

function PlottingGrid() {
  const reduced = useReducedMotion();
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(110,147,183,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(110,147,183,0.10) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          animation: reduced
            ? "none"
            : `plotIn ${motionTokens.plot.grid}s ease-out forwards`,
          clipPath: reduced ? "none" : "inset(0 100% 0 0)",
        }}
      />
      <style>{`
        @keyframes plotIn {
          to { clip-path: inset(0 0 0 0); }
        }
      `}</style>
    </>
  );
}

function FooterHint({ sprint }: { sprint: number }) {
  return (
    <footer className="relative z-10 border-t border-blueprint-grid/15 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 font-mono text-[10px] tracking-annotation text-blueprint-muted/60 md:flex-row md:px-10">
        <span>© 2026 — ANAN ALMASRI · BLUEPRINT ETERNITY</span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 animate-pulse rounded-full bg-blueprint-brass" />
          SPRINT {sprint} / 6 BUILT · LIVE
        </span>
        <a
          href="/legacy"
          className="text-blueprint-muted/80 underline decoration-blueprint-grid/40 underline-offset-2 hover:text-blueprint-brass"
        >
          legacy site →
        </a>
      </div>
    </footer>
  );
}
