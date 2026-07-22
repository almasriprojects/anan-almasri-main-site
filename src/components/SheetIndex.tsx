import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { projects } from "../data/projectsData";
import { motionTokens } from "../lib/motion";
import { StaggerGroup, StaggerItem } from "./motion/StaggerGroup";

export default function SheetIndex() {
  const reduced = useReducedMotion();

  return (
    <div className="border-t border-blueprint-grid/20">
      {/* column header — desktop only */}
      <div className="hidden md:grid grid-cols-[100px_1fr_220px] gap-6 border-b border-blueprint-grid/20 py-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
        <span>SHEET NO.</span>
        <span>TITLE</span>
        <span>TYPE</span>
      </div>

      <StaggerGroup
        as="ol"
        staggerChildren={0.05}
        delayChildren={0.05}
        className="divide-y divide-blueprint-grid/15"
      >
        {projects.map((p) => (
          <StaggerItem key={p.sheetNo} as="li" className="">
            <motion.a
              href={`#sheet-${p.sheetNo}`}
              whileHover={
                reduced
                  ? undefined
                  : { x: 4, backgroundColor: "rgba(201,161,93,0.05)" }
              }
              transition={{ duration: motionTokens.dur.fast, ease: motionTokens.ease }}
              className="group block py-4 md:py-5"
            >
              {/* desktop row */}
              <div className="hidden md:grid grid-cols-[100px_1fr_220px] gap-6 items-baseline">
                <span className="font-mono text-[13px] font-semibold text-blueprint-brass">
                  {p.sheetNo}
                </span>
                <span className="font-mono text-[15px] font-semibold text-blueprint-paper transition-colors duration-200 group-hover:text-blueprint-brass">
                  {p.title}
                </span>
                <span className="font-mono text-[11px] tracking-annotation text-blueprint-muted">
                  {p.type}
                </span>
              </div>

              {/* mobile row */}
              <div className="md:hidden flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-semibold text-blueprint-brass">
                    {p.sheetNo}
                  </span>
                  <span className="font-mono text-[15px] font-semibold text-blueprint-paper transition-colors duration-200 group-hover:text-blueprint-brass">
                    {p.title}
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-annotation text-blueprint-muted text-right">
                  {p.type}
                </span>
              </div>
            </motion.a>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
