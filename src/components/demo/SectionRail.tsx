import { motion } from "framer-motion";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { motionTokens } from "../../lib/motion";

const SECTIONS = [
  { label: "HOME", href: "#top" },
  { label: "STACK", href: "#stack" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CHAT", href: "#chat" },
  { label: "CONTACT", href: "#contact" },
];

/**
 * Right-edge per-section guide — the primary navigation for the demo
 * homepage, replacing a conventional top navbar. Sits above
 * DrawingInspector on the same edge so the two panels stack without
 * overlapping.
 */
export default function SectionRail() {
  const reduced = useReducedMotion();
  const active = useActiveSection(SECTIONS.map((s) => s.href.slice(1)));

  return (
    <motion.nav
      aria-label="Section navigation"
      initial={reduced ? false : { opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: motionTokens.dur.base, delay: 0.6, ease: motionTokens.ease }}
      className="fixed right-4 top-[28%] z-30 hidden select-none flex-col items-end gap-2.5 lg:flex"
    >
      {SECTIONS.map((s) => {
        const id = s.href.slice(1);
        const isActive = active === id;
        return (
          <a
            key={s.href}
            href={s.href}
            className="group flex items-center gap-2.5 font-mono text-[10px] tracking-annotation"
          >
            <span
              className={`transition-colors duration-200 ${
                isActive
                  ? "text-blueprint-brass"
                  : "text-blueprint-muted/50 group-hover:text-blueprint-paper"
              }`}
            >
              {s.label}
            </span>
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full border transition-colors duration-200 ${
                isActive
                  ? "border-blueprint-brass bg-blueprint-brass"
                  : "border-blueprint-grid/40 bg-transparent group-hover:border-blueprint-paper/60"
              }`}
            />
          </a>
        );
      })}
    </motion.nav>
  );
}
