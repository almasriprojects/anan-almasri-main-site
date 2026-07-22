import { motion, useTransform, type MotionValue } from "framer-motion";

interface Props {
  /** Animated progress 0..1 — drives cursor position along the trace path. */
  progress: MotionValue<number>;
  /** Width of the trace canvas in px. */
  width: number;
  /** Height of the trace canvas in px. */
  height: number;
}

/**
 * A brass drafting cursor that traces along a horizontal baseline.
 * SVG; positioned via the parent's `progress` motion value.
 * Pairs with a left-to-right fading trail (rendered separately by parent).
 */
export default function DraftingCursor({ progress, width, height }: Props) {
  // Cursor moves left-to-right with a tiny vertical wobble.
  const x = useTransform(progress, (p) => p * width);
  const y = useTransform(progress, (p) => height / 2 + Math.sin(p * 18) * 3);

  // Crosshair endpoints, kept as MotionValues so SVG attrs stay typed.
  const crosshairX1 = useTransform(x, (v) => Math.max(0, v - 10));
  const crosshairX2 = useTransform(x, (v) => Math.min(width, v + 10));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {/* Trail (left of cursor) — fades to the right */}
      <motion.line
        x1={0}
        y1={height / 2}
        x2={x}
        y2={y}
        stroke="#C9A15D"
        strokeWidth={1.25}
        strokeOpacity={0.85}
        strokeLinecap="round"
      />

      {/* Crosshair tick — vertical */}
      <motion.line
        x1={x}
        x2={x}
        y1={4}
        y2={height - 4}
        stroke="#C9A15D"
        strokeWidth={1}
        strokeOpacity={0.5}
      />
      {/* Crosshair tick — horizontal */}
      <motion.line
        y1={y}
        y2={y}
        x1={crosshairX1}
        x2={crosshairX2}
        stroke="#C9A15D"
        strokeWidth={1}
        strokeOpacity={0.5}
      />

      {/* Cursor body — small brass dot + ring */}
      <motion.g style={{ x, y }}>
        <circle r={3} fill="#C9A15D" />
        <circle r={6} fill="none" stroke="#C9A15D" strokeOpacity={0.45} strokeWidth={1} />
      </motion.g>
    </svg>
  );
}
