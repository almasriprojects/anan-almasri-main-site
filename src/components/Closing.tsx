import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { motionTokens } from "../lib/motion";
import { useBookCall } from "./BookCallModal/context";
import DrawCorners from "./motion/DrawCorners";

export default function Closing() {
  const reduced = useReducedMotion();
  const { openBookCall } = useBookCall();

  return (
    <section
      id="contact"
      className="relative bp-grid border-t border-blueprint-grid/15 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: motionTokens.y.large }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: motionTokens.dur.slow, ease: motionTokens.ease }}
          className="relative border border-blueprint-grid/20 bg-blueprint-surface/50 p-8 md:p-12"
        >
          {/* Animated corner ticks (replaces the static <span> ticks) */}
          <DrawCorners position="tr-bl" delay={0.15} size={22} />

          <div className="mb-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            END OF DRAWING SET
          </div>
          <h2 className="font-mono text-2xl font-bold text-blueprint-paper sm:text-3xl">
            Let's build something precise.
          </h2>
          <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-blueprint-muted">
            Available to hire for a role, or to bring on for a project — AI
            automation, full-stack product builds, and systems architecture.
            Based in Miami — working globally.
          </p>

          {/* INITIATE CONTACT — opens BookCallModal (same behavior as BOOK A CALL) */}
          <motion.button
            type="button"
            onClick={openBookCall}
            initial={reduced ? false : { opacity: 0, y: motionTokens.y.small }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: motionTokens.dur.base, delay: 0.2, ease: motionTokens.ease }}
            whileHover={
              reduced
                ? undefined
                : { y: -2, boxShadow: "0 8px 24px -8px rgba(201,161,93,0.6)" }
            }
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="btn-shimmer relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-sm bg-blueprint-brass px-5 py-3 font-mono text-[12px] font-semibold tracking-annotation text-blueprint-bg transition-colors duration-200 hover:bg-blueprint-brass/90"
          >
            INITIATE CONTACT
            {!reduced && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent"
                style={{
                  animation: "shimmer 3.6s ease-in-out infinite",
                  animationDelay: "1.2s",
                }}
              />
            )}
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          55% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </section>
  );
}
