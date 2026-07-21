import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="top" className="relative bp-grid overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            <span className="h-px w-8 bg-blueprint-brass/70" />
            DRAWING NO. AA-001 — REV 10
          </div>
          <h1 className="font-mono text-4xl font-bold leading-tight text-blueprint-paper sm:text-5xl md:text-6xl">
            Full-Stack AI Automation Engineer
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-[16px] leading-relaxed text-blueprint-muted md:text-[17px]">
            I design and ship self-hosted AI systems, automation pipelines, and
            production-grade web apps — from schematic to deployed product.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-sm bg-blueprint-brass px-5 py-3 font-mono text-[12px] font-semibold tracking-annotation text-blueprint-bg transition-colors duration-200 hover:bg-blueprint-brass/90"
            >
              VIEW PROJECTS
            </a>
            <a
              href="#experience"
              className="inline-flex items-center gap-2 border border-blueprint-grid/30 px-5 py-3 font-mono text-[12px] font-semibold tracking-annotation text-blueprint-paper transition-colors duration-200 hover:border-blueprint-brass/60"
            >
              REVISION HISTORY
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
