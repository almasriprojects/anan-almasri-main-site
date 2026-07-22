import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * A thin brass line that sits just under the fixed navbar and scales
 * from 0 → 1 as the user scrolls through the page.
 */
export default function ScrollProgressBar({
  height = 2,
  color = "linear-gradient(90deg, rgba(201,161,93,0.0), rgba(201,161,93,0.95) 20%, rgba(201,161,93,0.95) 80%, rgba(201,161,93,0.0))",
}: {
  height?: number;
  color?: string;
}) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.4,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        height,
        background: color,
      }}
      className="pointer-events-none fixed inset-x-0 top-9 z-[60] lg:top-10"
    />
  );
}
