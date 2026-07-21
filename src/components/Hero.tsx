import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useBookCall } from "./BookCallModal/context";
import Schematic from "./Schematic";
import TickMarks from "./TickMarks";


function BookCallButton() {
  const { openBookCall } = useBookCall();
  return (
    <button
      type="button"
      onClick={openBookCall}
      className="group inline-flex items-center gap-2 bg-blueprint-brass px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-bg transition-all duration-200 hover:bg-[#d8b06a] hover:shadow-[0_0_24px_-4px_rgba(201,161,93,0.5)]"
    >
      Book a Consultation
      <ArrowUpRight
        size={16}
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="home"
      className="relative bp-grid overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* corner ticks for the section */}
        <TickMarks className="hidden md:block" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Left: title block */}
          <div className="relative">
            <motion.div {...fadeUp(0.05)}>
              <div className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
                <span className="h-px w-8 bg-blueprint-brass/70" />
                SYSTEM SPEC — AUTOMATION ENGINEER — MIAMI, FL
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp(0.15)}
              className="font-mono text-4xl font-bold leading-[1.08] text-blueprint-paper sm:text-5xl lg:text-6xl"
            >
              I design systems.
              <br />
              <span className="text-blueprint-brass">Now they're digital.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.3)}
              className="mt-7 max-w-xl font-sans text-lg leading-relaxed text-blueprint-muted"
            >
              I'm Anan Almasri — a full-stack AI automation engineer building
              automated AI infrastructure end to end: n8n workflows, Supabase
              backends, and self-hosted AI agents that run without babysitting.
            </motion.p>

            <motion.div
              {...fadeUp(0.45)}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <BookCallButton />
              <a
                href="/AnanAlmasri.pdf"
                className="inline-flex items-center gap-2 border border-blueprint-grid/40 px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-paper transition-colors duration-200 hover:border-blueprint-paper/70"
                target="_blank"
                rel="noreferrer"
                download
              >
                <Download size={15} />
                Download Resume
              </a>
            </motion.div>

            {/* small coordinate label near bottom edge */}
            <motion.div
              {...fadeUp(0.6)}
              className="mt-12 font-mono text-[10px] tracking-annotation text-blueprint-muted/60"
            >
              25.7617° N · 80.1918° W
            </motion.div>
          </div>

          {/* Right: schematic */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-lg border border-blueprint-grid/15 bg-blueprint-surface/40 p-5 md:p-7"
          >
            <TickMarks />
            <Schematic />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
