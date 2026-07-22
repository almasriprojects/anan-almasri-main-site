import { useEffect, useRef } from "react";

interface Props {
  /** Pre-sampled waypoints (orthogonal edges). */
  points: { x: number; y: number }[];
  /** Total path length (px). */
  length: number;
  /** Travel time for one packet in seconds. */
  duration: number;
  /** Delay (s) before this packet starts. */
  delay: number;
  /** Color. */
  color?: string;
  /** Packet radius (px). */
  r?: number;
}

/**
 * A single brass data packet that animates along an orthogonal waypoint path.
 * Pre-computes cumulative segment lengths, then walks the points linearly
 * with rAF — no re-renders, no React state churn.
 */
export default function FlowParticle({
  points,
  length,
  duration,
  delay,
  color = "#C9A15D",
  r = 3.5,
}: Props) {
  const glowRef = useRef<SVGCircleElement | null>(null);
  const coreRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    if (length <= 0 || points.length < 2) return;

    // Pre-compute cumulative arc-length along the polyline.
    const seg: number[] = [0];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      seg.push(seg[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
    }

    let raf = 0;
    let startT: number | null = null;

    const tick = (now: number) => {
      if (startT == null) startT = now;
      const elapsed = (now - startT) / 1000 - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = (elapsed % duration) / duration;
      const target = t * length;

      // Find current segment via linear scan.
      let i = 1;
      while (i < seg.length - 1 && seg[i] < target) i++;
      const segStart = seg[i - 1];
      const segEnd = seg[i];
      const segLen = segEnd - segStart || 1;
      const local = (target - segStart) / segLen;
      const a = points[i - 1];
      const b = points[i];
      const x = a.x + (b.x - a.x) * local;
      const y = a.y + (b.y - a.y) * local;

      if (glowRef.current) {
        glowRef.current.setAttribute("cx", String(x));
        glowRef.current.setAttribute("cy", String(y));
      }
      if (coreRef.current) {
        coreRef.current.setAttribute("cx", String(x));
        coreRef.current.setAttribute("cy", String(y));
      }

      raf = requestAnimationFrame(tick);
    };

    if (delay > 0) {
      const id = window.setTimeout(() => {
        raf = requestAnimationFrame(tick);
      }, delay * 1000);
      return () => {
        window.clearTimeout(id);
        cancelAnimationFrame(raf);
      };
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points, length, duration, delay]);

  return (
    <g aria-hidden="true">
      <defs>
        <filter id={`pk-glow-${delay.toFixed(2)}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      <circle
        ref={glowRef}
        cx={points[0]?.x ?? 0}
        cy={points[0]?.y ?? 0}
        r={r}
        fill={color}
        filter={`url(#pk-glow-${delay.toFixed(2)})`}
      />
      <circle
        ref={coreRef}
        cx={points[0]?.x ?? 0}
        cy={points[0]?.y ?? 0}
        r={r * 0.55}
        fill="#EDE8DC"
        opacity={0.95}
      />
    </g>
  );
}
