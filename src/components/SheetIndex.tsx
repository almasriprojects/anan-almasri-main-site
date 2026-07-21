import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { projects } from "../data/projectsData";

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

      <ol className="divide-y divide-blueprint-grid/15">
        {projects.map((p, i) => (
          <motion.li
            key={p.sheetNo}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.4,
              delay: i * 0.06,
              ease: "easeOut",
            }}
          >
            <a
              href={`#sheet-${p.sheetNo}`}
              className="group block py-4 md:py-5 transition-colors duration-200"
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
            </a>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
