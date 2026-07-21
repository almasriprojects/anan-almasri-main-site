import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { Project } from "../data/projectsData";

const quadrants = [
  { key: "problem", label: "PROBLEM" },
  { key: "solution", label: "SOLUTION" },
  { key: "stack", label: "STACK" },
  { key: "result", label: "RESULT" },
] as const;

type Props = {
  project: Project;
  index: number;
};

export default function CaseStudySheet({ project, index }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      id={`sheet-${project.sheetNo}`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.05, ease: "easeOut" }}
      className="relative scroll-mt-24 border border-blueprint-grid/20 bg-blueprint-surface/50 p-8 md:p-10"
    >
      {/* brass top edge */}
      <span className="absolute left-0 top-0 h-[2px] w-full bg-blueprint-brass/70" />
      {/* corner ticks */}
      <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-blueprint-brass/50" />
      <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-blueprint-brass/50" />

      {/* sheet label + title */}
      <div className="mb-8">
        <div className="mb-2 font-mono text-[11px] tracking-annotation text-blueprint-muted">
          SHEET {project.sheetNo}
        </div>
        <h3 className="font-mono text-2xl font-bold text-blueprint-paper">
          {project.title}
        </h3>
        <div className="mt-1.5 font-mono text-[11px] tracking-annotation text-blueprint-brass/80">
          {project.type}
        </div>
      </div>

      {/* 2x2 quadrant grid — stacks vertically on mobile */}
      <div className="grid grid-cols-1 gap-px bg-blueprint-grid/15 md:grid-cols-2">
        {quadrants.map((q) => (
          <div key={q.key} className="bg-blueprint-bg/40 p-6 md:p-7">
            <div className="mb-3 font-mono text-[10px] tracking-annotation text-blueprint-brass/80">
              {q.label}
            </div>
            <p className="font-sans text-[14px] leading-relaxed text-blueprint-muted">
              {project[q.key]}
            </p>
          </div>
        ))}
      </div>
    </motion.article>
  );
}
