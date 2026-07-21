import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Props = {
  className?: string;
  size?: number;
  color?: string;
};

/**
 * Registration/crop-mark style corner ticks for a technical-drawing motif.
 * Renders top-left and bottom-right ticks within its bounding container.
 */
export default function TickMarks({
  className = "",
  size = 14,
  color = "#6E93B7",
}: Props) {
  const reduced = useReducedMotion();
  const lineProps = {
    stroke: color,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <motion.svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-hidden="true"
    >
      {/* Top-left tick */}
      <line x1={0} y1={size} x2={size} y2={size} {...lineProps} />
      <line x1={size} y1={0} x2={size} y2={size} {...lineProps} />

      {/* Bottom-right tick */}
      <line
        x1="100%"
        y1="100%"
        x2={`calc(100% - ${size}px)`}
        y2="100%"
        {...lineProps}
      />
      <line
        x1="100%"
        y1="100%"
        x2="100%"
        y2={`calc(100% - ${size}px)`}
        {...lineProps}
      />
    </motion.svg>
  );
}
