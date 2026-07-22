import { motion } from "framer-motion";
import type { Project } from "../../data/projectsData";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Props {
  project: Project;
  index: number;
  total: number;
  active: boolean;
}

/**
 * One full-bleed slide inside the horizontal gallery. Quadrant grid
 * (PROBLEM / SOLUTION / STACK / RESULT) plus tech badges.
 */
export default function ProjectSheet({ project, index, total, active }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      id={`sheet-${project.sheetNo}`}
      className="relative flex h-full w-full shrink-0 flex-col border border-blueprint-grid/20 bg-blueprint-surface/40 p-6 md:p-10"
      animate={{
        opacity: active ? 1 : 0.35,
        scale: active ? 1 : 0.96,
      }}
      transition={{ duration: 0.6, ease: motionTokens.ease }}
    >
      {/* Top brass edge */}
      <span className="absolute left-0 top-0 h-[2px] w-full bg-blueprint-brass/70" />

      {/* Corner ticks */}
      <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-blueprint-brass/50" />
      <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-blueprint-brass/50" />

      {/* Header row: sheet number / type / title */}
      <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
        <span className="text-blueprint-brass">SHEET {project.sheetNo} / {String(total).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-blueprint-grid/20" />
        <span className="text-blueprint-brass/80">{project.type.toUpperCase()}</span>
      </div>

      <h3 className="font-mono text-3xl font-bold leading-tight text-blueprint-paper md:text-5xl">
        {project.title}
      </h3>

      {/* Quadrants */}
      <div className="mt-6 grid flex-1 grid-cols-1 gap-px bg-blueprint-grid/15 md:grid-cols-2">
        <Quadrant label="PROBLEM" body={project.problem} reduced={reduced} delay={0.05} />
        <Quadrant label="SOLUTION" body={project.solution} reduced={reduced} delay={0.12} />
        <Quadrant label="STACK" body={project.stack} reduced={reduced} delay={0.19} />
        <Quadrant label="RESULT" body={project.result} reduced={reduced} delay={0.26} highlight />
      </div>

      {/* Footer: index pill */}
      <div className="mt-6 flex items-center justify-between font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <span>REV 2025.{String(index + 1).padStart(2, "0")}</span>
      </div>
    </motion.article>
  );
}

function Quadrant({
  label,
  body,
  highlight = false,
  reduced,
  delay,
}: {
  label: string;
  body: string;
  highlight?: boolean;
  reduced: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: motionTokens.dur.base, delay, ease: motionTokens.ease }}
      className="flex flex-col gap-3 bg-blueprint-bg/50 p-5 md:p-6"
    >
      <div className="font-mono text-[10px] tracking-annotation text-blueprint-brass/80">
        {label}
      </div>
      <p
        className={`font-sans text-[13px] leading-relaxed md:text-[14px] ${
          highlight ? "text-blueprint-paper/90" : "text-blueprint-muted"
        }`}
      >
        {body}
      </p>
    </motion.div>
  );
}
