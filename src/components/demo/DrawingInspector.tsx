import { motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { useMousePosition } from "../../hooks/useMousePosition";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Right-margin sticky panel that reads the live mouse position on the grid,
 * the time of day, scroll velocity, and the active sheet number.
 *
 * Sprint-1: sheet number is hard-coded "01 / 07" since the demo hero IS sheet 01.
 */
export default function DrawingInspector() {
  const reduced = useReducedMotion();
  const { x, y } = useMousePosition();
  const [time, setTime] = useState(() => new Date());
  const [scrollVel, setScrollVel] = useState(0);
  const [mouseLabel, setMouseLabel] = useState("0, 0");

  // Mirror motion values into string state (cheap, runs only on mousemove).
  useMotionValueEvent(x, "change", (v) => setMouseLabel(`${Math.round(v)}, ${Math.round(y.get())}`));
  useMotionValueEvent(y, "change", (v) => setMouseLabel(`${Math.round(x.get())}, ${Math.round(v)}`));

  // Clock tick
  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Scroll velocity (px / s) — sampled with rAF
  useEffect(() => {
    let last = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    let vel = 0;
    const tick = (now: number) => {
      const dy = Math.abs(window.scrollY - last);
      const dt = Math.max(1, now - lastT);
      vel = vel * 0.85 + ((dy / dt) * 1000) * 0.15;
      last = window.scrollY;
      lastT = now;
      setScrollVel(Math.round(vel));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hh = time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <motion.aside
      initial={reduced ? false : { opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: motionTokens.dur.base,
        delay: 1.0,
        ease: motionTokens.ease,
      }}
      className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 select-none border border-blueprint-grid/20 bg-blueprint-surface/70 px-2.5 py-3 font-mono text-[9px] tracking-annotation text-blueprint-muted/80 backdrop-blur-sm lg:block"
      style={{ width: 156 }}
      aria-hidden="true"
    >
      <Header label="DRAWING INSPECTOR" />
      <KV k="SHEET" v="01 / 07" brass />
      <KV k="MOUSE" v={mouseLabel} />
      <KV k="CLOCK" v={hh} />
      <KV k="SCROLL" v={`${scrollVel} px/s`} />
      <KV k="SCALE" v="1 : 1" />
      <KV k="REV" v="2026.07" brass />
    </motion.aside>
  );
}

function Header({ label }: { label: string }) {
  return (
    <div className="mb-2 flex items-center gap-2 border-b border-blueprint-grid/15 pb-1.5 text-blueprint-brass/80">
      <span className="h-1 w-1 rounded-full bg-blueprint-brass" />
      <span>{label}</span>
    </div>
  );
}

function KV({ k, v, brass }: { k: string; v: string; brass?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="text-blueprint-muted/60">{k}</span>
      <span className={brass ? "text-blueprint-brass" : "text-blueprint-paper/90"}>
        {v}
      </span>
    </div>
  );
}
