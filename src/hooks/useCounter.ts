import { useEffect, useRef, useState } from "react";

/**
 * Count-up on enter-view. Returns the current value plus a ref to attach.
 * When the element enters the viewport, animates from `from` to `to` over `durationMs`.
 * Respects prefers-reduced-motion (snaps immediately).
 */
export function useCounter(
  to: number,
  opts: { from?: number; durationMs?: number; threshold?: number } = {}
) {
  const { from = 0, durationMs = 1400, threshold = 0.3 } = opts;
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(from);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setValue(to);
      startedRef.current = true;
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const animate = (now: number) => {
              const t = Math.min(1, (now - start) / durationMs);
              // easeOutCubic
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(from + (to - from) * eased));
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, from, durationMs, threshold]);

  return { ref, value };
}
