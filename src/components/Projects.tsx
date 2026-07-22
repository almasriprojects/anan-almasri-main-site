import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import TickMarks from "./TickMarks";
import SheetIndex from "./SheetIndex";
import CaseStudySheet from "./CaseStudySheet";
import { projects } from "../data/projectsData";
import { motionTokens } from "../lib/motion";
import { StaggerGroup, StaggerItem } from "./motion/StaggerGroup";

export default function Projects() {
  const reduced = useReducedMotion();

  return (
    <section id="projects" className="relative bp-grid py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <TickMarks />

        {/* section header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: motionTokens.y.base }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            <motion.span
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: motionTokens.dur.base,
                delay: 0.1,
                ease: motionTokens.ease,
              }}
              style={{ transformOrigin: "left center" }}
              className="h-px w-8 bg-blueprint-brass/70"
            />
            DRAWING SET — PROJECT INDEX
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            Projects
          </h2>
        </motion.div>

        {/* Part 1 — Sheet Index (slide-in cascade) */}
        <div className="mb-20 md:mb-24">
          <SheetIndex />
        </div>

        {/* Part 2 — Case Study Sheets (stagger reveal) */}
        <StaggerGroup
          as="div"
          staggerChildren={0.15}
          delayChildren={0.05}
          className="space-y-10 md:space-y-12"
        >
          {projects.map((p, i) => (
            <StaggerItem key={p.sheetNo} as="div">
              <CaseStudySheet project={p} index={i} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
