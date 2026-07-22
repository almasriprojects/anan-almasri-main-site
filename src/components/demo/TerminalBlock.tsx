import { motion } from "framer-motion";
import { useTypewriter } from "../../hooks/useTypewriter";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const LINES = [
  "$ n8n trigger.create --source=stripe --event=checkout.session.completed",
  "$ pgvector.search --query=\"client intent\" --top=8 --threshold=0.78",
  "$ agent.invoke --model=claude-3.5 --tools=calendar,email,crm --context=resume",
  "$ supabase.rpc('book_consultation') --slot='2026-07-21 14:30 EST'",
  "$ deploy --env=production --region=mia --canary=10% --watch",
  "$ ✓ deploy.live  |  47ms p95  |  green  |  shipped",
];

/**
 * A live, looping terminal block. Types each line in, holds, deletes, repeats.
 * Used in the demo hero only.
 */
export default function TerminalBlock() {
  const reduced = useReducedMotion();
  const text = useTypewriter(LINES);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: motionTokens.dur.base,
        delay: 0.55,
        ease: motionTokens.ease,
      }}
      className="relative mt-10 overflow-hidden border border-blueprint-grid/20 bg-blueprint-bg/70 backdrop-blur-sm"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-blueprint-grid/15 bg-blueprint-surface/50 px-3 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/80">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blueprint-brass/70" />
          <span className="h-2 w-2 rounded-full bg-blueprint-grid/40" />
          <span className="h-2 w-2 rounded-full bg-blueprint-grid/40" />
        </div>
        <span>anan@ananos ~ live</span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 font-mono text-[12px] leading-relaxed text-blueprint-paper/90">
        <span className="select-none text-blueprint-brass/80">$&nbsp;</span>
        <span aria-live="polite">{text}</span>
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-3.5 w-1.5 -mb-0.5 bg-blueprint-brass align-middle"
          style={{
            animation: reduced
              ? "none"
              : `cursorblink ${motionTokens.cursor.blink}s steps(2) infinite`,
          }}
        />
      </div>

      <style>{`
        @keyframes cursorblink {
          0%, 50%   { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
