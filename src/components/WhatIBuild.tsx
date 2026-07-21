import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import TickMarks from "./TickMarks";

const panels = [
  {
    index: "01",
    title: "AI Automation",
    body: "Event-driven n8n workflows that connect triggers, AI agents, and APIs into reliable pipelines — replacing repetitive ops work with systems that run themselves.",
  },
  {
    index: "02",
    title: "Full-Stack Systems",
    body: "Supabase-backed applications with typed APIs, auth, and row-level security — production architectures that scale from prototype to real users without rewrites.",
  },
  {
    index: "03",
    title: "Self-Hosted Infrastructure",
    body: "Self-hosted AI agents and tooling deployed on your own hardware — keeping data, models, and compute under your control instead of a third-party's.",
  },
];

export default function WhatIBuild() {
  const reduced = useReducedMotion();

  return (
    <section id="services" className="relative bp-grid py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <TickMarks />

        {/* section header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            <span className="h-px w-8 bg-blueprint-brass/70" />
            SECTION 02 — CAPABILITIES
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            What I Build
          </h2>
        </motion.div>

        <div className="grid gap-px bg-blueprint-grid/15 md:grid-cols-3">
          {panels.map((p, i) => (
            <motion.article
              key={p.index}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="group relative bg-blueprint-bg p-8 md:p-10"
            >
              {/* brass edge accent — brightens on hover */}
              <span className="absolute left-0 top-0 h-full w-[2px] bg-blueprint-brass/25 transition-colors duration-300 group-hover:bg-blueprint-brass" />

              {/* index label */}
              <div className="mb-8 font-mono text-[11px] tracking-annotation text-blueprint-muted">
                <span className="text-blueprint-brass">{p.index}</span>
                <span className="mx-2 text-blueprint-grid/50">/</span>
                <span>03</span>
              </div>

              <h3 className="font-mono text-xl font-semibold text-blueprint-paper">
                {p.title}
              </h3>
              <p className="mt-4 font-sans text-[15px] leading-relaxed text-blueprint-muted">
                {p.body}
              </p>

              {/* corner tick on each panel */}
              <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-blueprint-grid/30 transition-colors duration-300 group-hover:border-blueprint-brass/60" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
