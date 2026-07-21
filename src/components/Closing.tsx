import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Closing() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bp-grid border-t border-blueprint-grid/15 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative border border-blueprint-grid/20 bg-blueprint-surface/50 p-8 md:p-12"
        >
          <span className="absolute left-0 top-0 h-[2px] w-full bg-blueprint-brass/70" />
          <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-blueprint-brass/50" />
          <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-blueprint-brass/50" />

          <div className="mb-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            END OF DRAWING SET
          </div>
          <h2 className="font-mono text-2xl font-bold text-blueprint-paper sm:text-3xl">
            Let's build something precise.
          </h2>
          <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-blueprint-muted">
            Available for AI automation, full-stack product builds, and systems
            architecture. Based in Miami — working globally.
          </p>
          <a
            href="mailto:hello@example.com"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-blueprint-brass px-5 py-3 font-mono text-[12px] font-semibold tracking-annotation text-blueprint-bg transition-colors duration-200 hover:bg-blueprint-brass/90"
          >
            INITIATE CONTACT
          </a>
        </motion.div>
      </div>
    </section>
  );
}
