import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { fadeUp } from "../../lib/motion";

/**
 * Standard section-entry wrapper. Applies the shared fade-up
 * with `whileInView` + `viewport={{ once: true }}` so the
 * animation only fires when the section first enters view.
 */
export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  y,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Override the default y-translation. */
  y?: number;
}) {
  const reduced = useReducedMotion();
  const preset = fadeUp(reduced);
  const extra: MotionProps = y !== undefined
    ? {
        initial: reduced ? false : { opacity: 0, y },
        whileInView: { opacity: 1, y: 0 },
        viewport: preset.viewport,
        transition: { ...preset.transition, delay },
      }
    : {
        transition: { ...preset.transition, delay },
      };

  return (
    <motion.div
      {...preset}
      {...extra}
      className={className}
    >
      {children}
    </motion.div>
  );
}
