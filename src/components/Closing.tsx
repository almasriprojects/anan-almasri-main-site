import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import TickMarks from "./TickMarks";

export default function Closing() {
  const reduced = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative bp-grid border-t border-blueprint-grid/15 py-28 md:py-36"
    >
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <TickMarks />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            <span className="h-px w-8 bg-blueprint-brass/70" />
            END OF SPEC
            <span className="h-px w-8 bg-blueprint-brass/70" />
          </div>

          <h2 className="font-mono text-3xl font-bold leading-tight text-blueprint-paper sm:text-4xl md:text-5xl">
            Let's draft the next system.
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-sans text-lg text-blueprint-muted">
            If you have a process that should run itself, a stack that should
            scale, or an idea worth engineering — book a consultation and we'll
            map it out.
          </p>

          <div className="mt-10">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 bg-blueprint-brass px-7 py-3.5 font-mono text-sm tracking-annotation text-blueprint-bg transition-all duration-200 hover:bg-[#d8b06a] hover:shadow-[0_0_24px_-4px_rgba(201,161,93,0.5)]"
            >
              Book a Consultation
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>

          <div className="mt-12 font-mono text-[10px] tracking-annotation text-blueprint-muted/60">
            ANAN ALMASRI · MIAMI, FL · 2025
          </div>
        </motion.div>
      </div>
    </section>
  );
}
