import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { Project } from "../data/projectsData";
import { motionTokens } from "../lib/motion";
import DrawCorners from "./motion/DrawCorners";

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

const quadrantContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const quadrantItem: Variants = {
  hidden: { opacity: 0, y: motionTokens.y.small },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.dur.base, ease: motionTokens.ease },
  },
};

export default function CaseStudySheet({ project, index }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      id={`sheet-${project.sheetNo}`}
      initial={
        reduced
          ? false
          : { opacity: 0, y: motionTokens.y.large, scale: 0.98 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: motionTokens.dur.slow,
        delay: (index % 2) * 0.05,
        ease: motionTokens.ease,
      }}
      whileHover={
        reduced
          ? undefined
          : { y: -3, boxShadow: "0 0 0 1px rgba(201,161,93,0.25), 0 18px 50px -20px rgba(0,0,0,0.6)" }
      }
      className="relative scroll-mt-24 border border-blueprint-grid/20 bg-blueprint-surface/50 p-8 md:p-10"
    >
      {/* brass top edge */}
      <motion.span
        aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: motionTokens.dur.slow,
          ease: motionTokens.ease,
        }}
        style={{ transformOrigin: "left center" }}
        className="absolute left-0 top-0 h-[2px] w-full bg-blueprint-brass/70"
      />

      {/* Animated brass corner ticks (draw in on enter) */}
      <DrawCorners position="tr-bl" delay={0.2} size={18} />

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

      {/* 2x2 quadrant grid — stacks vertically on mobile. Each quadrant reveals in turn. */}
      <motion.div
        variants={reduced ? undefined : quadrantContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-px bg-blueprint-grid/15 md:grid-cols-2"
      >
        {quadrants.map((q) => (
          <motion.div
            key={q.key}
            variants={reduced ? undefined : quadrantItem}
            className="bg-blueprint-bg/40 p-6 md:p-7"
          >
            <div className="mb-3 font-mono text-[10px] tracking-annotation text-blueprint-brass/80">
              {q.label}
            </div>
            <p className="font-sans text-[14px] leading-relaxed text-blueprint-muted">
              {project[q.key]}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.article>
  );
}
