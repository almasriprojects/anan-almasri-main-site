import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { motionTokens } from "../../lib/motion";

/**
 * Brass corner-ticks (top-right and bottom-left by default) that
 * draw in with a stroke-dashoffset animation as the parent enters view.
 *
 * Each tick is an L-shape: two short segments meeting at a corner.
 */
export default function DrawCorners({
  size = 14,
  color = "rgba(201,161,93,0.85)",
  thickness = 1,
  position = "tr-bl",
  delay = 0,
  className = "",
}: {
  size?: number;
  color?: string;
  thickness?: number;
  position?: "tr-bl" | "br-tl" | "all";
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const drawTransition = (extraDelay: number) => ({
    duration: motionTokens.dur.base,
    delay: delay + extraDelay,
    ease: motionTokens.ease,
  });

  // Convert pixel size to percentage-based SVG coords (size is small so we
  // approximate: 1px ≈ 0.5% in a 200px-tall box). Use a viewBox-relative approach.
  const viewSize = 100; // viewBox is 100x100
  const half = size; // size in viewBox units

  // Top-right corner
  const tr = `M ${viewSize - half} ${half * 0.1} L ${viewSize - half} ${half} L ${viewSize - half * 0.1} ${half}`;
  // Bottom-left corner
  const bl = `M ${half * 0.1} ${viewSize - half} L ${half} ${viewSize - half} L ${half} ${viewSize - half * 0.1}`;
  // Top-left corner
  const tl = `M ${half * 0.1} ${half} L ${half} ${half} L ${half} ${half * 0.1}`;
  // Bottom-right corner
  const br = `M ${viewSize - half * 0.1} ${viewSize - half} L ${viewSize - half} ${viewSize - half} L ${viewSize - half} ${viewSize - half * 0.1}`;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {(position === "tr-bl" || position === "all") && (
        <motion.path
          d={tr}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={drawTransition(0)}
        />
      )}
      {(position === "tr-bl" || position === "all") && (
        <motion.path
          d={bl}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={drawTransition(0.12)}
        />
      )}
      {(position === "br-tl" || position === "all") && (
        <motion.path
          d={tl}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={drawTransition(0)}
        />
      )}
      {(position === "br-tl" || position === "all") && (
        <motion.path
          d={br}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={drawTransition(0.12)}
        />
      )}
    </svg>
  );
}
