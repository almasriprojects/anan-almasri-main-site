import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import AdminLoginModal from "../AdminLoginModal";
import Experience from "../Experience";
import Closing from "../Closing";
import PlottingHero from "./PlottingHero";
import DrawingInspector from "./DrawingInspector";
import SectionRail from "./SectionRail";
import AnimatedSystemDiagram from "./AnimatedSystemDiagram";
import HorizontalGallery from "./HorizontalGallery";
import ChatPanel from "./ChatPanel";

/**
 * Demo page shell — also the public homepage. Holds:
 *  - the plotting-grid background that draws in over 1.5s on load
 *  - the DrawingInspector (right-margin sticky)
 *  - a top progress hairline
 *  - the SectionRail (right-edge per-section guide — the page's nav)
 *  - mounts the demo sections (PlottingHero → Closing)
 */
export default function DemoShell() {
  const [progress, setProgress] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
      <SectionRail />
      <AdminLoginModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      <a
        href="#top"
        aria-label="Anan Almasri — home"
        className="fixed left-4 top-4 z-40 font-mono text-sm font-semibold tracking-widest text-blueprint-paper/90 transition-colors hover:text-blueprint-brass"
      >
        <span className="text-blueprint-grid/60">[</span> AA <span className="text-blueprint-grid/60">]</span>
      </a>

      <button
        type="button"
        onClick={() => setIsAdminOpen(true)}
        className="fixed right-4 top-4 z-40 border border-blueprint-brass/50 px-3 py-1.5 font-mono text-[11px] tracking-annotation text-blueprint-brass backdrop-blur-sm transition-colors hover:bg-blueprint-brass/10 hover:border-blueprint-brass"
      >
        Admin
      </button>

      <main className="relative">
        <PlottingHero />
        <AnimatedSystemDiagram />
        <Experience />
        <HorizontalGallery />
        <ChatPanel />
        <Closing />
      </main>

      <FooterHint sprint={6} onAdminClick={() => setIsAdminOpen(true)} />
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

function FooterHint({ sprint, onAdminClick }: { sprint: number; onAdminClick: () => void }) {
  return (
    <footer className="relative z-10 border-t border-blueprint-grid/15 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 font-mono text-[10px] tracking-annotation text-blueprint-muted/60 md:flex-row md:px-10">
        <span>© 2026 — ANAN ALMASRI · BLUEPRINT ETERNITY</span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 animate-pulse rounded-full bg-blueprint-brass" />
          SPRINT {sprint} / 6 BUILT · LIVE
        </span>
        <span className="flex items-center gap-4">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blueprint-muted/80 underline decoration-blueprint-grid/40 underline-offset-2 hover:text-blueprint-brass"
          >
            download résumé →
          </a>
          <a
            href="/legacy"
            className="text-blueprint-muted/80 underline decoration-blueprint-grid/40 underline-offset-2 hover:text-blueprint-brass"
          >
            legacy site →
          </a>
          <button
            type="button"
            onClick={onAdminClick}
            className="text-blueprint-muted/80 underline decoration-blueprint-grid/40 underline-offset-2 hover:text-blueprint-brass"
          >
            admin
          </button>
        </span>
      </div>
    </footer>
  );
}
