import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { motionTokens, fadeUp } from "../lib/motion";

const items = [
  {
    label: "AI AUTOMATION",
    desc: "n8n workflows, agentic systems, and Claude-powered pipelines that replace manual ops.",
  },
  {
    label: "FULL-STACK APPS",
    desc: "React + TypeScript frontends on Supabase backends, shipped to production.",
  },
  {
    label: "BUSINESS OS",
    desc: "All-in-one platforms bundling CRM, accounting, and operations into one system.",
  },
];

export default function WhatIBuild() {
  const reduced = useReducedMotion();

  return (
    <section
      id="whatibuild"
      className="relative border-t border-blueprint-grid/15 bg-blueprint-surface/30 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          {...fadeUp(reduced)}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            <span className="h-px w-8 bg-blueprint-brass/70" />
            SCOPE OF WORK
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            What I Build
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 gap-px border-t border-l border-blueprint-grid/20 bg-blueprint-grid/10 md:grid-cols-3"
          style={{ perspective: "1200px" }}
        >
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={
                reduced
                  ? false
                  : { opacity: 0, y: motionTokens.y.base, rotateX: -18 }
              }
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: motionTokens.dur.slow,
                delay: i * motionTokens.stagger.loose,
                ease: motionTokens.ease,
              }}
              whileHover={
                reduced
                  ? undefined
                  : { y: -4, boxShadow: "0 0 0 1px rgba(201,161,93,0.35), 0 12px 40px -10px rgba(201,161,93,0.25)" }
              }
              style={{ transformStyle: "preserve-3d" }}
              className="group relative border-b border-r border-blueprint-grid/20 bg-blueprint-bg/40 p-8 md:p-10"
            >
              <span className="absolute left-0 top-0 h-px w-10 bg-blueprint-brass/60 transition-all duration-500 group-hover:w-20" />
              <div className="mb-3 font-mono text-[11px] tracking-annotation text-blueprint-brass/80">
                {it.label}
              </div>
              <p className="font-sans text-[14px] leading-relaxed text-blueprint-muted">
                {it.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
