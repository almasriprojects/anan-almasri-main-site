import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

export interface MousePosition {
  /** Raw clientX in px (MotionValue — subscribe via `useMotionValueEvent` or read in `style`). */
  x: MotionValue<number>;
  /** Raw clientY in px. */
  y: MotionValue<number>;
  /** Normalized [-1, 1] (origin at viewport center). */
  nx: MotionValue<number>;
  /** Normalized [-1, 1] (origin at viewport center). */
  ny: MotionValue<number>;
}

/**
 * rAF-throttled mouse position, exposed as MotionValues so they're cheap to
 * bind to transforms without re-rendering. Used for parallax + the
 * DrawingInspector.
 */
export function useMousePosition(): MousePosition {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);

  useEffect(() => {
    let frame: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const flush = () => {
      frame = null;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      x.set(lastX);
      y.set(lastY);
      nx.set((lastX / w) * 2 - 1);
      ny.set((lastY / h) * 2 - 1);
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (frame == null) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [x, y, nx, ny]);

  return { x, y, nx, ny };
}
