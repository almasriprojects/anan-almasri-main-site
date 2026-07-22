import { motion } from "framer-motion";
import type { Ref } from "react";
import { useCounter } from "../../hooks/useCounter";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Top-right widget with three live counters + a pulsing "ONLINE" dot.
 * Used in the demo hero only.
 */
export default function LiveSystemStatus() {
  const reduced = useReducedMotion();
  const uptime = useCounter(99.97, { threshold: 0.1 });
  const flows = useCounter(47, { threshold: 0.1 });
  const deploy = useCounter(2, { threshold: 0.1 });

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: motionTokens.dur.base,
        delay: 0.8,
        ease: motionTokens.ease,
      }}
      className="pointer-events-none hidden select-none border border-blueprint-grid/20 bg-blueprint-surface/70 px-3 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted backdrop-blur-sm md:block"
    >
      <div className="mb-2 flex items-center gap-2 text-blueprint-brass/80">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-blueprint-brass/60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-blueprint-brass" />
        </span>
        <span>SYSTEM ONLINE</span>
      </div>

      <Row label="UPTIME" value={uptime.value.toFixed(2)} unit="%" ref={uptime.ref} />
      <Row label="FLOWS" value={String(flows.value)} unit="active" ref={flows.ref} />
      <Row label="LAST DEPLOY" value={String(deploy.value)} unit="min ago" ref={deploy.ref} />
    </motion.div>
  );
}

function Row({
  label,
  value,
  unit,
  ref,
}: {
  label: string;
  value: string;
  unit: string;
  ref: Ref<HTMLSpanElement>;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className="text-blueprint-muted/70">{label}</span>
      <span className="flex items-baseline gap-1.5">
        <span
          ref={ref}
          className="text-[11px] font-semibold text-blueprint-paper"
        >
          {value}
        </span>
        <span className="text-[9px] text-blueprint-muted/60">{unit}</span>
      </span>
    </div>
  );
}
