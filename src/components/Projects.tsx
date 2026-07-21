import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import TickMarks from "./TickMarks";
import SheetIndex from "./SheetIndex";
import CaseStudySheet from "./CaseStudySheet";
import { projects } from "../data/projectsData";

export default function Projects() {
  const reduced = useReducedMotion();

  return (
    <section id="projects" className="relative bp-grid py-24 md:py-32">
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
            DRAWING SET — PROJECT INDEX
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            Projects
          </h2>
        </motion.div>

        {/* Part 1 — Sheet Index */}
        <div className="mb-20 md:mb-24">
          <SheetIndex />
        </div>

        {/* Part 2 — Case Study Sheets */}
        <div className="space-y-10 md:space-y-12">
          {projects.map((p, i) => (
            <CaseStudySheet key={p.sheetNo} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
